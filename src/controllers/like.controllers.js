import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js"; // Ensure you import the correct models
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.model.js";

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

  const existingLike = await Like.findOneAndDelete({
    video: videoId,
    likedBy: userId,
  });

  if (existingLike) {
    return res
      .status(200)
      .json(new ApiResponse(200, "Video unliked successfully"));
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

  const existingCommentLike = await Like.findOneAndDelete({
    comment: commentId,
    likedBy: userId,
  });

  if (existingCommentLike) {
    return res
      .status(200)
      .json(new ApiResponse(200, "Comment unliked successfully"));
  }

  await Like.create({ comment: commentId, likedBy: userId });
  return res
    .status(201)
    .json(new ApiResponse(201, "Comment liked successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweetExists = await Tweet.findById(tweetId);
  if (!tweetExists) {
    throw new ApiError(404, "tweet not found");
  }

  const existingTweetLike = await Like.findOneAndDelete({
    tweet: tweetId,
    likedBy: userId,
  });

  if (existingTweetLike) {
    return res
      .status(200)
      .json(new ApiResponse(200, "Tweet unliked successfully"));
  }

  await Like.create({ tweet: tweetId, likedBy: userId });
  return res.status(201).json(new ApiResponse(201, "Tweet liked successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const userId = req.user._id;

  const likedVideos = await Like.find({ likedBy: userId })
    .populate("video")
    .select("video -_id");
  if (!likedVideos.length) {
    throw new ApiError(404, "No liked videos found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Liked videos fetched successfully", likedVideos)
    );
});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike,getLikedVideos };
