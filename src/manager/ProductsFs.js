import fs from "fs"

const pathProducts = '../files/products'

class ProductManager {
    getAll = async () => {
        if (fs.existsSync(pathProducts)) {
            try {
                let data = await fs.promises.readFile(pathProducts, 'utf-8')
                let products = JSON.parse(data);
                return {status:"success", payload: products}

            } catch (error) {
                return {status: error}
            }   
        } else { return {status: "empty", payload: []} }
    }
    getById = async (id) => {
        if(!id) return {status:"error", message: "Id field missing"}
        if (fs.existsSync(pathProducts)) {
            try {
                let data = await fs.promises.readFile(pathProducts, 'utf-8')
                let products = JSON.parse(data);
                let product = products.find( product => product.id == id )
                if(product) return {status:"success", payload: product}
                else return {status: null, message: "product not found"}
            } catch (error) {
                return {status: error}
            }   
        } else { return {status: "empty", payload: []} }
    }

    add = async(product) => {
        if(fs.existsSync(pathProducts)) {  //pregunta si esxiste el file
            try {
                let data = await fs.promises.readFile(pathProducts, 'utf-8')
                let products = JSON.parse(data)
            if(products.length === 0){
                product.id = 1
                products.push(product)
                await fs.promises.writeFile(pathProducts, JSON.stringify(products, null, 2))
                return {status:'added 1 product'}
            }
            product.id = products[products.length-1].id+1
            products.push(product)
            await fs.promises.writeFile(pathProducts, JSON.stringify(products, null, 2))
            return {status:'added 1 product'}

            } catch (error) {
                return {status: error}
            }
        } else {
            try {
                product.id = 1
                await fs.promises.writeFile(pathProducts, JSON.stringify([product], null, 2))
                return {status:'added 1 product'}
            } catch (error) {   
                return {status: error}
            }
        }
    }

    deleteById = async(id) => {
        try {
            let data = await fs.promises.readFile(pathProducts, 'utf-8')
            let products = JSON.parse(data)
            let newProducts = products.filter( prod => prod.id !== parseInt(id) )
            await fs.promises.writeFile(pathProducts, JSON.stringify(newProducts, null, 2))
            return {status:"success", message:"product deleted"}
        } catch (error) {
            return {status:error}
        }
    }

    updateProduct = async(id, updatedProduct) => {
        if (!id) return { status: "error", error: "ID needed" }
        const data = await this.getAll()
        const index = data.payload.findIndex(e => e.id === id)
        data.payload[index] = {...data.payload[index], ...updatedProduct}

        await fs.promises.writeFile(pathProducts, JSON.stringify(data.payload, null, 2))
        return { status: "success", message: "Product updated" }
    }
}

export default ProductManager;