import {register, login} from '../controllers/authController.js'
import express from 'express'

const routerAuth = express.Router()

routerAuth.post('/register',register)
routerAuth.post('/login',login)

export default routerAuth