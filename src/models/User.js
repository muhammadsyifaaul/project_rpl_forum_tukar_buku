const mongoose = require('mongoose');
const argon2 = require('argon2')
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
    avatar: {
        type: String, 
        
    },
    displayName: {
        type: String, 
        
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
userSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        argon2.hash(this.password)
            .then(hash => {
                this.password = hash
                next()
            })
            .catch(err => {
                next(err)
            })
    } else {
        next() 
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;
