import { ApiResponse } from "../utils/AppResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const healthcheck = asyncHandler(async (req,res) =>{
    return res.status(200).json(new ApiResponse(200,{},"Everything is ok"))
})

export {
    healthcheck
}