import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/likes.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { ApiResponse } from "../utils/AppResponse.js"
import { Comment } from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const video = await Video.findById(videoId)
    if(!video) {
        throw new ApiError(404,"Video not found.")
    }
    const userId = req.user._id
    const like = await Like.findOne({video:videoId})
    if(!like) {
        const likedVideo = await Like.create({
            video: videoId,
            likedBy: userId
        })
        return res
               .status(200)
               .json(new ApiResponse(200,{likedVideo},"Video liked successfully."))
    }
    const likedStatus = like.likedStatus
    likedStatus = !likedStatus
    const result = await like.save()
    return res
           .status(200)
           .json(new ApiResponse(200,{result},"Video disliked successfully."))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const comment = await Comment.findById(commentId)
    if(!comment) {
        throw new ApiError(404,"Comment not found.")
    }
    const userId = req.user._id
    const like = await Like.findOne({comment:commentId})
    if(!like) {
        const likedComment = await Like.create({
            comment: commentId,
            likedBy: userId
        })
        return res
               .status(200)
               .json(new ApiResponse(200,{likedComment},"Comment liked successfully."))
    }
    const likedStatus = like.likedStatus
    likedStatus = !likedStatus
    const result = await like.save()
    return res
           .status(200)
           .json(new ApiResponse(200,{result},"Comment disliked successfully."))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const tweet = await Tweet.findById(tweetId)
    if(!tweet) {
        throw new ApiError(404,"Tweet not found.")
    }
    const userId = req.user._id
    const like = await Like.findOne({tweet:tweetId})
    if(!like) {
        const likedTweet = await Like.create({
            tweet: tweetId,
            likedBy: userId
        })
        return res
               .status(200)
               .json(new ApiResponse(200,{likedTweet},"Comment liked successfully."))
    }
    const likedStatus = like.likedStatus
    likedStatus = !likedStatus
    const result = await like.save()
    return res
           .status(200)
           .json(new ApiResponse(200,{result},"Comment disliked successfully."))
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user._id
    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: userId,
                video: {$exists: true, $ne: null}
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "likedVideo",
                pipeline: [
                    {
                        $project: {
                            videoFile: 1,
                            thumbnail: 1,
                            title: 1,
                            description: 1,
                            duration: 1,
                            views: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                "likedVideo": {
                    $first: "$likedVideo"
                }
            }
        },
        {
            $project: {
                likedVideo: 1
            }
        }
    ])
    console.log(likedVideos)

    const allLikedVides = likedVideos.map((video) => {console.log(video); return video?.likedVideo})
    return res
           .status(200)
           .json(new ApiResponse(200,allLikedVides,"Fetched all liked videos successfully."))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}