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

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }
  const aggregateQuery = Comment.aggregate([
    { $match: { video: videoId } }, // Match comments with the given video ID
    { $sort: { createdAt: -1 } }, // Sort comments by latest first
    {
      $lookup: {
        from: "users", // Lookup for user details
        localField: "owner", // Join on 'owner' field in Comment model
        foreignField: "_id", // Reference to '_id' in User model
        as: "user", // Name of the array that will hold the user details
      },
    },
    { $unwind: "$user" }, // Unwind the user array to get user details
    {
      $project: {
        "user.password": 0, // Exclude password field from user details
        "user.email": 0, // Exclude email field if needed
      },
    },
    { $skip: (page - 1) * limit }, // Pagination: Skip results for previous pages
    { $limit: Number(limit) }, // Limit the number of comments based on the page size
  ]);

  const result = await Comment.aggregatePaginate(aggregateQuery, {
    page: Number(page),
    limit: Number(limit),
  });

  const totalComments = await Comment.countDocuments({ video: videoId });

  return res.status(200).json(
    new ApiResponse(200, "Comments fetched successfully", {
      comments: result,
      totalComments,
      totalPages: Math.ceil(totalComments / limit),
      currentPage: Number(page),
    })
  );
});

const updateComment = asyncHandler(async (req, res) => {
  const { videoId, commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required to update the comment");
  }

  const comment = await Comment.findOne({ _id: commentId, video: videoId });

  if (!comment) {
    throw new ApiError(404, "Comment not found for this video");
  }

  comment.content = content

  await comment.save();

  return res.status(200).json(new ApiResponse(200, "Comment updated successfully", comment));
});

export { addComment, getVideoComments,updateComment};
