import multer from "multer";
// Multer ke baare me padhna hai 

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, "./public/temp")
    },
    filename: function (req,file,cb) {
        
        // Yahan pe modification kiya ja sakta hai file ke name me
        // file ko console log kara ke dekh lena bahut kuch seekhne ko milega
        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage
})