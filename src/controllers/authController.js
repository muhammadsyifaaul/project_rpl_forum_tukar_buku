const User = require("../models/User")
const argon2 = require('argon2')
exports.registerForm = (req,res) => {
    res.render('auth/register', {
        title: 'Register',
        layout: 'layouts/authLayouts'
    })
}
exports.loginForm = (req,res) => {
    res.render('auth/login', {
        title: 'Login',
        layout: 'layouts/authLayouts'
    })
}
exports.register = async (req, res) => {
    try {
        // Ambil data dari request body
        const { username, email, password } = req.body;

        // Buat user baru dengan constructor
        const user = new User({
            username: username,
            email: email,
            password: password,
        });

        // Debug sebelum menyimpan ke database
        console.log('Before save:', user); // Harus menunjukkan title: 'Initiate of the Quill'

        // Simpan user ke database
        await user.save();


        console.log('After save:', user);


        return res.redirect('/login');
    } catch (error) {
        // Tangani error jika terjadi
        console.error('Error during registration:', error);
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
        console.log('User not found');
        return res.redirect('/login');
    }

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {

        return res.redirect('/login');
    }
    req.session.user = {
        id: user._id,
        username: user.username,
        email: user.email,
    };


    res.redirect('/dashboard');
};
