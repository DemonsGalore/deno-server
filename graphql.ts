import { Router } from './deps/oak.ts';
import { applyGraphQL, gql } from './deps/oak_graphql.ts';
import { readJsonSync, v4 } from './deps/std.ts';

import { Book } from './models/books.ts';

let books: Book[] = readJsonSync('./data/books.json') as Book[];

const typeDefs = gql`
    type Book {
        id: ID!
        title: String!
        author: String!
        year: Int!
    }

    input BookInput {
        title: String!
        author: String!
        year: Int!
    }

    type Query {
        books: [Book!]!
        getBook(id: ID!): Book
    }

    type Mutation {
        addBook(input: BookInput): Book!
    }
`;

const resolvers = {
    Query: {
        books: async () => books,
        getBook: async (_: any, { id }: any, context: any, info: any) => {
            const book = books.find(book => book.id === id);

            return book;
        }
    },
    Mutation: {
        addBook: async (_: any, { input: { title, author, year }}: any, context: any, info: any) => {
            const id = v4.generate();
            const newBook = new Book(id, title, author, year);
            books.push(newBook);

            return newBook;
        }
    }
}

const GraphQLService = await applyGraphQL<Router>({
    Router,
    typeDefs,
    resolvers
});

export default GraphQLService;
