import mongoose from 'mongoose'

const productsCollection = 'products'

const productsSchema = new mongoose.Schema({
    id:{
        type:String,
        default: function uniqueID() {
            return Math.floor(Math.random() * Date.now())
            },
        unique: true
    },
    name:{
        type:String,
        required:[true, 'Name is required']
    },
    price:{
        type:Number,
        required:[true, 'Price is required']
    },
    category:{
        type:String,
        required:[true, 'Price is required']
    },
    stock:{
        type:Number,
        required:[true, 'Stock is required']
    },
    status:{
        type: Boolean,
        default: true,
    },
    thumbnail:String,
})

const productsServiceSchema = mongoose.model(productsCollection, productsSchema)

export default productsServiceSchema; 