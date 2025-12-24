import { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrder } from "../controllers/orderController.js";
import express from 'express'
import {authMiddle, adminMiddle} from '../middleware/authMiddleware.js'

const routerOrder = express.Router()
routerOrder.post('/',authMiddle, createOrder)
routerOrder.get('/',authMiddle, adminMiddle, getAllOrders)
routerOrder.get('/my-orders',authMiddle, getUserOrders)
routerOrder.get('/:id',authMiddle,getOrderById)
routerOrder.put('/:id',authMiddle, adminMiddle,updateOrder)

export default routerOrder