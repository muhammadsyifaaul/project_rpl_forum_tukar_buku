
const connectDb = require('./src/config/connectDb')
const Room = require('./src/models/Room')
const User = require('./src/models/User')


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

// async function testDefaultTitle() {
//     const user = new User({
//         username: 'testuser',
//         email: 'testuser@example.com',
//         password: 'testpassword123'
//     });

//     console.log('Before save:', user); // Harus menunjukkan title: 'Initiate of the Quill'
//     await user.save();
//     console.log('After save:', user); // Pastikan title tersimpan

//     await mongoose.disconnect();
// }

// testDefaultTitle();