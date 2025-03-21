import { Router } from "express";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.route("/createTweet").post(createTweet)
router.route("/getUserTweet").get(getUserTweets)
router.route("/updateTweet/:tweetId").patch(updateTweet)
router.route("/deleteTweet/:tweetId").delete(deleteTweet)

export default router;
