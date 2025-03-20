import { Router } from "express";
import { getVideoComments } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/getVideoComments/:videoId").get(getVideoComments)

export default router;

