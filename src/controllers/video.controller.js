import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "all fields are required");
  }

  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  let thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  // if (
  //   req.files &&
  //   Array.isArray(req.files.coverImage) &&
  //   req.files.coverImage.length > 0
  // ) {
  //   coverImageLocalPath = req.files.coverImage[0].path;
  // }

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  // const avatar = await uploadToCloudinary(avatarLocalPath);
  // const coverImage = await uploadToCloudinary(coverImageLocalPath);

  const uploadedVideo = await uploadToCloudinary(videoLocalPath, "video");
  const uploadedThumbnail = thumbnailLocalPath
    ? await uploadToCloudinary(thumbnailLocalPath, "image")
    : null;

  if (!uploadedVideo) {
    throw new ApiError(500, "Video upload failed");
  }

  const newVideo = await Video.create({
    videoFile: uploadedVideo.url,
    thumbnail: uploadedThumbnail?.url || "",
    title,
    description,
    duration: uploadedVideo.duration || null,
    owner: req.user._id,
  });

  res
    .status(200)
    .json(new ApiResponse(201, "Video uploaded successfully", newVideo));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.body;

  if (!videoId) {
    throw new ApiError(401, "video id is required");
  }

  const video = await Video.findById(videoId).populate("owner", "username");

  if (!video) {
    throw new ApiError(404, "video not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "video fetched successfully", video));
});


const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy = 'createdAt', sortType = 'desc', userId } = req.query;

  // Convert page and limit to integers
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  // Build the search query if 'query' parameter is provided
  const searchQuery = query
    ? {
        $or: [
          { title: { $regex: query, $options: 'i' } }, // Case-insensitive search on title
          { description: { $regex: query, $options: 'i' } }, // Case-insensitive search on description
        ]
      }
    : {};

  // Build the sort order
  const sortOrder = sortType === 'asc' ? 1 : -1; // Default sort is descending

  // Apply filtering if 'userId' is provided (e.g., for fetching videos by a specific user)
  const userFilter = userId ? { owner: userId } : {};

  // Combine all filters into one query object
  const filterQuery = { ...searchQuery, ...userFilter };

  // Calculate the pagination skip value
  const skip = (pageNum - 1) * limitNum;

  // Get the videos with pagination, sorting, and filtering
  const videos = await Video.find(filterQuery)
    .skip(skip)
    .limit(limitNum)
    .sort({ [sortBy]: sortOrder })
    .populate("owner", "username");

  // Count the total number of videos for pagination
  const totalVideos = await Video.countDocuments(filterQuery);

  // Return paginated videos
  res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully", {
    total: totalVideos,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(totalVideos / limitNum),
  }));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  const {title,description,thumbnail} = req.body
  //TODO: update video details like title, description, thumbnail

  if (!videoId) {
    throw new ApiError(404,"video id is required")
    
  }



})


export { publishVideo, getVideoById,getAllVideos };
