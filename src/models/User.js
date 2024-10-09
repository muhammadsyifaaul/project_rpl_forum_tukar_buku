const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true
    },
    avatar: {
        type: String, 
        required: false
    },
    displayName: {
        type: String, 
        required: true
    },
    books: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'  
        }
    ],
    rooms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'  
        }
    ]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
