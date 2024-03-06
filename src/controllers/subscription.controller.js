import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiErrors.js"
import { Subscription } from "../models/subscription.models.js"
import { ApiResponse } from "../utils/AppResponse.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if(!channelId) {
        throw new ApiError(400,"Bad request")
    }
    const userId = req.user._id
    // console.log("printing userId: ",userId," and Channel Id is: ",channelId)
    const subscribedAlready = await Subscription.findById(userId)

    if(subscribedAlready) {
        throw new ApiError(400,"User already subcribed")
    }
    console.log("Printing whether user subscribed the channel already or not ",subscribedAlready)

    const subcribed = await Subscription.create(
        userId,
        {channelId}
    )

    if(!subcribed) {
        throw new ApiError(500,"Failed in subscribing the channel")
    }

    return res
           .status(200)
           .json(new ApiResponse(200,subcribed,"User subcribed successfully"))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}