import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/AppResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!videoId) {
        throw new ApiError(400,"Video Id is required.")
    }

    const vid = await Video.findById(videoId)

    if(!vid) {
        throw new ApiError(501,"Video is not present.")
    }

    const comments = await Comment.find({video:videoId}).skip((page-1)*limit).limit(limit)

    return res
           .status(200)
           .json(new ApiResponse(200,{comments},"Video comments are fetched successfully."))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params
    const { content } = req.body
    const ownerId = req.user._id

    if(!videoId) {
        throw new ApiError(400,"Video Id is not present.")
    }

    if(!content) {
        throw new ApiError(400,"Write something to comment.")
    }

    const comment = await Comment.create({
        content: content,
        video: videoId,
        owner: ownerId 
    })

    if(!comment) {
        throw new ApiError(500,"Something went wrong while commenting.")
    }

    return res
           .status(200)
           .json(new ApiResponse(200,{comment},"Commented successfully."))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { content } = req.body
    const { commentId } = req.params

    if(!content) {
        throw new ApiError(400,"Write something to update the comment.")
    }

    if(!commentId) {
        throw new ApiError(400,"Comment id is not present.")
    }

    const comment = await Comment.findById(commentId)

    if(!comment) {
        throw new ApiError("Comment is not present.")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        {_id:commentId},
        {content:content},
        {new:true}
    )

    return res
           .status(200)
           .json(new ApiResponse(200,{updatedComment},"Comment updated successfully."))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    try {
        const { commentId } = req.params
    
        const comment = await Comment.findById(commentId)
    
        if(!comment) {
            throw new ApiError(404,"Comment not found.")
        }
    
        await Comment.findByIdAndDelete(commentId);
    
        return res
               .status(200)
               .json(new ApiResponse(200,"Comment deleted successfully"))
    } catch (error) {
        console.log("ERROR MESSAGE: ",error.message)
        throw new ApiError("Something went wrong while deleting the comment.")
    }
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}