const path =require ('path')
const express = require('express')
const expressLayouts= require('express-ejs-layouts')
const app = express()
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




app.listen(3000, () => {
    console.log('server running perfectly')
})
