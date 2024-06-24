const mongoose = require("mongoose");

const DB_URL = process.env.PROD_DB || process.env.DEV_DB;
mongoose.connect(DB_URL)
    .then((data)=>{
        console.log("Connected to Database");
    })
    .catch((err)=>{
        console.log("Something went wrong!");
        console.log(err);
    })