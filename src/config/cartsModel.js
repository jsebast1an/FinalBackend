import mongoose from 'mongoose'



const cartsSchema = new mongoose.Schema({
    products:{
        type:Array,
        default: []
    },
    timestamp:{
        type: Number,
        default:new Date().getFullYear()
    },
})

const cartsServiceSchema = mongoose.model('carts', cartsSchema)

export default cartsServiceSchema