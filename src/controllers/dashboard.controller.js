import { Subscription } from "../models/subscription.models.js";
import { ApiResponse } from "../utils/AppResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const channelId = req.user?._id;

    const videosData = await Video.aggregate([
        {
            $match: {
                owner: channelId
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likesData",
                pipeline: [
                    {
                        $match: {
                            likedStatus: true // Include documents where isLiked is true
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likesData"
                },

            }
        },
        {
            $project: {
                title: 1,
                views: 1,
                likesCount: 1,
            }
        }
    ])
    const totalVideosOfChannel = videosData.length;
    const totalViewsOnChannel = videosData.reduce((acc, curr) => {
        acc += curr.views;
        return acc;
    }, 0);
    const totalLikesOnChannel = videosData.reduce((acc, curr) => {
        acc += curr.likesCount;
        return acc;
    }, 0);
    const totalSubscriberCount = await Subscription.countDocuments({channel: channelId});

    return res.json(new ApiResponse(200, {
        videosData,
        totalViewsOnChannel,
        totalSubscriberCount,
        totalVideosOfChannel,
        totalLikesOnChannel
    }, "All data fetched successfully."));
})


const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const channelId = req.user._id

    const allVideos = await Video.aggregate([
        {
            $match: {
                owner: channelId
            }
        },
        {
            $lookup: {
                from: "user",
                localField: "owner",
                foreignField: "_id",
                as: "creator",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                creator: {
                    $first: "$creator"
                }
            }
        },
        {
            $project: {
                videoFile:1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                views:1,
                isPublished:1,

            }
        }
    ])

    return res
           .status(200)
           .json(new ApiResponse(200,{Videos: allVideos},"Videos fetched successfully."))
})

export {
    getChannelStats, 
    getChannelVideos
}