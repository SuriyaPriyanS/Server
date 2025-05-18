import mongoose from 'mongoose';
import dotenv from "dotenv";


dotenv.config();



const mongodb_url = process.env.MONGODB_URL;

const connectDB =  async (req , res)=> {
    try {
        const connection = await mongoose.connect(mongodb_url);

        console.log("Connection mongoose sucessfully");
        return connection;
    } catch (error) {
          console.log(error);
    }
};

export default connectDB;