const mongoose = require('mongoose')

const book = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: "books",
    },
    auther: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Book = mongoose.model('Book', book);

module.exports = Book;