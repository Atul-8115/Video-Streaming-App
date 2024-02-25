import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
// import { asyncHandler } from "./asyncHandler.js";


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinay
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfully
        // console.log("Printing for response ", response);
        // console.log("file is uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath);
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved file as the upload operation got failed
        return null
    }
}

const deleteFromCloudinary = async (oldFilePath) => {
    try {

        console.log(oldFilePath);
        const result = await cloudinary.uploader.destroy(oldFilePath)
        console.log("Printing result ", result);
        // fs.unlinkSync(oldFilePath)
        return result;

    } catch (error) {
        // console.log(oldFilePath);
        console.log(error);
        // fs.unlinkSync(oldFilePath)
        return;
    }
}
// cloudinary.v2.uploader.upload("",{ public_id: ""},
//    function(error, result) {console.log(result); 
// });

   export { uploadOnCloudinary, deleteFromCloudinary }