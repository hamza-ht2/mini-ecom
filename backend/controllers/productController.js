import Product from '../models/Product.js'

export const getProducts = async(req, res)=>{
    try {
        const products = await Product.find()
        if(products.length === 0) return res.status(200).json({message:'db empty'})
        res.status(200).json(products)
    } catch (error) {
        console.error('GET PRODUCTS',error)
        res.status(500).json({message:'server error'})
    }
}

export const getProductById = async(req,res)=>{
    try {
        const id = req.params.id
        const product = await Product.findById(id)
        if(!product) return res.status(404).json({message:'product not found'})
        res.status(200).json(product)
    } catch (error) {
        console.error('GET PRODUCT BY ID ERROR',error)
        res.status(500).json({message:'server error'})   
    }
}

export const addProduct = async(req,res)=>{
    try {
        const {name, price, description, image, category} = req.body
        if(!name || !price || !description || !image || !category){
            return res.status(400).json({message:'all fields are required'})
        }
        const newProduct = await Product.create({name, price, description, image, category})
        res.status(201).json(newProduct)
    } catch (error) {
        console.error('CREATE PRODUCT ERROR',error)
        res.status(500).json({message:'server error'})
    }
}

export const updateProduct =  async(req,res)=>{
    try {
        const id = req.params.id
        const newData = req.body
        const updatedProduct = await Product.findByIdAndUpdate(id,newData,{new:true, runValidators:true})
        if(!updatedProduct) return res.status(404).json({message:'product not found'})
        res.status(200).json(updatedProduct)
    } catch (error) {
        console.error('UPDATE ERROR',error)
        res.status(500).json({message:'server error'})
    }
}

export const deleteProduct = async(req,res)=>{
    try {
        const id = req.params.id
        const deletedProduct = await Product.findByIdAndDelete(id)
        if(!deletedProduct) return res.status(404).json({message:'product not found'})
        res.status(200).json({message:'product deleted successfully!'})
    } catch (error) {
        console.error('DELETE ERROR', error)
        res.status(500).json({message:'server error'})
    }
}