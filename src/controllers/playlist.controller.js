import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/AppResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createPlaylist = asyncHandler(async (req,res) => {
    const {name,description} = req.body;
    const ownerId = req.user._id

    console.log("name: ",name," description: ",description)
    try {
        
        if(!name || !description) {
            throw new ApiError(400,"All fields are required.")
        }
    
        const playlist = await Playlist.create({
            name: name,
            description: description,
            owner: ownerId
        })
    
        if(!playlist) {
            throw new ApiError(500,"Something went wrong while creating playlist.")
        }
    
        return res
               .status(200)
               .json(new ApiResponse(200,{playlist},"Playlist created successfully."))
    } catch (error) {
        console.log("ERROR MESSAGE: ",error.message)
        throw new ApiError(500,"Something went wrong while creating playlist.")
    }
})

const getUserPlaylists = asyncHandler(async (req,res) => {
    try {
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
               .json(new ApiResponse(200,{userPlaylists},"User's playlist fetched successfully."))
    } catch (error) {
        console.log("ERROR MESSAGE: ",error.message)
        throw new ApiError(500,"Something went wrong while fetching user playlist.")
    }
})

const getPlaylistById = asyncHandler(async (req, res) => {
    try {
        const {playlistId} = req.params
        
        if(!playlistId) {
            throw new ApiError("Playlist's id is not present.")
        }
    
        const playlist = await Playlist.findById(playlistId);
    
        return res
               .status(200)
               .json(new ApiResponse(200,playlist,"Playlist by id is fetched successfully."))
    } catch (error) {
        console.log("ERROR MESSAGE: ",error.message)
        throw new ApiError(500,"Something went wrong while fetching playlist.")
    }
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    try {
        const {playlistId, videoId} = req.params
    
        if(!playlistId || !videoId) {
            throw new ApiError(400,"All fields are required.")
        }
    
        const playlist = await Playlist.findById(playlistId)
        const video = await Video.findById(videoId)
    
        if(!playlist || !video) {
            throw new ApiError(404,"Video or playlist does not exists.")
        }
    
        const alreadyAvailableOrNot = (playlist.videos.indexOf(new mongoose.Types.ObjectId(videoId)) !== -1)
    
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
        ).populate("videos").exec()
    
        if(!updatedPlaylist) {
            throw new ApiError(500,"Something went wrong while adding video in the playlist.")
        }
    
        return res
               .status(200)
               .json(new ApiResponse(200,updatedPlaylist,"Video added successfully in the playlist."))
    } catch (error) {
        console.log("ERROR MESSAGE: ",error.message)
        throw new ApiError(500,"Something went wrong while adding video to the playlist.")
    }
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    try {
        const {playlistId, videoId} = req.params
        // TODO: remove video from playlist
        if(!playlistId || !videoId) {
            throw new ApiError(400,"All Fields are required.")
        }
    
        const playlist = await Playlist.findById(playlistId)
        const video = await Video.findById(videoId)
    
        if(!playlist) {
            throw new ApiError(404,"Playlist is not available.")
        }
    
        if(!video) {
            throw new ApiError(404,"Video not found.")
        }
    
        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            {_id: playlistId},
            {
                $pull: {
                    videos :  videoId
                }
            },
            {new: true}
        )
    
        if(!updatedPlaylist) {
            throw new ApiError(500,"Something went wrong while deleting the video from playlist.")
        }
    
        return res
               .status(200)
               .json(new ApiResponse(200,{updatedPlaylist},"Video removed from the playlist successfully."))
    } catch (error) {
        console.log("ERROR MESSAGE: ",error.message)
        throw new ApiError(500,"Something went wrong while removing video from playlist.")
    }
})

const deletePlaylist = asyncHandler(async (req, res) => {
    try {
        const {playlistId} = req.params
        // TODO: delete playlist
        if(!playlistId) {
            throw new ApiError("Playlist id is not available.")
        }

        // const playlist = await Playlist.findById(playlistId)

        if(!playlist) {
            throw new ApiError(404,"Playlist you want to delete is not available.")
        }

        const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)
    
        return res
               .status(200)
               .json(new ApiResponse(200,"Playlist deleted Successfully."))
    } catch (error) {
        console.log("ERROR MESSAGE: ",error.message)
        throw new ApiError(500,"Something went wrong while deleting the playlist.")
    }
})

const updatePlaylist = asyncHandler(async (req, res) => {
    try {
        const {playlistId} = req.params
        const {name, description} = req.body
        //TODO: update playlist
    
        if(!playlistId || !name || !description) {
            throw new ApiError(400,"All fields are required.")
        }
    
        const playlist = await Playlist.findById(playlistId)
        if(!playlist) {
            throw new ApiError(400,"There is not any playlist available.")
        }
    
        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            {_id:playlistId},
            {
                name: name,
                description: description,
            },
            {new : true}
        )
    
        if(!updatedPlaylist) {
            throw new ApiError(500,"Something went wrong while updating the playlist.")
        }

        console.log({updatePlaylist})
        return res
               .status(200)
               .json(new ApiResponse(200,{updatePlaylist},"Playlist updated successfully."))
    } catch (error) {
        console.log("ERROR MESSAGE: ",error.message)
        throw new ApiError(500,"Something went wrong while updating the playlist.")
    }
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}