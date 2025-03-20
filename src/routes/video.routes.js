import { Router } from "express";
import { publishVideo,getVideoById,getAllVideos } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/videoUpload").post(
    upload.fields([
        {
            name:"videoFile",
            maxCount:1,
        },
        {
            name:"thumbnail",
            maxCount:1
        }
    ])
    ,publishVideo

)

router.route("/getVideo").get(getVideoById)
router.route("/getAllVideos").get(getAllVideos)


export default router
