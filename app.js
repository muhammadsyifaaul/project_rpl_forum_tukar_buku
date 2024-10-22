const path = require('path');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const sharedSession = require('express-socket.io-session'); // For sharing session between express and socket.io
const multer = require('multer')

const app = express();
const server = http.createServer(app);  
const io = socketIo(server);

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const connectDb = require('./src/config/connectDb');

// Set up EJS and static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.set('layout', 'layouts/layout');
app.use(express.static(path.join(__dirname, 'src/public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(express.json());

// Configure session middleware
const sessionMiddleware = session({
    secret: 'abogoboganaldsHHSd', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
});

// Use session middleware in express
app.use(sessionMiddleware);

// Connect to DB
connectDb();


// Use routes
app.use(authRoutes);
app.use(userRoutes);

// Share session middleware between express and socket.io
io.use(sharedSession(sessionMiddleware, {
    autoSave: true // Automatically save session changes
}));

// Socket.io connection
io.on('connection', (socket) => {
    console.log('User connected');

    // Use session to get username when receiving chat message
    socket.on('chatMessage', (msg) => {
        const user = socket.handshake.session.user;
        const username = user ? user.username : 'Unknown User';
        const timestamp = new Date().toLocaleString();
    
        console.log(`Message from ${username} at ${timestamp}: ${msg}`);  // Log untuk debugging
    
        io.emit('chatMessage', {
            message: msg,
            username: username,
            timestamp: timestamp
        });
    });
    

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server running on port 3000');
});
