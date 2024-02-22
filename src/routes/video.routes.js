import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllVideos, publishVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.midleware.js"

const router = Router()
router.use(verifyJWT); // Apply verifyJWT midleware to all routes in this file

// router.route("/getallvideos").get(getAllVideos);
router.route("/publishVideo").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishVideo
)

export default router