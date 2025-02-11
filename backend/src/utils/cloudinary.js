import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

cloudinary.config({
  cloud_name: "vishal0707",
  api_key: "681543843745875",
  api_secret: "5TxPzb7StR8jAMIlAD8bnU0R10A", 
});




const uploadfileOnCloudinary=async (localFilePath)=>{
    try{
        if (!localFilePath) return null;
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto" 

        })
        fs.unlinkSync(localFilePath);
        return response;
    }
    catch(error){

        fs.unlinkSync(
            localFilePath
        );


        return null;

    }
  };
  export {uploadfileOnCloudinary};