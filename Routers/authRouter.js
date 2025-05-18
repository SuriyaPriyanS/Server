import express from 'express';
import { getProfile, updateProfile , deleteProfile} from '../Controller/authController.js';
import middlware from '../Middleware/middleware.js';




const router = express.Router();



router.get("/profile", middlware,  getProfile);
router.put("/profile",middlware,  updateProfile);
router.delete("/profile",middlware,  deleteProfile);



export default router;

