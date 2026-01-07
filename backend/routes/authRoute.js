import {register, login, getProfile} from '../controllers/authController.js'
import express from 'express'
import { authMiddle } from '../middleware/authMiddleware.js'

const routerAuth = express.Router()

routerAuth.post('/register', register)
routerAuth.post('/login', login)
routerAuth.get('/profile', authMiddle, getProfile)

export default routerAuth