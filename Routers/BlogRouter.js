import express from 'express'
import { createBlog, DeletedBlog, getAllBlogs, getBlogById, updatedBlog } from '../Controller/BlogController.js';

 import middlware from '../Middleware/middleware.js'




const router = express.Router();



 router.get('/blog',  getAllBlogs);


router.post('/blog', createBlog);
router.get('/blog/:id', getBlogById);
router.put('/blog/:id', updatedBlog);
router.delete('/blog/:id', DeletedBlog)


export default router;