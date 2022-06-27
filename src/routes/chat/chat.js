import express from "express"
import session from "express-session"
import {io} from "../app.js"
import {__dirname} from "../app.js"
const router = express.Router()

/* SESSION CONFIG */
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
router.get('/chat', (req, res) => {
    
} )