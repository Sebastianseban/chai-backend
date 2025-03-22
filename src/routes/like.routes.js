import { Router } from 'express';
import { toggleCommentLike, toggleVideoLike } from '../controllers/like.controllers.js';
import {verifyJWT} from "../middlewares/auth.middleware.js"


const router = Router();
router.use(verifyJWT);

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);


export default router