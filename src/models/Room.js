const mongoose = require('mongoose');
const Message = require('./Message')

const roomSchema = mongoose.Schema({
    province: {
        type: String,
        required: true  
    },
    city: {
        type: String,
        required: true  
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'  
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'  
        }
    ]
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
