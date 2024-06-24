require("dotenv").config();
require("./Model/");

const cors    = require("cors");
const express = require("express");

const app     = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


const userRoutes    = require("./Routes/userRoutes");
const productRoutes = require("./Routes/productRoutes");

app.use("/user",userRoutes);
app.use('/product',productRoutes);

app.get("/test",(req,res)=>{
    res.status(200).json({
        status: true,
        content:{
            message:"Hi This API is live Now,Enjoy :)"
        }
    });
})


let PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Listening to PORT ${PORT}`);
})