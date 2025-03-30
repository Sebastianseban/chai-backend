import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const stats = await Video.aggregate([
    { $match: { channel: new mongoose.Types.ObjectId(channelId) } },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
        totalLikes: { $sum: "$likes" },
      },
    },
  ]);

  const totalSubscribers = await Subscription.countDocuments({
    channel: channelId,
  });

  return res.status(200).json(
    new ApiResponse(200, "Channel stats retrieved", {
      totalSubscribers,
      totalVideos: stats[0]?.totalVideos || 0,
      totalViews: stats[0]?.totalViews || 0,
      totalLikes: stats[0]?.totalLikes || 0,
    })
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const videos = await Video.find({ channel: channelId }).select(
    "title description views likes createdAt thumbnail"
  );

  if (!videos.length) {
    throw new ApiError(404, "No videos found for this channel");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Videos fetched successfully", videos));
});

export { getChannelStats, getChannelVideos };
