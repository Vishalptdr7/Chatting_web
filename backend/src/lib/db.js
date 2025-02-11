import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";

export const connectDB=asyncHandler(async(req,res)=>{

    try {
       const conn= await mongoose.connect(process.env.MONGODB_URI);
       console.log("Connected to MongoDb database:"+conn.connection.host)
    } catch (error) {
        console.error("Error connecting to MongoDB",error);
        process.exit(1);
    }
    })