const path =require ('path')
const express = require('express')
const http = require('http');
const app = express()
const socketIo = require('socket.io');
const server = http.createServer(app);  // Server HTTP yang sama
const io = socketIo(server);  // Hubungkan ke server HTTP yang sama
const expressLayouts= require('express-ejs-layouts')

const session = require('express-session');
const authRoutes = require('./src/routes/authRoutes')
const userRoutes = require('./src/routes/userRoutes')

const connectDb = require('./src/config/connectDb')


app.set('view engine','ejs')

app.set('views',path.join(__dirname,'src/views'))

app.set('layout', 'layouts/layout');
app.use(express.static(path.join(__dirname,'src/public')))
app.use(express.urlencoded({extended: true}))
app.use(expressLayouts)
app.use(express.json());
app.use(session({
    secret: 'abogoboganaldsHHSd', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));
connectDb()
app.use(authRoutes)
app.use(userRoutes)
io.on('connection', (socket) => {
    console.log('User connected');
  
    // Terima pesan dari client
    socket.on('chatMessage', (msg) => {
      console.log('Message received from client: ' + msg);  // Debugging received message
      io.emit('chatMessage', msg);  // Emit kembali ke semua client
    });
    
    // Saat user disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
  


server.listen(3000, () => {
    console.log('Server running on port 3000');
});

