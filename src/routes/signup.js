import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import {io} from "../app.js"
import { __dirname } from "../app.js"
import passport from 'passport'
import dotenv from "dotenv"
dotenv.config()
const router = express.Router()

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

router.get('/', (req, res) => {
    let user = req.session.user
    if(user) return res.redirect('/logged')
    res.sendFile('/public/html/signup.html', { root: __dirname })
})
router.post('/', passport.authenticate('signup', {failureRedirect:'/'}),(req, res) => {
    let user = req.body
    req.session.user = user
    io.on('connection', socket => {
        socket.emit('user', user)
    })
    res.redirect('/logged')
})

export default router