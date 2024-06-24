const SECRET = process.env.SECRET;
const jwt    = require("jsonwebtoken");
const User   = require("../Model/User");
const Product = require("../Model/Product");

const AddProduct = async(req,res)=>{
    try{
        const {
            id,
            title,
            price,
            description,
            category,
            image,
            rating,
            quantity
        } = req.body;

        let { rate , count } = rating;

        let token = req.headers.token;
        if(!token){
            return res.status(401).json({
                status: false,
                errors:[
                    {
                        message:"You need to login first!!",
                        code:"UNAUTHORIZED"
                    }
                ]
            });
        }

        // Get the user
        let payload = jwt.decode(token);
        
        let user = await User.findById(payload.id);
        if(!user){
            return res.status(404).json({
                status: false,
                errors:[
                    {
                        message:'No User was not Found',
                        code:"404 User"
                    }
                ]
            });
        }

        // Check if there is a Product with above Id in the DB if there is one then just get 
        // it and push it to the user's Product Array If not create One and do the same

        let product = await Product.findOne({productId:id});
        if(product){
            user.products.unshift(product);
            await user.save();
            return res.status(200).json({
                status: true,
                content:{
                    data:{
                        product
                    }
                }
            });
        }

        // If Not Just create One
        let details = {
            productId: id,
            title,
            description,
            image,
            price,
            category,
            quantity,
            rating: rate,
            reviews: count
        }
        let newProduct = await Product.create(details);
        user.products.unshift(newProduct);
        await user.save();

        res.status(200).json({
            status: true,
            content:{
                data:{
                    product: newProduct
                }
            }
        });
    }
    catch(err){
        console.log("Something went Wrong: ",err);
    }
}

const checkCartProduct = async(req,res)=>{
    try{
        let {token} = req.headers;

        if(!token){
            return res.status(401).json({
                status: false,
                errors:[
                    {
                        message:"You need to login first.",
                        code:"UNAUTHORIZED"
                    }
                ]
            });
        }

        let { id } = jwt.decode(token);
        let user = await User.findById(id).populate({ path:'products' });
        if(!user){
            return res.status(404).json({
                status: false,
                errors:[
                    {
                        message:"No user was found with this Id",
                        code:"RESOURCE_NOT_EXISTS"
                    }
                ]
            });
        }

        let { productId } = req.query;
        let requiredProduct = user.products.filter((item)=> item.productId === productId);
        if(requiredProduct.length){
            return res.status(200).json({
                status: true,
                content:{
                    data:{
                        exists: true,
                        product: requiredProduct
                    }
                }
            })
        }else{
            return res.status(200).json({
                status: true,
                content:{
                    data:{
                        exists: false,
                    }
                }
            })
        }

        
    }   
    catch(err){
        console.log("Something went wrong..");
        console.log(err);
    }
}

const removeFromCart = async(req,res)=>{
    try{
        let {token} = req.headers;
        if(!token){
            return res.status(401).json({
                status: false,
                errors:[
                    {
                        message:"You need to login first.",
                        code:"UNAUTHORIZED"
                    }
                ]
            });
        }

        let { id } = jwt.decode(token);
        let user = await User.findById(id).populate({ path:'products' });
        if(!user){
            return res.status(404).json({
                status: false,
                errors:[
                    {
                        message:"No user was found with this Id",
                        code:"RESOURCE_NOT_EXISTS"
                    }
                ]
            });
        }

        let { productId } = req.query;
        if(!productId) console.log("Product Id is undefined")

        console.log("Before Removal",user.products);
        let requiredProducts = user.products.filter((item)=> item.productId != productId);
        user.products = requiredProducts;
        await user.save();
        console.log("After removal: ",user.products);

        return res.status(200).json({
            status: true,
            content:{
                data: user.products
            }
        });

    }  
    catch(err){
        console.log("Something went wrong: ",err);
    }
}

const getCartProducts = async(req,res)=>{
    try{
        let { token } = req.headers;
        if(!token){
            return res.status(401).json({
                status: true,
                errors:[
                    {
                        message:"You need to login first",
                        code:"UNAUTHORIZED",
                    }
                ]
            });
        }

        let { id } = jwt.decode(token);
        let user = await User.findById(id).populate({ path:'products' });
        if(!user){
            return res.status(404).json({
                status: false,
                errors:[
                    {
                        message:"No user found with this Id",
                        code:"RESOURCE_NOT_EXISTS"
                    }
                ]
            });
        }

        res.status(200).json({
            status: true,
            content:{
                data: user.products
            }
        });

    }
    catch(err){
        console.log("Something went wrong: ",err);
    }
}

module.exports = {
    AddProduct,
    removeFromCart,
    checkCartProduct,
    getCartProducts
}