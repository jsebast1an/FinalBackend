import express from 'express'
import { cartDao } from '../DAOs/index.js'

const router = express.Router()

/* LISTAR PRODUCTOS DEL CARRITO */
router.get('/:id/products', (req, res) => {
    let id = req.params.id
    cartDao.getProducts(id).then(result => res.send(result) )
})

/* CREAR CARRITO*/
router.post('/', (req, res) => {
    const cart = {
        products: [],
        timestamp: new Date().getFullYear(),
    }
    cartDao.addCart(cart).then(result => res.send(result))
})

/* ADD PRODUCT AL CARRITO */
router.post('/:id/products', (req, res) => {
    const cartId = req.params.id 
    const productId = req.body.productId
    console.log(cartId, productId)
    //if( cartId < 0 || isNaN(cartId) ) return res.status(400).send({ error:"error", message:"idCart is incorrect" })

    cartDao.addProduct(cartId, productId).then(result => res.send(result))
})

/* BORRAR PRODUCTO DE CARRITO */
router.delete('/:id/products/:id_prod', (req, res) => {
    const cartId = req.params.id
    const productId = req.params.id_prod
    console.log(cartId, productId)
    //if( cartId < 0 || isNaN(cartId) ) return res.status(400).send({ error:"error", message:"idCart is incorrect" })

    cartDao.deleteProduct(cartId, productId).then(result => res.send(result) )
})

/* BORRAR CARRITO */
router.delete('/:id', (req, res) => {
    let id = req.params.id
    cartDao.deleteById(id).then(result => res.send(result) )
})

export default router