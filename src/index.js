import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app }  from "./app.js";

dotenv.config({
    path: './.env'
})


/*   Connecting DB using IIFE   */
// ( async () => {
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) 
//        console.log("DB is connected successfully");
//     } catch (error) {
//         console.log("ERR: ",error);
//         throw error
//     }
// })()

// Async function always returns a promise so it is better to use then, catch block

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log("ERROR: ",error);
        throw error
    })
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ",err);
})



















/*
import express from "express";
const app = express();

( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("ERROR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("ERROR: ", error);
        throw err
    }
})() 
*/