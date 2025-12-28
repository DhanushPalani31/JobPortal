// controllers/uploadController.js
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";


// upload single file from req.file (multer memoryStorage)
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file received" });

    // Use uploader.upload_stream to accept buffer
    const uploadFromBuffer = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "your_app_folder" }, // optional: set Cloudinary folder
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });

    const result = await uploadFromBuffer(req.file.buffer);

    // result contains url, secure_url, public_id, etc.
    // You can save result.secure_url or result.public_id to user model here.
    return res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      raw: result,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
