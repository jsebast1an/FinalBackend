import express from 'express'
import { productDao } from '../DAOs/index.js'
import adminMiddleware from '../middlewares/Admin.js'
import uploader from '../services/Upload.js'
const router = express.Router()

/* CREATE PRODUCTO */
router.post('/', uploader.single('file'), (req, res) => {
    let product = req.body
    let file = req.file
    if(!file) return res.status(500).send({error:'Not uploaded file'})
    product.thumbnail = req.protocol+'://'+req.hostname+':8080/img/'+file.filename
    product.price = parseInt(product.price)
    productDao.add(product).then(result => res.send(result))
})

/* READ TODOS LOS PRODUCTOS */
router.get('/', async (req, res) => {
    const products = await productDao.getAll();
    res.json({products, message:'products found'})
})

/* READ PROD POR ID */
router.get('/:id', (req, res) => {
    let id = req.params.id
    productDao.getById(id).then(result => res.send(result) )
})



/* UPDATE PRODUCTO */
router.put('/:id',(req, res) => {
    const id = req.params.id
    const updateProduct = req.body;
    // if( id < 0 || isNaN(id) ) return res.status(400).send({ error:"error", message:"Product Id is incorrect" })
    productDao.updateProduct(id, updateProduct).then(result => res.send(result))
})

/* ELIMINAR PRODUCTO */
router.delete('/:id', adminMiddleware, (req, res) => {
    let id = req.params.id
    productDao.deleteById(id).then(result => res.send(result) )
})

export default router