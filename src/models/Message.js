const mongoose = require('mongoose');
const User = require('./User')
const Room = require('./Room');
const messageSchema = mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true
    },
    room: {
        type: String,
        enum: ['public','private']
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cityRoom:{
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now  
    }
});
messageSchema.pre('save',function(next) {
    if(this.room !== 'public') {
        this.cityRoom = undefined;
        next()
    }else {
        this.receiver = undefined;
    }
    next()
})

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
