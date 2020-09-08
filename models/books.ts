export class Book {
    id: string;
    title: string;
    author: string;
    year: number;

    constructor(id: string, title: string, author: string, year: number) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.year = year;
    }
}
