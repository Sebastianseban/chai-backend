import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";  // Ensure you import the correct models
import { Comment } from "../models/comment.model.js";  
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video ID");
  }

  const videoExists = await Video.findById(videoId);
  if (!videoExists) {
    throw new ApiError(404, "Video not found");
  }

  const existingLike = await Like.findOneAndDelete({ video: videoId, likedBy: userId });

  if (existingLike) {
    return res.status(200).json(new ApiResponse(200, "Video unliked successfully"));
  }

  await Like.create({ video: videoId, likedBy: userId });
  return res.status(201).json(new ApiResponse(201, "Video liked successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid Comment ID");
  }

  const commentExists = await Comment.findById(commentId);
  if (!commentExists) {
    throw new ApiError(404, "Comment not found");
  }

  const existingCommentLike = await Like.findOneAndDelete({ comment: commentId, likedBy: userId });

  if (existingCommentLike) {
    return res.status(200).json(new ApiResponse(200, "Comment unliked successfully"));
  }

  await Like.create({ comment: commentId, likedBy: userId });
  return res.status(201).json(new ApiResponse(201, "Comment liked successfully"));
});

export { toggleVideoLike, toggleCommentLike };
