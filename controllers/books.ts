import { v4 } from 'https://deno.land/std@0.65.0/uuid/mod.ts';
import { readJsonSync } from 'https://deno.land/std@0.68.0/fs/mod.ts';
import { Context, Request, Response, RouteParams } from 'https://deno.land/x/oak@v6.1.0/mod.ts';

import { Book } from '../models/books.ts';

let books: Book[] = readJsonSync('./data/books.json') as Book[];

// @desc    Get all books
// @route   GET /api/books
export const getBooks = ({ response }: Context) => {
    response.body = {
        success: true,
        data: books
    };
};

// @desc    Get single book
// @route   GET /api/books/:id
export const getBook = ({ params, response }: { params: RouteParams, response: Response }) => {
    const { id } = params as { id: string };
    const book: Book | undefined = books.find(p => p.id === id);

    if (book) {
        response.body = {
            success: true,
            data: book
        };
    } else {
        response.status = 404;
        response.body = {
            success: false,
            msg: 'No book found'
        };
    }
};

// TODO: validation
// @desc    Add book
// @route   POST /api/books
export const addBook = async ({ request, response }: Context) => {
    const body = await request.body();

    if (!request.hasBody) {
        response.status = 400;
        response.body = {
            success: false,
            msg: 'No data'
        };
    } else {
        let book: Book = await body.value;
        book.id = v4.generate();
        books.push(book);

        response.status = 201;
        response.body = {
            success: true,
            data: book
        };
    }
};

// @desc    Update book
// @route   PUT /api/books/:id
export const updateBook = async ({ params, request, response }: { params: RouteParams, request: Request, response: Response }) => {
    const { id } = params as { id: string };
    const book: Book | undefined = books.find(p => p.id === id);

    if (book) {
        const body = await request.body();

        const updateData: { name?: string, description?: string, price?: number } = await body.value;

        books = books.map(p => p.id === id ? { ...p, ...updateData } : p);

        response.body = {
            success: true,
            data: books
        };
    } else {
        response.status = 404;
        response.body = {
            success: false,
            msg: 'No book found'
        };
    }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
export const deleteBook = ({ params, response }: { params: RouteParams, response: Response }) => {
    const { id } = params as { id: string };
    const book: Book | undefined = books.find(p => p.id === id);

    if (book) {
        books = books.filter(p => p.id !== id);

        response.status = 204;
        response.body = {
            success: true,
            msg: 'Book removed'
        };
    } else {
        response.status = 404;
        response.body = {
            success: false,
            msg: 'No book found'
        };
    }
};
