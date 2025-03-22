import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "tweet text is required");
  }

  const newTweet = new Tweet({
    content,
    owner: userId,
  });

  await newTweet.save();

  return res
    .status(200)
    .json(new ApiResponse(201, "tweet added sucessfully", newTweet));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const userId = req.user._id;

  

  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const allTweet = await Tweet.find({ owner: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit) 
   

  if (!allTweet || allTweet.length === 0) {
    throw new ApiError(400, "No tweets found for this user");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Tweets fetched successfully", allTweet));
});

const updateTweet = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  if (!content) {
    throw new ApiError(400, "Content is required to update the tweet");
  }

  const tweet = await Tweet.findOne({_id:tweetId,owner:userId})

  if (!tweet) {
    throw new ApiError(404,"No tweet found for this user");
  }

  tweet.content=content

  await tweet.save()

  return res.status(200).json(new ApiResponse(200, "tweet updated successfully", tweet));
})


const deleteTweet = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const deletedTweet = await Tweet.findOneAndDelete({owner:userId,_id:tweetId})

  if (!deletedTweet) {
    throw new ApiError(404, "Tweet not found or does not belong to the user");
  }

  return res.status(200).json(new ApiResponse(200, "Tweet deleted successfully"));
})


export { createTweet, getUserTweets,updateTweet,deleteTweet};
