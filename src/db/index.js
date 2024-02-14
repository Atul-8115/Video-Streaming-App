import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const connect = await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connect.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection failed ",error);
        process.exit(1) // is a synchronous operation
    }
}




// const connectDB = async () => {
//     try {
//         const connectionInstance = await mongoose.connect
//         (`${process.env.MONGODB_URI}/${DB_NAME}`)
//         console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
//         // console.log(connectionInstance);
//     } catch (error) {
//         console.log("MONGODB connection error", error);
//         process.exit(1) 
//     }
// }

export default connectDB