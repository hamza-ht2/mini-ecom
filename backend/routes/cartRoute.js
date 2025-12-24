import { getCart, addToCart, removeFromCart } from "../controllers/cartController.js";
import express from 'express'
import {authMiddle, adminMiddle} from '../middleware/authMiddleware.js'


const routerCart = express.Router()

routerCart.get('/',authMiddle, getCart)
routerCart.post('/add',authMiddle, addToCart)
routerCart.delete('/:productId',authMiddle, removeFromCart)


export default routerCart