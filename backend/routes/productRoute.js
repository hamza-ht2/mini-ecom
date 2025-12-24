import { getProducts, getProductById, addProduct, deleteProduct , updateProduct } from "../controllers/productController.js";
import express from 'express'
import { authMiddle, adminMiddle } from "../middleware/authMiddleware.js";


const routerProduct = express.Router()
routerProduct.get('/',authMiddle, getProducts)
routerProduct.get('/:id',authMiddle,getProductById)
routerProduct.post('/',authMiddle,adminMiddle,addProduct)
routerProduct.put('/:id',authMiddle, adminMiddle, updateProduct)
routerProduct.delete('/:id',authMiddle,adminMiddle, deleteProduct)

export default routerProduct
