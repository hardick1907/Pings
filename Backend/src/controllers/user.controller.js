import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcrypt';

export const signup = async (req, res) => {

    const { name, username, email, password } = req.body;
    try {

        if (!name || !email || !password || !username) {
            return res.status(400).json({ message: "All fields are required" });
        }
      
        if (password.length < 7) {
            return res.status(400).json({ message: "Password must be at least 7 characters" });
        }
      
        const existingUserEmail = await User.findOne({ email });
        if (existingUserEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
      
        const existingUserUsername = await User.findOne({ username });
        if (existingUserUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
      
        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            await newUser.save();
      
            res.status(201).json({
              _id: newUser._id,
              name: newUser.name,
              username: newUser.username,
              email: newUser.email,
              profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
        
    } catch (error) {
        console.log("Error in signup controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });  
    }
};

export const login = async (req, res) => {
    
    const {username, password} = req.body;
    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
      
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
        });
        
    } catch (error) {
        console.log("Error in login controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });      
    }
};

export const logout = (req, res) => {
    try {
      res.cookie("jwt", "", { maxAge: 0 });
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.log("Error in logout controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
      const { profilePic } = req.body;
      const userId = req.user._id;
  
      if (!profilePic) {
        return res.status(400).json({ message: "Profile pic is required" });
      }
  
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true }
      );
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log("error in update profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
};

export const checkAuth = (req, res) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
};