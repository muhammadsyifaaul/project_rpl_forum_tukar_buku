const User = require("../models/User")
const argon2 = require('argon2')
exports.registerForm = (req,res) => {
    res.render('auth/register', {
        title: 'Login',
        layout: 'layouts/authLayouts'
    })
}
exports.loginForm = (req,res) => {
    res.render('auth/login', {
        title: 'Login',
        layout: 'layouts/authLayouts'
    })
}
exports.register = async (req,res) => {
    const {username,email,password} = req.body
    const user = new User({
        username,
        email,
        password
    })

    await user.save()

    res.redirect('/login')
}
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
