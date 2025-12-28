// middleware/uploadMiddleware.js
import multer from "multer";

// Use memory storage so file is available as req.file.buffer
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit (adjust as needed)
});
