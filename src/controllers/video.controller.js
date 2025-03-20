import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const publishVideo = asyncHandler(async (req,res) => {

    const {title,description} = req.body

    if(!title || !description ){
        throw new ApiError(400,"all fields are required")
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    let thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  // if (
  //   req.files &&
  //   Array.isArray(req.files.coverImage) &&
  //   req.files.coverImage.length > 0
  // ) {
  //   coverImageLocalPath = req.files.coverImage[0].path;
  // }

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  // const avatar = await uploadToCloudinary(avatarLocalPath);
  // const coverImage = await uploadToCloudinary(coverImageLocalPath);

  const uploadedVideo = await uploadToCloudinary(videoLocalPath, "video");
  const uploadedThumbnail = thumbnailLocalPath
    ? await uploadToCloudinary(thumbnailLocalPath, "image")
    : null;

    if (!uploadedVideo) {
      throw new ApiError(500, "Video upload failed");
    }


  const newVideo = await Video.create({
    videoFile:uploadedVideo.url,
    thumbnail:uploadedThumbnail?.url || "",
    title,
    description,
    duration: uploadedVideo.duration || null,
    owner: req.user._id,
  })

  
  res
  .status(201)
  .json(new ApiResponse(201, "Video uploaded successfully", newVideo));

})

export { publishVideo };
