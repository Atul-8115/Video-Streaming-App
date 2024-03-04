import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Tweet} from "../models/tweet.model.js"
import { ApiResponse } from "../utils/AppResponse.js";


const createTweet = asyncHandler(async (req,res) => {
    const { content } = req.body

    console.log(content);

    if(!content) {
        throw new ApiError(400, "Please write something for tweeting anything")
    }

    const ownerId = req.user._id

    const tweets = await Tweet.create({
        content: content,
        owner: ownerId
    })

    if(!tweets) {
        throw new ApiError(400,"Failed to tweet")
    }

    return res
           .status(200)
           .json(new ApiResponse(200, tweets, "Successfully created tweet"))
})

const getUserTweets = asyncHandler(async (req,res) => {
    
})
export {
    createTweet,
}