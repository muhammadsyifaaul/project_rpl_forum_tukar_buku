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
    city: {
        type: String,
    },
    title: {
        type: String,
        enum: [
            'Initiate of the Quill',
            'Seeker of Pages',
            'Wanderer of Words',
            'Quillbearer Apprentice',
            'Runescribe Adept',
            'Lorebound Nomad',
            'Guardian of Inked Secrets',
        ],
        default: 'Initiate of the Quill', 
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
    ],
    total_transaction : {
        type: Number,
        default: 0
    }


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
