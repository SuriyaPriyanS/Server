import User from "../Models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();


export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log('Request body:', req.body); // Debug log

   
    if (!name || !email || !password || name.trim() === '' || email.trim() === '' || password.trim() === '') {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for existing user
    const existingUser = await User.findOne(  { email } );
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Generate JWT token
    

    // Send response
    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: newUser._id,
        username: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const login = async (req, res, next) => {

    const { email , password} = req.body;

    if(!email || !password || email === "" || password === "") {

        return next(new Error("Email and  password are Required", 400))
    }

    try {
        const userDetails = await User.findOne({ email});

        if(!userDetails) {
            return next(new Error("Invalid email or password ", 401));
        }

        const token = jwt.sign({ id : userDetails._id, userDetails }, process.env.JWT_SECRET_KEY);
        const { password: passkey, ... rest} = userDetails._doc;
        res.status(200)
        .json({message: 'User logged in successfully', rest, token});
    } catch (error) {
        next(error);
        
    }
}
