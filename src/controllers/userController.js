const Book = require("../models/Book");
const Message = require("../models/Message");
const Room = require("../models/Room")
const User = require("../models/User")
const mongoose = require('mongoose');

exports.dashboard = async (req,res) => {
    const user = req.session.user;
    console.log(user)
    const provinces = await Room.find()
    const rooms = await Room.find({ users: user.id });
    const users = await User.findById(user.id)
    console.log(users)
    if (!req.session.user) {
        return res.redirect('/login'); 
    }


    res.cookie('username', user.username, { 
        maxAge: 24 * 60 * 60 * 1000, 
        httpOnly: false, 
        secure: false 
    });
    
    res.render('user/chatPage', {
        title: 'Dashboard',
        layout: 'layouts/userLayouts',
        rooms,
        user,
        provinces,
        users
    })
}
exports.profilePage = async (req,res) => {
    const userId = req.session.user.id
    const user = await User.findById(userId)
    const getAllBooks = await Book.find({owner: userId}).populate('owner')
    console.log(getAllBooks)
    console.log(getAllBooks.length)
    res.render('user/profilePage', {
        title: 'Profile',
        layout: 'layouts/userLayout2',
        user,
        getAllBooks
    })
}

exports.settings = async (req,res) => {
    const user = req.session.user
    const findUser = await User.findById(user.id)
    console.log(findUser)
    res.render('user/account-page', {
        title: 'Profile',
        layout: 'layouts/userLayout2',
        user,
        findUser
    })
}
exports.event = async (req,res) => {
    const provinces = await Room.find()
    const user = req.session.user;
    const users = req.session.user
    const rooms = await Room.find({ users: users.id });
    res.render('user/events', {
        title: 'Event',
        layout: 'layouts/eventLayout',
        rooms,
        provinces,
        users,
        user
    })
}
exports.settings = async (req, res) => {
    try {
        const userId = req.session.user?.id; 

        if (!userId) {
            return res.redirect('/login');
        }

        const findUser = await User.findById(userId);

        if (!findUser) {
            return res.status(404).send('User not found');
        }

        res.render('user/account-page', {
            title: 'Profile',
            layout: 'layouts/userLayout2',
            findUser
        });
    } catch (err) {
        console.error('Error in settings route:', err);
        res.status(500).send('Server Error');
    }
};

exports.addRoom = async (req, res) => {
    const { province } = req.body; 
    const userId = req.session.user.id; 

    try {
        
        const result = await Room.updateMany(
            { province: province }, 
            { $addToSet: { users: userId } } 
        );

   
        if (result.nModified > 0) {
            const angka =1
        } else {
            return res.status(404).send({ message: 'No rooms found for this province' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'An error occurred', error });
    }
};

exports.sendChat = async (req, res) => {
    const user = req.session.user;  
    console.log(user)
    try {
        const { chat, city, roomType } = req.body; 
        // console.log('Room Type:', req.session.user.roomStatus);
        const roomStatus = req.session.user.roomStatus; 
        

        const messageData = {
            message: chat,
            sender: req.session.user.id,  
            room: roomStatus,
            receiver:   req.session.user.receiver
        };

        if (roomStatus === 'public') {
            messageData.cityRoom = city;  
            messageData.receiver = undefined
        } else if (roomStatus === 'private') {
            if (req.session.user.receiver) {
                messageData.receiver = req.session.user.receiver;  
            } else {
                console.warn('Receiver is not set in session.');
            }
        }

        const message = new Message(messageData);
        await message.save();

        res.status(200).json({ message: 'Pesan berhasil dikirim', data: message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal mengirim pesan' });
    }
};


exports.getMessage = async(req,res) => {
    // const user = req.session.user
    const {city} = req.body
    const messages = await Message.find({cityRoom : city}).populate('sender')
    res.status(200).json({data : messages})
}
exports.updateProfile = async (req, res) => {
    try {
        const { displayName, username, email, password, city } = req.body;
        const userId = req.session.user?.id; 

        if (!userId) {
            return res.status(401).send('User not authenticated.');
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found.');
        }

        user.displayName = displayName || user.displayName;
        user.username = username || user.username;
        user.email = email || user.email;
        user.city = city || user.city;

        if (password && password.length > 0) {
            user.password = await argon2.hash(password);
        }

        if (req.file) {
            user.avatar = req.file.path; 
        }

        await user.save();

        req.session.user = {
            id: user._id,
            displayName: user.displayName,
            username: user.username,
            email: user.email,
            city: user.city,
            avatar: user.avatar
        };

        console.log('Updated session user:', req.session.user);

        res.redirect('/settings');
    } catch (error) {
        console.error('Error during profile update:', error);
        res.status(500).send('An error occurred while updating the profile.');
    }
};


exports.directMessage = async (req, res) => {
    const { chat, targetUsername } = req.body;  
    const userId = req.session.user?.id;

    try {
        const targetUser = await User.findOne({ username: targetUsername });

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });  
        }
        const message = new Message({
            sender: userId,  
            receiver: targetUser._id,  
            message: chat,  
            room: 'private'  
        });

        const savedMessage = await message.save();

        if (savedMessage && savedMessage._id) {
            console.log('Pesan berhasil disimpan:', savedMessage);  
            res.status(200).json({ message: 'Pesan berhasil dikirim', data: savedMessage });
        } else {
            console.log('Pesan gagal disimpan');  
            res.status(500).json({ message: 'Pesan gagal disimpan' });
        }
        

    } catch (error) {

        console.error('Error saat mengirim pesan:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server', error });
    }
};
exports.getAllDm = async (req, res) => {
    const userId = req.session.user.id;
    try {
        const allDm = await Message.find({ room: 'private' ,sender: userId}).populate('receiver')
        res.status(200).json({data: allDm});
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

exports.getMsgById = async(req,res) => {
    const {targetId} = req.body
    const userId = req.session.user.id
    const messages = await Message.find({sender: userId, receiver: targetId}).populate('sender')
    res.status(200).json({data : messages})
}

exports.updateSession = async (req, res) => {
    const { roomStatus, targetUser } = req.body;
    let receiver;
    if (targetUser) {
        const userReceiver = await User.findOne({ username: targetUser });
        receiver = userReceiver ? userReceiver._id : null; 
    }
    const user = req.session.user;
    user.roomStatus = roomStatus;
    if (receiver) {
        user.receiver = receiver;
    }
    
    res.status(200).json({ message: 'Session updated successfully' });
};
exports.uploadBook = async (req, res) => {
    console.log(req.file); // untuk melihat apa yang diterima
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const { title, author, genre, type, description } = req.body;
    const userId = req.session.user.id;
    const coverBook = req.file.path;
    const genresArray = genre.split(',').map(g => g.trim());
    const typesArray = type.split(',').map(t => t.trim());

    const book = new Book({
        title,
        author,
        genre: genresArray,
        type: typesArray,
        description,
        cover: coverBook,
        owner: userId
    });

    await book.save();
    res.redirect('/profilePage');
};
exports.getDetailsBook = async (req, res) => {
    // const userId = req.session.user.id;
    const bookId = req.params.id;
    const bookData = await Book.findById(bookId).populate('owner');
    console.log(bookData)
    res.render('user/detailsBook', {
        title: 'Book Details',
        layout: 'layouts/detailsLayout',
        bookData
    });
};
exports.getDetailsBookVisitor = async (req, res) => {
    // const userId = req.session.user.id;
    const bookId = req.params.id;
    const bookData = await Book.findById(bookId).populate('owner');
    console.log(bookData)
    res.render('user/detailsBookVisitor', {
        title: 'Book Details',
        layout: 'layouts/detailsLayout',
        bookData
    });
};

exports.searchPage = async (req,res) => {
    let getAllBooks = null;
    res.render('user/searchBook', {
        title: 'Search',
        layout: 'layouts/searchLayout',
        user: req.session.user,
        getAllBooks
})
}

exports.searchBook = async(req,res) => {
    const { query } = req.query; 

    try {       
        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },  
                { genre: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } }
            ]
        }).populate('owner');

        res.render('user/searchBook', {
            title: 'Search',
            layout: 'layouts/searchLayout',
            user: req.session.user,
            getAllBooks : books
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

exports.getAllBooks = async (req, res) => {
    const getAllBooks = await Book.find().populate('owner');
    res.status(200).json({data: getAllBooks});
}
exports.getUser = async (req, res) => {
    try {
        const { ownerName } = req.query; 
        const trimmedOwnerName = ownerName.trim();
        const user = await User.findOne({ username: trimmedOwnerName }); 
        console.log(user)
        if (user) {
            res.json({ data : user }); 
        } else {
            res.status(404).json({ message: 'User not found' }); 
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' }); 
    }
};

exports.profileUser = async(req,res) => {
    const { username } = req.params;
    const findUser = await User.findOne({ username: username });
    console.log(findUser)
    const getAllBooks = await Book.find({owner: findUser._id}).populate('owner')
    res.render('user/profileUser', {
        title: 'Profile User',
        layout: 'layouts/profileLayout',
        findUser,
        getAllBooks
    })
}

exports.getAllTypes = async (req, res) => {
    const getAllTypes = await Book.distinct('type');
    res.status(200).json({data : getAllTypes});
}

exports.filterByType = async (req, res) => {
    const { type } = req.params;
    console.log("Query Type:", type); 
    const books = await Book.find({ type: { $in: [type] } }).populate('owner');
    console.log("Filtered Books:", books);
    res.status(200).json({ data: books });
};

exports.getAllGenres = async (req, res) => {
    const getAllGenres = await Book.distinct('genre');
    res.status(200).json({data :getAllGenres});
}

exports.filterByGenre = async (req, res) => {
    const { genre } = req.params;
    console.log("Query Genre:", genre);
    const books = await Book.find({ genre: { $in: [genre] } }).populate('owner');
    console.log("Filtered Books:", books);
    res.status(200).json({ data: books });
};

exports.deleteBook = async (req,res) => {
    const {id} = req.params;
    await Book.findByIdAndDelete(id);
    res.redirect('/profilePage');
}



exports.editBook = async (req, res) => {
    const { id, title, author, genre, type, description } = req.body;
    if (!id) {
        console.error("No ID provided in request body");
        return res.status(400).send("Book ID is missing.");
    }

    try {
        const coverBook = req.file ? req.file.path : null;
        const genresArray = typeof genre === 'string' ? genre.split(',').map(g => g.trim()) : genre;
        const typesArray = typeof type === 'string' ? type.split(',').map(t => t.trim()) : type;

        const book = await Book.findByIdAndUpdate(id, {
            title,
            author,
            genre: genresArray,
            type: typesArray,
            description,
            cover: coverBook
        });

        if (!book) {
            return res.status(404).send('Book not found');
        }

        res.redirect('/profilePage');
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).send('An error occurred while updating the book');
    }
};

exports.logout = async (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};

const Transaction = require('../models/Transaction');
exports.renderTransaction = async (req, res) => {
    const user = req.session.user;
    console.log(user);

    const listTarget = await Message.aggregate([
        { $match: { $or: [{ sender: user.id }, { room: 'private' }] } },
        { $lookup: { from: 'users', localField: 'receiver', foreignField: '_id', as: 'receiver' } },
        { $unwind: '$receiver' },
        { $match: { 'receiver._id': { $ne: new mongoose.Types.ObjectId(user.id) } } },
        { $group: { _id: '$receiver._id', receiver: { $first: '$receiver' } } }
    ]);

    console.log(listTarget);

    const myBook = await Book.find({ owner: user.id });
    console.log(myBook);

    const transactions = await Transaction.find({ sender: user.id }).populate('sender receiver book');
    console.log(transactions);

    res.render('user/transactionPage', {
        title: 'Transaction',
        layout: 'layouts/userLayout2',
        user,
        listTarget,
        myBook,
        transactions
    });
};

exports.getBookReceiver = async (req, res) => {
    async (req, res) => {
      try {
          const receiverId = req.params.receiverId;
          const books = await Book.find({ owner: receiverId });
          res.json(books);
      } catch (error) {
          console.error('Error fetching receiver books:', error);
          res.status(500).json({ error: 'Error fetching receiver books' });
      }
    }
};

exports.createTransaction = async (req, res) => {
    try {
        const { receiver, senderBook, receiverBook, expedition, receiptNumberSender, receiptNumberReceiver } = req.body;
        const user = req.session.user;

        const transaction = new Transaction({
            sender: user.id,
            receiver: receiver,
            senderBook: senderBook,
            receiverBook: receiverBook,
            status: 'PENDING',
            expedition: expedition,
            receiptNumberSender: receiptNumberSender,
            receiptNumberReceiver: receiptNumberReceiver
        });

        await transaction.save();
        res.redirect('/transaction'); // Gantilah dengan halaman yang sesuai
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getTransactionDetails = async (req, res) => {
    try {
        const transactionId = req.params.transactionId;
        const transaction = await Transaction.findById(transactionId).populate('sender receiver');
        console.log(`ini transaction, ${transaction}`);
        console.log(`ini trannsaction id${transactionId}`);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (error) {
        console.error('Error fetching transaction details:', error);
        res.status(500).json({ error: 'Error fetching transaction details' });
    }
};



exports.getTransactionsForReceiver = async (req, res) => {
    try {
        const user = req.session.user;
        const transactions = await Transaction.find({ receiver: user.id, status: 'PENDING' }).populate('sender receiver');
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions for receiver:', error);
        res.status(500).json({ error: 'Error fetching transactions for receiver' });
    }
};




exports.updateTransaction = async (req, res) => {
    try {
        const transactionId = req.params.transactionId;
        const { receiptNumberReceiver } = req.body;

        await Transaction.findByIdAndUpdate(transactionId, {
            receiptNumberReceiver: receiptNumberReceiver,
            status: 'ACCEPTED'
        });

        res.redirect('/transaction-page'); // Gantilah dengan halaman yang sesuai
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.renderTransaction = async (req, res) => {
    const user = req.session.user;
    console.log(user);

    const listTarget = await Message.aggregate([
        { $match: { $or: [{ sender: user.id }, { room: 'private' }] } },
        { $lookup: { from: 'users', localField: 'receiver', foreignField: '_id', as: 'receiver' } },
        { $unwind: '$receiver' },
        { $match: { 'receiver._id': { $ne: new mongoose.Types.ObjectId(user.id) } } },
        { $group: { _id: '$receiver._id', receiver: { $first: '$receiver' } } }
    ]);

    console.log(listTarget);

    const myBook = await Book.find({ owner: user.id });
    console.log(myBook);

    const transactions = await Transaction.find({ sender: user.id }).populate('sender receiver');
    console.log(transactions);

    res.render('user/transactionPage', {
        title: 'Transaction',
        layout: 'layouts/userLayout2',
        user,
        listTarget,
        myBook,
        transactions
    });
};

exports.renderDetailTransaction = async (req, res) => {
    res.render('user/transactionDetails', {
        title: 'Transaction',
        layout: 'layouts/userLayout2',
    });
}