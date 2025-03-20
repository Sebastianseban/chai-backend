import { Router } from "express";
import {
  publishVideo,
  getVideoById,
  getAllVideos,
  updateVideo,
  deleteVideo,
  togglePublishStatus

} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";

const router = Router();

router.use(verifyJWT);

router.route("/videoUpload").post(
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishVideo
);

router.route("/getVideo").get(getVideoById);
router.route("/getAllVideos").get(getAllVideos);
router
  .route("/updateVideo/:videoId")
  .put(upload.single("thumbnail"), updateVideo);

router.route("/deleteVideo/:videoId").delete(deleteVideo)
router.route("/publishStatus/:videoId").patch(togglePublishStatus)

export default router;
