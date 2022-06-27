import express from "express"
import signupRouter from "./routes/signup.js"
import loginRouter from "./routes/login.js"
import loggedRouter from "./routes/logged.js"
import logoutRouter from "./routes/logout.js"
import productsRouter from "./routes/Products.js"
import cartsRouter from "./routes/Carts.js"
import passport from "passport"
import { Server } from "socket.io"
import { dirname } from 'path'
import { fileURLToPath } from 'url'
export const __dirname = dirname(fileURLToPath(import.meta.url));
import './middlewares/passport.js'

const app = express()
const PORT = process.env.PORT || 8080

/* MIDDLEWARES */
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(express.static(__dirname+'/public'))
app.use(passport.initialize())

/* ROUTES*/
app.use('/signup', signupRouter)
app.use('/login', loginRouter)
app.use('/logged', loggedRouter)
app.use('/logout', logoutRouter)

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

/* SERVER */
const server = app.listen(PORT, () => console.log('Listening'))
export const io = new Server(server)

app.use('*', (req, res) => {
    res.send({error:"Not found", message:`ROUTE: ${req.url} METHOD: ${req.method} is not implemented yet`})
})
