
const connectDb = require('./src/config/connectDb')
const Room = require('./src/models/Room')


connectDb()
// const room = new Room({
//     province: 'Jawa Timur',
//     city: 'Surabaya',
//     users: [],
//     messages: [],
// })
const rooms = [
    {
        province: 'Jawa Timur',
        city: 'Surabaya',
        users: [],
        messages: [],
    },
    {
        province: 'Jawa Timur',
        city: 'Malang',
        users: [],
        messages: [],
    },
    {
        province: 'Jawa Barat',
        city: 'Bandung',
        users: [],
        messages: [],
    },
    {
        province: 'Jawa Tengah',
        city: 'Semarang',
        users: [],
        messages: [],
    }
]

Room.insertMany(rooms)
.then((result) => console.log('data sukses ditambahkan'))
.catch((err) => console.log(err))