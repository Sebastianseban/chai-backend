import { Router } from "express";
import { createTweet, getUserTweets } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.route("/createTweet").post(createTweet)
router.route("/getUserTweet").get(getUserTweets)

export default router;
