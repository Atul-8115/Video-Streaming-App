import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/AppResponse";
import { asyncHandler } from "../utils/asyncHandler.js";


const createPlaylist = asyncHandler(async (req,res) => {
    const {name,description} = req.body;

    if(!name || !description) {
        throw new ApiError(400,"All fields are required.")
    }

    const playlist = await Playlist.create({
        name: name,
        description: description
    })

    if(!playlist) {
        throw new ApiError(500,"Something went wrong while creating playlist.")
    }

    return res
           .status(200)
           .json(new ApiResponse(200,{playlist},"Playlist created successfully."))
})

const getUserPlaylists = asyncHandler(async (req,res) => {
    const {userId} = req.params;
    if(!userId) {
        throw new ApiError(400,"User Id is not present.")
    }

    // const userPlaylists = await Playlist.findById(userId);
    const userPlaylists = await Playlist.find({owner: userId})
    if(!userPlaylists) {
        throw new ApiResponse(200,"There is not any playlist available related to the user.")
    }

    return res
           .status(200)
           .json(new ApiResponse(200,userPlaylists,"User's playlist fetched successfully."))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    
    if(!playlistId) {
        throw new ApiError("Playlist's id is not present.")
    }

    const playlist = await Playlist.findById(playlistId);

    return res
           .status(200)
           .json(new ApiResponse(200,playlist,"Playlist by id is fetched successfully."))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!playlistId || !videoId) {
        throw new ApiError(400,"All fields are required.")
    }

    const playlist = await Playlist.findById(playlistId)
    const video = await Video.findById(videoId)

    if(!playlist || !video) {
        throw new ApiError(404,"Video or playlist does not exists.")
    }

    const alreadyAvailableOrNot = (playlist.video.indexOf(new mongoose.Types.ObjectId(videoId)) !== -1)

    if(alreadyAvailableOrNot) {
        throw new ApiError(400,"Video already added in the playlist.")
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        {_id: playlistId},
        {
            $push: {
                videos: new mongoose.Types.ObjectId(videoId)
            }
        },
        {new : true}
    )

    if(!updatePlaylist) {
        throw new ApiError(500,"Something went wrong while adding video in the playlist.")
    }

    return res
           .status(200)
           .json(new ApiResponse(200,updatePlaylist,"Video added successfully in the playlist."))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist
}