
import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiErrors.js"
import { Subscription } from "../models/subscription.models.js"
import { ApiResponse } from "../utils/AppResponse.js"
import mongoose, {Schema, isValidObjectId} from "mongoose"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if(!channelId) {
        throw new ApiError(400,"Bad request")
    }
    const userId = req.user._id
    // console.log("printing userId: ",userId," and Channel Id is: ",channelId)
    const subscription = await Subscription.findOne({subscriber: userId, channel: channelId})

    if(!subscription) {
        await Subscription.create({subscriber:userId, channel: channelId})

    } else {
        const isSubscribed = subscription.isSubscribed
        subscription.isSubscribed = !isSubscribed
        const temp = await subscription.save({validateBeforeSave: false})
        console.log("Printing temp: ",temp)
    }
    const updatedSubscription = await Subscription.findOne({subscriber:userId,channel: channelId})

    if(!updatedSubscription) {
        throw new ApiError(500,"Something went wrong while finding the subscription.")
    }
    return res
           .status(200)
           .json(new ApiResponse(200,updatedSubscription,"User subscribed successfully"))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!channelId) {
        throw new ApiError(400,"Bad request")
    }

    let subscriberList = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberList",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullname: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                "subscriberList": {
                    $first: "$subscriberList"
                }
            }
        },
        {
            $project: {
                subscriberList: 1,
            }
        }
    ])
    subscriberList = subscriberList?.map((subscriber) => subscriber?.subscriberList);
    console.log("Cheking what is in ",subscriberList)
    return res
           .status(201)
           .json(new ApiResponse(201,{subscriberList},"Subscriber list fetched successfully."))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!subscriberId) {
        throw new ApiError(400,"Bad request")
    }

    let channelList = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channelList",
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
                "channelList": {
                    $first: "$channelList"
                }
            }
        },
        {
            $project: {
                channelList: 1,
            }
        }
    ])

    channelList = channelList.map((channel) => channel.channelList)
    console.log(channelList)
    return res
           .status(201)
           .json(new ApiResponse(201,{channelList},"Subscribed channels fetched successfully."))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}