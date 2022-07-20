import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import {io} from "../../app.js"
import {__dirname} from "../../app.js"
import dotenv from "dotenv"
import { productDao } from "../../DAOs/index.js"
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

/* Products */
router.get('/', async (req, res)=> {
    let user = req.session.user

    if(user) return res.sendFile('/public/html/products.html', { root: __dirname })
    res.redirect('/login')
})

router.post('/', async (req, res)=> {
    let products = await productDao.getAll()
    io.on('connection', socket => {
        socket.on('sendProd', data => {
            console.log(data)
            const all = products
            io.emit('all', all)
        })
    }) 
    res.redirect('/products')
})

export default router
