import express  from 'express';

import { login, register } from "../Controller/userController.js";

import { middlware } from "../Middleware/middleware.js";




const router = express.Router();


router.post("/register",  register);
router.post("/login", login);


export default router;