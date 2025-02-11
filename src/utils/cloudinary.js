import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINDARY_API_KEY, 
    api_secret: process.env.CLOUDINDARY_API_SECRET
}); 


const uploadToCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        //upload the file on cloudinary
        const respone = await cloudinary.uploader.upload(localFilePath,{
          resource_type:"auto"
        })
        //file has been uploaded successfull
        console.log("file is uploaded on cloudinary",
            respone.url
        )
        return respone
        
    } catch (error) {

        fs.unlinkSync(localFilePath)//removed the  localy saved temporary file as 
        // the upload operation got failed
        return null
        
    }
}

export {uploadToCloudinary}