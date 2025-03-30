import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user._id;
  // TODO: toggle subscription

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  if (userId.toString() === channelId.toString()) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }

  const existingSubscription = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,
  });

  if (existingSubscription) {
    await Subscription.findByIdAndDelete(existingSubscription._id);
    return res
      .status(200)
      .json(new ApiResponse(200, "Unsubscribed successfully", null));
  } else {
    const newSubscription = await Subscription.create({
      subscriber: userId,
      channel: channelId,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Subscribed successfully", newSubscription));
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const subscribers = await Subscription.find({ subscriber: channelId })
    .populate("subscriber", "username email profilePicture")
    .select("subscriber createdAt");

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Subscribers fetched successfully", subscribers)
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const subscribedChannels = await Subscription.find({
    channel: channelId,
  }).populate("subscriber", "username email profilePicture").select("subscriber createdAt");

  return res
  .status(200)
  .json(
    new ApiResponse(200, "Subscribers fetched successfully", subscribedChannels)
  );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
