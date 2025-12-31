// controllers/uploadController.js
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// upload single file from req.file (multer memoryStorage)
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No file received" 
      });
    }

    // Use uploader.upload_stream to accept buffer
    const uploadFromBuffer = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { 
            folder: "job_portal_uploads",
            resource_type: "auto" // Automatically detect file type
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });

    const result = await uploadFromBuffer(req.file.buffer);

    // Return consistent response format
    return res.json({
      success: true,
      imageUrl: result.secure_url, // Match frontend expectation
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Upload failed"
    });
  }
};