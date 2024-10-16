const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const connectDb = async () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('database connected')
    })
    .catch((err) => {
        console.log(err)
    })
}

module.exports = connectDb