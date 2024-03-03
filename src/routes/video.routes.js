import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    deleteVideo, 
    getAllVideos, 
    getVideoById, 
    publishVideo, 
    updateVideo 
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.midleware.js"

const router = Router()
router.use(verifyJWT); // Apply verifyJWT midleware to all routes in this file

router
    .route("/")
    .get(getAllVideos)
    .post(
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

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

// router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router