const mongoose = require('mongoose');
import Book from "../models/Books.js"
// const { expect } = require('chai');

describe('Book Model', () => {
    it('should create a new book', async () => {
        const bookData = {
            name: 'Test Book',
            price: 19.99,
            description: 'A product for testing',
            category: 'Test Category',
        };

        const book = new Books(bookData);
        const savedBook = await Book.save();

        expect(savedBook.name).to.equal('Test Book');
        expect(savedBook.price).to.equal(19.99);
    });

    afterEach(async () => {
        await Product.deleteMany({});
    });

    after(async () => {
        mongoose.connection.close();
    });
});