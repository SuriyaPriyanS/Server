import User from "../Models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Blog from '../Models/postModel.js'

export const getProfile = async (req, res) => {
  try {
     console.log(req.user);

    const user = await User.findById(req.user.userDetails);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ id: user._id, name: user.name, email: user.email, createdAt: user.createdAt });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user.userDetails);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      user.password = password;
    }
    await user.save();
    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userDetails);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await Blog.deleteMany({ author: user._id });
    await user.deleteOne();
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete account' });
  }
};