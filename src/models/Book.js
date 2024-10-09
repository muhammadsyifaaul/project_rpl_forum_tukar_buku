const mongoose = require('mongoose')
const User = require('./User')
const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: [String],
        required: true
    },
    genre : {
        type: [String],
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    author: {
        type: String,
        required: true
    }
})

const Book = mongoose.model('Book',bookSchema)
module.exports = Book;