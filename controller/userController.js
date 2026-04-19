const User  = require("../models/User");
// register
exports.registerUser = async (req, res) =>{
    try{

        const {name, email, password, confirmPassword} = req.body;

        //  check all the field are required
        if(!name || !email || !password ||!confirmPassword){
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        // confirm password check
        if(password !== confirmPassword){
            return res.status(400).json({
                message: "password does not match"
            })
        }

        // check the user is exists
        const userExists = await User.findOne({email});

        if(userExists){
            return res.status(400).json({
                message: "user is already exists"
            })
        }

        // create the user

        const user = await User.create({
            name,
            email,
            password
        })
        res.status(201).json({
            message: "User is registered successfully",
            user
        })

    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

// login user

exports.login = async (req, res) =>{
    try{

        const {email, password} = req.body;

        // check the user by email id
        const user = await User.findOne({email});

        if(!user || user.password !== password){
            return res.status(401).json({
                message: "Invalid Credentials"
            })
        }

        res.status(200).json({
            message: "Login is successfull",
            user
        })


    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password").sort({ createdAt: -1 });

        res.status(200).json({
            message: "Users fetched successfully",
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.getHome = async (req, res) =>{
    
}
