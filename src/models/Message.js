const mongoose = require('mongoose');
const User = require('./User')
const Room = require('./Room')
const messageSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room', 
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now  
    }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
