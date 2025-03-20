import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "This video ID is not valid");
    }

    // Find video in database
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

  
    try {
        const result = await Comment.aggregatePaginate(Comment.aggregate([
            {
                $match: {
                    video: new mongoose.Types.ObjectId(videoId)
                }
            }
        ]), { page, limit });

        return res.status(200).json(
            new ApiResponse(200, result, "Video comments fetched successfully!")
        );
    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching video comments", error);
    }
});

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;
    const userId = req.user.id; 

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    if (!content) {
        throw new ApiError(400, "Comment content is required");
    }

    const newComment = await Comment.create({
        content,
        video: videoId,
        owner: userId
    });

    res.status(201).json(new ApiResponse(201, newComment, "Comment added successfully"));
});





export { getVideoComments };
