import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';//user authenticaon
import { startSession } from 'mongoose';

//contoller function for userlogin and registration
const registerUser = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.status(400).send({success:false, message: 'Please fill all the fields' });
        }

        //encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //store password in database
        const userData ={
            name,email,password: hashedPassword
        }
        //save in mongodb
        const newUser = new userModel(userData);//by default creditbalance would get added
        const user =await newUser.save();

        //token generation for user authentication
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        //send token in response
        res.json({success:true, token, user:{name:user.name}})
    } catch(error){
        console.log(error);
        res.json({success:false, message: error.message });
    }
}

const loginUser = async (req,res)=>{
    try{
        const { email, password } = req.body;

        const user = await userModel.findOne({ email})

        if(!user){
            return res.json({success:false, message: 'User not found' });
        }

        //match password
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            return res.json({success:true, token, user:{name:user.name}});//send token and user data
        }
        else{
            return res.json({success:false, message: 'Invalid credentials' });

        }
    }
    catch(error){
        console.log(error);
        res.json({success:false, message: error.message });
    }
}

//user credit controller function
const userCredits = async (req, res) => {
    try {
        const {userId} = req.body
        const user = await userModel.findById(userId); // comes from middleware
        res.json({
            success: true,
            creditBalance: user.creditBalance,
            user: { name: user.name }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export { registerUser, loginUser, userCredits };