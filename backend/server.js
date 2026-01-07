import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import routerCart from './routes/cartRoute.js'
import routerProduct from './routes/productRoute.js'
import routerAuth from './routes/authRoute.js'
import routerOrder from './routes/orderRoute.js'
import mongoose from 'mongoose'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth', routerAuth)
app.use('/api/products', routerProduct)
app.use('/api/orders', routerOrder)
app.use('/api/cart', routerCart)

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('db connected')
  app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
  })
}).catch(err => console.log(err))