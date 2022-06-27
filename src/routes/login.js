import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import passport from "passport"
import {io} from "../app.js"
import {__dirname} from "../app.js"
import dotenv from "dotenv"
dotenv.config()
const router = express.Router()

/* SESSION CONFIG */
router.use(session({
    saveUninitialized:false,
    resave:false,
    secret:"12345",
    store: MongoStore.create({
        mongoUrl:process.env.CONNECT_MONGO_URL,
        ttl:3600
    }),
    cookie: { 
        maxAge : 3600000
    }
}))

/* LOGIN */
router.get('/', (req, res)=> {
    let user = req.session.user
    if(user) return res.redirect('/logged')
    res.sendFile('/public/html/login.html', { root: __dirname })
})

router.post('/', passport.authenticate('login', {failureRedirect:'/'}), (req, res)=> {
    let user = req.body
    req.session.user = user
    io.on('connection', socket => {
        socket.emit('user', user)
    })
    res.redirect('/logged')    
})

export default router
