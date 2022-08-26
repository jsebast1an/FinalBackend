import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import {io} from "../app.js"
import { __dirname } from "../app.js"
import passport from 'passport'
import dotenv from "dotenv"
import nodemailer from "nodemailer"
dotenv.config()
const router = express.Router()

/* session config */
router.use(session({
    saveUninitialized:false,
    resave:false,
    secret:"12345",
    store: MongoStore.create({
        mongoUrl:process.env.CONNECT_MONGO_URL,
        ttl:10
    }),
    cookie: { 
        maxAge : 10000
    }
}))
/* nodemailer config */
const TEST_EMAIL = 'juanselopezg05@gmail.com'
const TEST_PASSWORD = 'sztgquwhkltsnxpe'
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', //host de la cuenta origen
    port: 587,
    auth: {
        user: TEST_EMAIL,
        pass: TEST_PASSWORD,
    }
})
/* email structure  */
const email_structure = {
    from: 'Server nodejs',
    to: TEST_EMAIL,
    subject: 'Test: Sign up',
    html: `
    <p>Your sign up was succesfully completed bro!</p><br>
    <p>Juan Lopez - Coder House student</p>
    `,
}
/* routes */
router.get('/', (req, res) => {
    let user = req.session.user
    if(user) return res.redirect('/products')
    res.sendFile('/public/html/signup.html', { root: __dirname })
})

router.post('/', passport.authenticate('signup', {failureRedirect:'/'}), async (req, res) => {
    let user = req.body
    req.session.user = user
    io.on('connection', socket => {
        socket.emit('user', user)
    })
    /* send mail post */
    try {
        let info =  await transporter.sendMail(email_structure)
        res.redirect('/products')
    } catch (error) {
        res.send(`Email unable to send to ${TEST_EMAIL}`)
        console.log(error)
    }
})

export default router