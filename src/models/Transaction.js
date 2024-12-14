const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    yourBook: {
        type: String
    },
    receiverBook: {
        type: String
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
        default: 'PENDING'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expedition: {
        type: String
    },
    receiptNumberSender: {
        type: String
    },
    receiptNumberReceiver: {
        type: String
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;