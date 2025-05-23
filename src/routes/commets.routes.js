import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment ,deleteComment,getVideoComments, updateComment} from "../controllers/comment.controller.js";


const router = Router();

router.use(verifyJWT);

router.route("/addComment/:videoId").post(addComment)
router.route("/getVideoComments/:videoId").get(getVideoComments)
router.route("/updateComment/:videoId/:commentId").patch(updateComment)
router.route("/deleteComment/:commentId").delete(deleteComment)

export default router;

