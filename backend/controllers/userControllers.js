const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

const registerUser = asyncHandler(async(req, res) => {
    const {name, email, password, pic} = req.body;

    if(!name || !email || !password){
        res.status(400).json({
            "message":"Incomplete data to register!",
        });;
        throw new Error("Please enter all the required fields!");
    }

    const userExists = await User.findOne({email});
    console.log(userExists);

    if(userExists){
        res.status(201).json({
            "message":"already_exists",
        });
        throw new Error("Email already exists!");
    };

    const user = await User.create({
        name,
        email,
        password,
        pic,

    });

    if(user){
        res.status(201).json({
             "message":"success",
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
            password: user.password
        })

    }else{
        res.status(400);
        throw new Error("Failed to create a new user");
    }

});


const authUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    const userExists = await User.findOne({email});

    // const user = await User.findOne({email});
    
    
    if(user && (await user.matchPassword(password))){
        
        res.status(201).json({
            "message": "valid",
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        }) 
        
    }
    else{
            res.status(400).json({
            "message": "invalid"
        }) 
            // throw new Error("Invalid email address or password");

    }


});

// /api/user?search=piyush
const allUsers = asyncHandler(async(req,res)=>{
    const keyword = req.query.search ? {
        $or :[
            { name: {$regex: req.query.search, $options: "i"}},
            { email: {$regex: req.query.search, $options: "i"}},
        ]

    } : {};

    const users = await User.find(keyword);
    res.send(users);

})

module.exports = {registerUser, authUser, allUsers};