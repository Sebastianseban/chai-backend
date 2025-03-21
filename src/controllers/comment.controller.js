import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!videoId || !content) {
    throw new ApiError(400, "Video ID and comment text are required");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video Not Found");
  }

  const comment = new Comment({
    video: videoId,
    content,
    owner: userId,
  });

  await comment.save();

  return res
    .status(201)
    .json(new ApiResponse(201, "Comment added successfully", comment));
});

export { addComment };
