const User = require('../models/user')
const Profile = require('../models/profile')
const {hashPassword,comparePassword} = require('../helpers/auth')
const { hash } = require('bcrypt')
const jwt = require('jsonwebtoken')

const test = (req,res)=>{
    res.json('test is working')
    console.log("ol")
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if name was entered
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        
        // Check password criteria
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password is required and should be at least 6 characters long' });
        }
        
        // Check if email is already taken
        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({ error: 'Email is taken already' });
        }
        
        // Hash password
        const hashedPassword = await hashPassword(password);
        
        // Create user
        const user = await User.create({
            name,
            email,
            password,//: hashedPassword,
        });

        // Assuming user creation is successful, send a success response
        return res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


//login end point
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'No user found' });
        }

        //const match = await comparePassword(password, user.password);

        if (user.password !== password) {
            return res.status(400).json({ error: 'Incorrect password' });
          }
            jwt.sign(
                { email: user.email, id: user._id, name: user.name },
                process.env.JWT_SECRET,
                {},
                (err, token) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Error signing the token' });
                    }
                    // Assuming you're using cookie-parser middleware for cookies
                    // Adjust accordingly if you're using a different method to set cookies
                    res.cookie('token', token, { httpOnly: true }).json({
                        message: 'Login successful',
                        token, // Send the token to the client, consider also sending user info as needed
                        // userInfo: { name: user.name, email: user.email, id: user._id } // Example, adjust as per requirements
                    });
                }
            );
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getProfile =(req,res)=>{
  
    const {token} = req.cookies
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,{},(err,user)=>{
            if(err) throw err;
            res.json(user)
        })
    }
}
const createProfile = async(req,res)=>{
    const { username, email, phone, gender } = req.body;
    
    try {
        // Assuming you have a method to find and update the user, or create if not found
        const user = await Profile.findOneAndUpdate({ email }, { username, phone, gender }, { new: true, upsert: true });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error aving profile' });
    }
}


module.exports = {test,registerUser,loginUser,getProfile,createProfile}