const path =require ('path')
const express = require('express')
const expressLayouts= require('express-ejs-layouts')
const app = express()


app.set('view engine','ejs')

app.set('views',path.join(__dirname,'src/views'))

app.use(express.static(path.join(__dirname,'src/public')))
app.use(expressLayouts)
app.get('/', (req, res) => {
    res.render('auth/register')
})
app.get('/register', (req, res) => {
    res.render('auth/register')
})
app.get('/login',(req,res) => {
    res.render('auth/login')
})


app.listen(3000, () => {
    console.log('server running perfectly')
})