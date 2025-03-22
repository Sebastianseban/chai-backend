import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._userId;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const exitingLike = await Like.findOne({
    video: videoId,
    likedBy: userId,
  });

  if (exitingLike) {
    await Like.findByIdAndDelete(exitingLike._Id);
    return res
      .status(200)
      .json(new ApiResponse(200, "Video unliked successfully"));
  }

  await Like.create({ video: videoId, likedBy: userId });


  return res.status(201).json(new ApiResponse(201, "Video liked successfully"   ))
});

export {toggleVideoLike}
