import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user : {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    items : [
        {
            product: {type: mongoose.Schema.Types.ObjectId, ref:'Product', required: true},
            name: {type: String, required:true},
            price: {type: Number, required: true, min: 0},
            quantity: {type: Number, required: true, min:1}
        }
    ],
    total : {type: Number, required: true},
    status: {type: String , enum : ['PENDING','COMPLETED', 'SHIPPED', 'CANCELLED'],default: 'PENDING' ,required: true},
    shippingAddress :{
        street : String,
        city: String ,
        zipcode : String,
        country: String
    },
    paymentMethod : {type: String, required: true ,enum : ['CASH','CARD','PAYPAL','STRIPE','BINANCE'], default: 'CASH'},
    paymentStatus: {type: String , required: true ,enum : ['PENDING', 'PAID', 'FAILED'], default: 'PENDING'}
},{timestamps: true})

export default mongoose.model('Order',orderSchema)