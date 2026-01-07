import Product from '../models/Product.js'

// GET all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
    if(products.length === 0) return res.status(200).json({message: 'db empty'})
    res.status(200).json(products)
  } catch (error) {
    console.error('GET PRODUCTS ERROR', error)
    res.status(500).json({message: 'server error'})
  }
}

// GET product by ID
export const getProductById = async (req, res) => {
  try {
    const id = req.params.id
    const product = await Product.findById(id)
    if(!product) return res.status(404).json({message:'product not found'})
    res.status(200).json(product)
  } catch (error) {
    console.error('GET PRODUCT BY ID ERROR', error)
    res.status(500).json({message:'server error'})
  }
}

// CREATE product with image
export const addProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body
    if(!name || !price || !description || !category){
      return res.status(400).json({message: 'all fields are required'})
    }

    const image = req.file ? `/uploads/products/${req.file.filename}` : undefined

    const newProduct = await Product.create({ name, price, description, category, image })
    res.status(201).json(newProduct)
  } catch (error) {
    console.error('CREATE PRODUCT ERROR', error)
    res.status(500).json({message:'server error'})
  }
}

// UPDATE product with optional new image
export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id
    const newData = { ...req.body }

    if(req.file){
      newData.image = `/uploads/products/${req.file.filename}`
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, newData, { new: true, runValidators: true })
    if(!updatedProduct) return res.status(404).json({message: 'product not found'})
    res.status(200).json(updatedProduct)
  } catch (error) {
    console.error('UPDATE PRODUCT ERROR', error)
    res.status(500).json({message:'server error'})
  }
}

// DELETE product
export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id
    const deletedProduct = await Product.findByIdAndDelete(id)
    if(!deletedProduct) return res.status(404).json({message:'product not found'})
    res.status(200).json({message:'product deleted successfully!'})
  } catch (error) {
    console.error('DELETE PRODUCT ERROR', error)
    res.status(500).json({message:'server error'})
  }
}
