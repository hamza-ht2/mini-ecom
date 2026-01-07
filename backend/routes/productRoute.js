import { getProducts, getProductById, addProduct, deleteProduct , updateProduct } from "../controllers/productController.js";
import express from 'express'
import { authMiddle, adminMiddle } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const routerProduct = express.Router()
routerProduct.get('/',authMiddle, getProducts)
routerProduct.get('/:id',authMiddle,getProductById)
routerProduct.post('/',authMiddle,adminMiddle, upload.single('image'), addProduct)
routerProduct.put('/:id',authMiddle, adminMiddle, upload.single('image'), updateProduct)
routerProduct.delete('/:id',authMiddle,adminMiddle, deleteProduct)

export default routerProduct
