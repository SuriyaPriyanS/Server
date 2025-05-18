import Blog from '../Models/postModel.js'
import User from '../Models/userModel.js';
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();


export const createBlog = async (req, res, next) => {
    try {

         const { title, category, content, image, userId } = req.body;

        console.log(userId);
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        

        const blog = new Blog({
            title,
            category,
            content,
            image,
            author: user.name,
            userId: userId,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const savedBlog = await blog.save();
        res.status(201).json({ message: 'Blog created Successfully', blog: savedBlog });

    } catch (error) {
        res.status(500).json({ message: 'Blog creation failed', error: error.message });
    }
};


export const getAllBlogs = async (req, res, next) => {
    try {
        const { category, author, sort, limit = 10, page = 1 } = req.query;
        
        // Build filter object
        let filter = {};
        if (category) {
            // Allow for case-insensitive category search
            filter.category = { $regex: new RegExp(category, 'i') };
        }
        if (author) {
            // Allow for case-insensitive author search
            filter.author = { $regex: new RegExp(author, 'i') };
        }
        
        // Build sort options
        let sortOptions = {};
        if (sort) {
            // Handle sort parameters like 'createdAt_desc' or 'title_asc'
            const [field, direction] = sort.split('_');
            sortOptions[field] = direction === 'desc' ? -1 : 1;
        } else {
            // Default sort by newest first
            sortOptions = { createdAt: -1 };
        }
        
        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Execute query with pagination and sorting
        const blogs = await Blog.find(filter)
            .sort(sortOptions)
            .limit(parseInt(limit))
            .skip(skip);
            
        // Get total count for pagination info
        const totalBlogs = await Blog.countDocuments(filter);
        
        res.status(200).json({
            success: true,
            count: blogs.length,
            totalBlogs,
            totalPages: Math.ceil(totalBlogs / parseInt(limit)),
            currentPage: parseInt(page),
            blogs
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch blogs', 
            error: error.message 
        });
    }
};


export const getBlogById = async (req, res, next) => {
    try {
        console.log(req.params.id);
        const blog = await Blog.find({ userId: req.params.id });
       
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ blog });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch blog', error: error.message });
    }
};

export const updatedBlog = async (req, res, next) => {
    try {

        
        const blog = await Blog.findById(req.params.id);
         console.log(blog);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        

        const updates = {
            ...req.body,
            updatedAt: new Date()
        };

        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
    } catch (error) {
        res.status(500).json({ message: 'Update failed', error: error.message });
    }
};


export const DeletedBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // if (blog.userId.toString() !== req.user._id.toString()) {
        //     return res.status(403).json({ message: 'Unauthorized' });
        // }

        await blog.deleteOne();
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Delete Failed', error: error.message });
    }
};