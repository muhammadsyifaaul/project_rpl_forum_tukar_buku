const Message = require("../models/Message");
const Room = require("../models/Room")
const User = require("../models/User")

exports.dashboard = async (req,res) => {
    const user = req.session.user;
    const provinces = await Room.find()
    const rooms = await Room.find({ users: user.id });
    const users = await User.findById(user.id)
    // console.log(messages)
    if (!req.session.user) {
        return res.redirect('/login'); 
    }
    
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
    res.render('user/profilePage', {
        title: 'Profile',
        layout: 'layouts/userLayout2',
        user: req.session.user
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
            return res.status(200).send({ message: 'User added to rooms successfully' });
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

    try {
        const targetUser = await User.findOne({ username: targetUsername });

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });  
        }
        const message = new Message({
            sender: user.id,  
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
    
    // Kirim respons setelah memperbarui sesi
    res.status(200).json({ message: 'Session updated successfully' });
};
