const mongoose = require("mongoose")
const { Schema , model } = mongoose;

const productSchema = new Schema({
    productId:{
        type: String,
        required: true
    },
    title:{
        type:String,
        required :true
    },
    description:{
        type:String,
        required: true,
    },
    price:{
        type:String,
        required: true,
    },
    image:{
        type:String,
        required: true
    },
    rating:{
        type: Number,
        required: true
    },
    reviews:{
        type:Number,
        required: true
    },
    category:{
        type:String,
        required: true,
    },
    quantity:{
        type:Number,
        default: 1,
        required: true
    },
    status: {
        type:String,
        required: true,
        enum:['Cart','Bought'],
        default: 'Cart'
    }
});

const Product = model("Product",productSchema);
module.exports = Product;