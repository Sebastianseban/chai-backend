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
    throw new ApiError(404, "tweet text are required");
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
})


export {createTweet}