import fs from "fs"
import { __dirname } from "../app.js";
const pathCarts = '../files/carts'
const pathProducts = '../files/products'

class CartManager {
    getProducts = async (id) => {
        if(!id) return {status:"error", message: "Id field missing"}
        if (fs.existsSync(pathCarts)) {
            try {
                let data = await fs.promises.readFile(pathCarts, 'utf-8')
                let carts = JSON.parse(data);
                let cart = carts.find( cart => cart.id == id )
                if(!cart) return {status:`Cart ${id} do not exist or not found`}
                let products = cart.products
                if(cart.length > 0) return {status:"success", payload: products}
                else{
                    return {status:"success", message: `Cart ${id} is empty`}
                }
            } catch (error) {
                return {status: error}
            }   
        } else { return {status: "empty", payload: []} }
    }

    addCart = async(cart) => {
        if(fs.existsSync(pathCarts)) {  //pregunta si esxiste el file
            try {
                let data = await fs.promises.readFile(pathCarts, 'utf-8')
                let carts = JSON.parse(data)
            if(carts.length === 0){
                cart.id = 1
                carts.push(cart)
                await fs.promises.writeFile(pathCarts, JSON.stringify(carts, null, 2))
                return {status:'added 1 cart'}
            }
            cart.id = carts[carts.length-1].id+1
            carts.push(cart)
            await fs.promises.writeFile(pathCarts, JSON.stringify(carts, null, 2))
            return {status:'added 1 cart'}

            } catch (error) {
                return {status: error, message:"not add"}
            }
        } else {
            try {
                cart.id = 1
                await fs.promises.writeFile(pathCarts, JSON.stringify([cart], null, 2))
                return {status:'added 1 cart'}
            } catch (error) {   
                return {status: error}
            }
        }
    }
    addProduct = async (cartId, productId) => {
        if(!cartId) return {status:"error", message: "cartId field missing"}
        if(!productId) return {status:"error", message: "productId field missing"}
        
        if (fs.existsSync(pathCarts)) {
            try {
                //array carritos
                const carts = JSON.parse(await fs.promises.readFile(pathCarts, 'utf-8'));

                //ahora tenemos que encontrar el producto
                const products = JSON.parse(await fs.promises.readFile(pathProducts, 'utf-8'));
                const idExistProd = products.some( product => product.id === productId );

                let currentCart = [];

                //Map del array Cart para acceder al cart respectivo(cartId) y pushear el productId
                if (idExistProd) {
                    const cartsUpdated = carts.map( cart => {
                        if (cart.id === parseInt(cartId)) {
                            cart.products.push(productId)
                            currentCart = cart
                            return cart

                        } else return cart
                    } )

                    await fs.promises.writeFile(pathCarts, JSON.stringify(cartsUpdated, null, 2))

                    return {status:"success", message:`Product '${productId}' added`, payload: currentCart}
                    
                } else return {status: "error", message: `productId: ${productId} do not exist`}         
                
            } catch (error) {
                return {status: error, message:"add product error"}
            }   
        } else { return {status: "empty", payload: []} }
    }

    deleteById = async(id) => {
        try {
            let data = await fs.promises.readFile(pathCarts, 'utf-8')
            let carts = JSON.parse(data)
            let newProducts = carts.filter( prod => prod.id !== parseInt(id) )
            await fs.promises.writeFile(pathCarts, JSON.stringify(newProducts, null, 2))
            return {status:"success", message:"cart deleted"}
        } catch (error) {
            return {status:error}
        }
    }

    deleteProduct = async (cartId, productId) => {
        if(!cartId) return {status:"error", message: "cartId field missing"}
        if(!productId) return {status:"error", message: "productId field missing"}
        if (fs.existsSync(pathCarts)) {
            try {
                //array carritos
                const carts = JSON.parse(await fs.promises.readFile(pathCarts, 'utf-8'));
                const idExistCart = carts.some( cart => cart.id === parseInt(cartId) );
                if (!idExistCart) return {status:"error", message:"CartId do not exist"}

                //verificar si existe el id del producto a eliminar
                const cartFound = carts.find( cart => cart.id === parseInt(cartId) )
                const idExistProd = cartFound.products.some( prod => prod === parseInt(productId) )

                //Map del array Cart para acceder al cart respectivo(cartId) y pushear el productId
                if (idExistProd && idExistCart) {
                    const cartsUpdated = carts.map( cart => {
                        if (cart.id === cartId) {
                            cart.products = cart.products.filter( prod => prod !== parseInt(productId) )
                            return cart

                        } else return cart
                    } )

                    await fs.promises.writeFile(pathCarts, JSON.stringify(cartsUpdated, null, 2))

                    return {status:"success", message:`Product '${productId}' deleted from cart ${cartId}`, payload: cartsUpdated}
                    
                } else return {status: "error", message: `productId: ${productId} do not exist in cart ${cartId}`}         
                
            } catch (error) {
                return {status: error, message:"add product error"}
            }   
        } else { return {status: "empty", payload: []} }
    }
}

export default CartManager;