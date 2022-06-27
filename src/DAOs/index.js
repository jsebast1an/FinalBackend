import ProductManagerMongo from '../manager/ProductsMongo.js'
import ProductManager from '../manager/ProductsFs.js'
import CartManager from '../manager/CartsFs.js'
import CartManagerMongo from '../manager/CartsMongo.js'

const db = 'mongo';

export let productDao;
export let cartDao;

switch (db) {
    case 'mongo':
        productDao = new ProductManagerMongo()
        cartDao = new CartManagerMongo()
        break;
    case 'fs':
        productDao = new ProductManager()
        cartDao = new CartManager()
        break;
    default:
        break;
}
