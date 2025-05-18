import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import connectDB from "./Databases/config.js";
import userRouter from "./Routers/userRouter.js";
import blogRouter from "./Routers/BlogRouter.js";
import authRouter from "./Routers/authRouter.js";



dotenv.config()

const  app = express();

connectDB();



app.use(cors({
    origin: '*',
    creadentials: true,
}));


app.use(express.json());


app.use((err, req, res, next)=> {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

app.get('/', (req, res)=> {
    res.send("Welcome to api connections");
});


app.use('/api', userRouter);
app.use('/api', blogRouter);
app.use('/api', authRouter);

app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on port ${process.env.PORT}`);
});

