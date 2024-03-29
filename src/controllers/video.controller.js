import mongoose, {isValidObjectId} from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/AppResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary"




const getAllVideos = asyncHandler(async (req,res) => {
    const { page = 1, limit = 10, query = "", sortBy = 'createdAt', sortType=1, userId } = req.query

    if(!userId) {
        throw new ApiError(400, "No user id found. Please provide valid user id to search for related videos.")
    }
    // prepare video query
    const videoQuery = {
        owner: userId,
        $or: [
            {
                title: {$regex: query, $options: 'i'}
            },
            {
                description: {$regex: query, $options: 'i'}
            }
        ]
    }

    // prepare sot criteria
    const sortCriteria = {}
    sortCriteria[sortBy] = sortType

    // find videos based on query, sort criteria, pagination
    const videos = await Video.find(videoQuery).sort(sortCriteria).skip((page-1)*limit).limit(limit)

    return res.status(200).json(new ApiResponse(200, videos, "Video fetched for the given criteria successfully"))
})

const publishVideo = asyncHandler(async (req,res) => {
    const { title, description } =  req.body

    // console.log(title," ", description);

    if(!title && !description) {
        throw new ApiError(400,"Title and description are required")
    }

    // console.log("I am at line 23");

    // console.log(req.files);

    const videoLocalPath = req.files?.videoFile[0]?.path
    // console.log("I am at line 26");
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if(!videoLocalPath) {
        throw new ApiError(400,"Video is not present")
    }

    if(!thumbnailLocalPath) {
        throw new ApiError(400, "Thumnail is not present")
    }

    // console.log("Local path of the video:- ",videoLocalPath," Local path of thumbnail ",thumbnailLocalPath)
    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!video) {
        throw new ApiError(401,"Video is required to upload")
    }

    if(!thumbnail) {
        throw new ApiError(401,"Thumnail is required to upload")
    }

    // console.log("Checking what is coming in video and thumbnail :- ",video," ",thumbnail);

    const videoUrl = video.secure_url
    const thumbnailUrl = thumbnail.secure_url

    // console.log("printing url of uploaded video and thumnail ", videoUrl," ",thumbnailUrl);

    const duration = video.duration
    // console.log("Duration of the video is -> ",duration);

    const uploadedVideo = await Video.create({
        videoFile: videoUrl,
        thumbnail: thumbnailUrl,
        title,
        description,
        duration,
        isPublished: true,
        owner: req.user._id,
    })

    if(!uploadedVideo) {
        throw new ApiError(500, "Something went wrong")
    }

    // console.log("Seeing what is in uploadedVideo ", uploadedVideo);
    return res
    .status(201)
    .json(new ApiResponse(201, uploadedVideo, "Video published successfully"))
})

const getVideoById = asyncHandler(async (req,res) => {
    const { videoId } = req.params
    console.log(videoId);

    const video = await Video.findById(videoId)
    // console.log("Here coming video from DB");

    if(!video) {
        throw new ApiError(401,"Video is not present ")
    }

    return res
           .status(200)
           .json(new ApiResponse(201,video,"Video fetched successfully"))
})

const updateVideo = asyncHandler(async (req,res) => {
    const { videoId } = req.params
    const { title, description } = req.body

    const videoDetails = await Video.findById(videoId)

    const oldThumbnail = videoDetails?.thumbnail

    if(!oldThumbnail) {
        throw new ApiError(500,"Something went wrong at line 104")
    }

    const urlArray = oldThumbnail.split('/');

    const oldImageName = urlArray[urlArray.length-1]?.split('.')[0]

    if(!oldImageName) {
        console.log(oldImageName);
        throw new ApiError(500,"Something went wrong at line 112")
    }

    // console.log("Old Image printing ",oldImageName);

    const result = await deleteFromCloudinary(oldImageName)

    // console.log("printing result ",result);

    if(result.result !== 'ok') {
        throw new ApiError(500, "Something went wrong at line 118")
    }

    const thumbnail = req.file?.path

    console.log(thumbnail);

    const uploadedImageUrl =  await uploadOnCloudinary(thumbnail)

    if(!uploadedImageUrl) {
        throw new ApiError(500,"Something went wrong while uploading thumbnail at line 126")
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                thumbnail: thumbnail,
                title,
                description
            }
        },
        {
            new: true
        }
    )

    return res
           .status(200)
           .json(new ApiResponse(200, video, "Video Details updated successfully"))

    // console.log(videoId," ",title," ",description," ",thumbnail);
    
})

const deleteVideo = asyncHandler(async (req,res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId)


    if(!video) {
        throw new ApiError(401,"Video you want to delete is not present")
    }
    console.log(video);
    const thumbnail = video.thumbnail
    const thumbnailArray = thumbnail.split('/')
    console.log(thumbnailArray);
    const thumbnailName = thumbnailArray[thumbnailArray.length-1].split('.')[0]

    const videoToBeDeleted = video.videoFile
    const videoArray = videoToBeDeleted.split('/')
    const videoName = videoArray[videoArray.length-1].split('.')[0]

    await cloudinary.uploader.destroy(videoName, {resource_type: 'video'})



    await cloudinary.uploader.destroy(thumbnailName, {resource_type: 'image'})

    const deleted = await Video.findByIdAndDelete(videoId)

    if(!deleted) {
        throw new ApiError(501,"Something went wrong")
    }

    return res
           .status(200)
           .json(new ApiResponse(200,"Video deleted Successfully"))
})



export {
    getAllVideos,
    publishVideo,
    getVideoById,
    deleteVideo,
    updateVideo

}