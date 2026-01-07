import Cart from '../models/Cart.js'
import Product from '../models/Product.js'


export const getCart = async(req,res)=>{
    try {
        let cart = await Cart.findOne({user: req.user._id}).populate('items.product')
        if(!cart){
            cart = await Cart.create({
                user: req.user._id,
                items: []
            })
        }
        res.status(200).json(cart)
    } catch (error) {
        console.error('GET CART ERROR',error)
        res.status(500).json({message:'server error'})
    }
}

export const addToCart = async(req,res)=>{
    try {
        const {productId, quantity} = req.body
        if(!quantity || quantity < 1){
            return res.status(400).json({message:'quantity must be at least 1'})
        }
        const product = await Product.findById(productId)
        if(!product) return res.status(404).json({message:'product not found'})
        let cart = await Cart.findOne({user: req.user._id})
        if(!cart){
            cart = await Cart.create({
                user: req.user._id,
                items: []
            })
        }
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        )
        if(existingItemIndex > -1){
            cart.items[existingItemIndex].quantity += quantity
        } else {
            cart.items.push({product: productId, quantity})
        }
        await cart.save()
        await cart.populate('items.product')
        res.status(200).json(cart)
    } catch (error) {
        console.error('ADD TO CART ERROR',error)
        res.status(500).json({message:'server error'})
    }
}

export const removeFromCart = async(req,res)=>{
    try {
        const productId = req.params.productId  // Changed from req.params.id to req.params.productId
        const cart = await Cart.findOne({user: req.user._id})
        if(!cart) return res.status(404).json({message:'cart not found'})
        
        const initialLength = cart.items.length
        cart.items = cart.items.filter(item => item.product.toString() !== productId)
        
        if(cart.items.length === initialLength){
            return res.status(404).json({message:'product not found in cart'})
        }
        
        await cart.save()
        await cart.populate('items.product')
        res.status(200).json(cart)
    } catch (error) {
        console.error('REMOVE ERROR',error)
        res.status(500).json({message:'server error'})
    }
}