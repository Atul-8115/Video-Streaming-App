import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Tweet} from "../models/tweet.model.js"
import { ApiResponse } from "../utils/AppResponse.js";
import mongoose,{ isValidObjectId } from "mongoose";


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
    const {userId} = req.query

    if(!userId) {
        throw new ApiError(400,"No user id found")
    }

    if(!isValidObjectId(userId)) {
        throw new ApiError(401, "Bad request")
    }

    console.log(new mongoose.Types.ObjectId(userId));
    const tweets = await Tweet.find({owner: new mongoose.Types.ObjectId(userId)})

    if(!tweets) {
        throw new ApiError(402, "No tweets are available")
    }
    console.log(tweets);

    if(tweets.length === 0) {
        return res
           .status(200)
           .json(new ApiResponse(200,"There is no tweets available for this user"))
    }

    return res
           .status(200)
           .json(new ApiResponse(200,tweets,"Successfully fetched all the tweets"))
})

const updateTweet = asyncHandler(async (req, res) => {
    const { content } = req.body
    const { tweetId } = req.params

    if(!tweetId) {
        throw new ApiError(400,"Tweet is not available")
    }

    if(!content) {
        throw new ApiError(401,"Please write something for updating the old tweet")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content:content
            }
        },
        {
            new: true
        }
    )

    if(!updateTweet) {
        throw new ApiError(500,"Something went wrong")
    }

    return res
           .status(200)
           .json(new ApiResponse(200,updatedTweet,"Tweet updated successfully"))

})

const deleteTweet = asyncHandler(async (req,res) => {
    const { tweetId } = req.params

    if(!tweetId) {
        throw new ApiError(400,"Tweet is not available")
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    if(!deletedTweet) {
        throw new ApiError(500,"Something went wrong")
    }

    return res
           .status(200)
           .json(new ApiResponse(200,deletedTweet,"Tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}