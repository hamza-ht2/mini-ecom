import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required:true},
    description: {type: String, required: true},
    image: {type:String},
    category : {type: String , enum : ['electronics', 'clothing', 'food', 'books', 'home', 'sports', 'other'], default: 'other'}
},{timestamps: true})

export default mongoose.model('Product',productSchema)