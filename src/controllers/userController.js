const Room = require("../models/Room")


exports.dashboard = async (req,res) => {
    const user = req.session.user;
    const provinces = await Room.find()
    const rooms = await Room.find({ users: user.id });
    console.log(provinces)
    // console.log(rooms);
    // console.log(user.id);
    if (!req.session.user) {
        return res.redirect('/login'); 
    }
    
    console.log(user)
    res.render('user/chatPage', {
        title: 'Dashboard',
        layout: 'layouts/userLayouts',
        rooms,
        user,
        provinces
    })
}
exports.profilePage = async (req,res) => {
    res.render('user/profilePage', {
        title: 'Profile',
        layout: 'layouts/userLayout2',
        user: req.session.user
    })
}

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

