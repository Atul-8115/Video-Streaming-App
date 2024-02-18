import { ApiError } from "../utils/ApiErrors";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model";


export const verifyJWT = asyncHandler( async (req, _,next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

    try {
        if(!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log("Here I am seeing what is in decodedToken ",decodedToken);
    
        const user = await User.findById(decodedToken._id)
        .select("-password -refreshToken")
    
        if(!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || 
            "Invalid access token")
    }
})