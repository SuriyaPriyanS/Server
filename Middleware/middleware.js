import jwt from 'jsonwebtoken';
import { errorHandler } from '../Utils/Error.js';
import dotenv from 'dotenv';

dotenv.config();

export const middlware = (req, res, next) => {
   
    const authHeader = req.headers.authorization;
    let token;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        
        token = authHeader.split(' ')[1];
    } else {
        
        token = req.headers.token;
    }
    
    if (!token) {
        return next(errorHandler(401, 'No token provided'));
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return next(errorHandler(403, 'Invalid token'));
    }
};

export default middlware;
