import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}`)
        console.log(`\n MongoDB connected !! DB HOST:${connectionInstance.connection.host}`)

    }catch (error){
        consolr.log("MongoDB connection FAILED",error);
        process.exit(1)

    }
}

export default connectDB