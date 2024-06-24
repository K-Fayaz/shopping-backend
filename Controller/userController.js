const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const User   = require("../Model/User");

const SECRET = process.env.SECRET;


const createUser = async(req,res)=>{
    try{
        let { username , email , password } = req.body;

        let user = await User.findOne({email});

        if(user){
            // If there is a user exist with this email
            return res.status(409).json({
                status: false,
                errors:[
                    {
                        param:'email',
                        message:"A user already exists with this email",
                        code:"RESOURCE_EXISTS"
                    }
                ]
            });
        }

        // If there is no user with the provided email ... create one

        let newUser = await User.create(req.body);
        console.log("New User is :",newUser);

        let hashedPassword = await bcrypt.hash(req.body.password,8);
        newUser.password = hashedPassword;
        await newUser.save();
        let options = {
            id: newUser._id,
            username: newUser.username
        };

        let token = jwt.sign(options,SECRET,{
            expiresIn:'24 h',
        });

        console.log("Auth token is :",token);

        res.status(201).json({
            status: true,
            content:{
                data:{
                    user: newUser
                },
                meta:{
                    token
                }
            }
        })

    }
    catch(err){
        console.log("Something went wrong: ");
        console.log(err);
    }
};

const signInUser = async(req,res)=>{
    try{
        const { email , password } = req.body;

        let user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                status: false,
                errors:[
                    {
                        message:"No user exists with this email!",
                        code:"RESOURCE_NOT_EXISTS",
                    }
                ]
            });
        }

        let result = await bcrypt.compare(password,user.password);
        if(result){

            let payload = {
                id: user._id,
                username: user.username
            };

            let token = jwt.sign(payload,SECRET,{
                expiresIn:'24 h'
            });


            return res.status(200).json({
                status: true,
                content:{
                    data:{
                        user: user
                    },
                    meta:{
                        token: token
                    }
                }
            });
        }
        else{
            return res.status(400).json({
                status: false,
                errors:[
                    {
                        param:'Password',
                        message:"Password is incorrect",
                        code:"UNAUTHORISED"
                    }
                ]
            });
        }

    }
    catch(err){
        console.log("Something went wrong",err);
        res.status(400).json({
            status: false,
            errors:[
                {
                    message:'Somethig went wrong',
                    code:"SERVER_ERROR"
                }
            ]
        });
    }
}

module.exports = {
    createUser,
    signInUser
}
