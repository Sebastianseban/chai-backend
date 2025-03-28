import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user._id;

  if (!name || !description) {
    throw new ApiError(400, "Playlist name and description are required");
  }

  const playlist = new Playlist({
    name,
    description,
    owner: userId,
  });

  await playlist.save();

  return res
    .status(201)
    .json(new ApiResponse(201, "playlist Created  successfully", playlist));

  //TODO: create playlist
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }

    const userPlaylists = await Playlist.find({ owner: userId });

    if (userPlaylists.length === 0) {
      throw new ApiError(404, "No playlists found for this user");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Playlists fetched successfully", userPlaylists)
      );
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Internal server error");
  }

  //TODO: get user playlists
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "Playlist ID is required");
  }

  if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid Playlist ID");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Playlist fetched successfully", playlist));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId || !videoId) {
    throw new ApiError(400, "Playlist ID and Video ID are required");
  }

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Playlist ID or Video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) throw new ApiError(404, "Video not found");

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) throw new ApiError(404, "Playlist not found");

  const updatedPlaylist = await Playlist.findOneAndUpdate(
    { _id: playlistId },
    { $addToSet: { video: videoId } },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Video added to playlist successfully",
        updatedPlaylist
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId || !videoId) {
    throw new ApiError(400, "Playlist ID and Video ID are required");
  }

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Playlist ID or Video ID");
  }

  const updatedPlaylist = await Playlist.findOneAndUpdate(
    { _id: playlistId },
    { $pull: { video: videoId } },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Video removed from playlist successfully",
        updatedPlaylist
      )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
