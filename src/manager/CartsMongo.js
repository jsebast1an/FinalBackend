import mongoose from 'mongoose'
import cartsServiceSchema from '../config/cartsModel.js'
import dotenv from 'dotenv'
dotenv.config()


const URL =  process.env.MONGODB

mongoose.connect(URL,{useNewUrlParser:true,useUnifiedTopology:true})

class CartManagerMongo {

    getProducts = async (id) => {
        if(!id) return {status:"error", message: "Id field missing"}
        try {
            let products = await cartsServiceSchema.find({id},{products:1, _id:0})
            return {status:"success", payload: products}
        } catch (error) {
            return {status: error, message:"not cart and products found"}
        }   

    }
    
    addCart = async(cart) => {
        try {
            await cartsServiceSchema.insertMany(cart)
            return {status:'added 1 cart'}
        } catch (error) {
            return {status: error, messagge:"Imposible to add"}
        }
    }
    addProduct = async (cartId, productId) => {
        if(!cartId) return {status:"error", message: "cartId field missing"}
        if(!productId) return {status:"error", message: "productId field missing"}

        const cart = await cartsServiceSchema.findById(cartId)
        if(!cart) return {status:'error', message:`Cart ID:${cartId} not found.`}

        const existProduct = cart.products.some(prod => prod.id_product === productId )

        if (existProduct) {
            try {
                await cartsServiceSchema.findOneAndUpdate({"products.id_product": productId}, {$inc:{"products.$.amount": 1}})
                return {status:"success", message:`Product '${productId}' updated plus 1.`}

            } catch (error) {
                return {status: error, message:"Add product error"}
            }   
        } else { 
            await cartsServiceSchema.findOneAndUpdate({_id: cartId},{$addToSet: {"products":{"id_product": productId, "amount": 1}}})
            return {status: "success", message:"Product added successfully."} 
        }
    }

    deleteById = async(id) => {
        try {
            await cartsServiceSchema.deleteOne({_id: id})
            return {status:"success", message:"cart deleted"}
        } catch (error) {
            return {status:error}
        }
    }

    deleteProduct = async (cartId, productId) => {
        if(!cartId) return {status:"error", message: "cartId field missing"}
        if(!productId) return {status:"error", message: "productId field missing"}

        const cart = await cartsServiceSchema.findById(cartId)
        if(!cart) return {status:'error', message:`Cart ID:${cartId} not found.`}

        let existProduct = cart.products.find(prod => prod.id_product === productId )
        if (existProduct) {
            try {
                cart.products.pull(existProduct)
                await cart.save()
                return {status:"success", message:`Product '${productId}' deleted from cart ${cartId}`}
            } catch (error) {
                return {status: error, message:"delete product error"}
            }   
        } else { return {status:"Try again", message: `Product: ${productId} do not fount in cart: ${cartId}.`} }
    }
}

export default CartManagerMongo;