// controllers/userController.js
import { User } from "../models/User.js";
import cloudinary from "../config/cloudinary.js"; // optional: used for deleting resume if stored in Cloudinary

export const updateProfile = async (req, res) => {
  try {
    const { name, avatar, resume, companyName, companyDescription, companyLogo } = req.body;

    if (!req.user || !req.user._id) return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // kept your original assignment style
    user.name = name || user.name;
    user.avatar = avatar || user.avatar;
    user.resume = resume || user.resume;

    if (user.role === "employer") {
      user.companyName = companyName || user.companyName;
      user.companyDescription = companyDescription || user.companyDescription;
      user.companyLogo = companyLogo || user.companyLogo;
    }

    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      companyName: user.companyName,
      companyDescription: user.companyDescription,
      companyLogo: user.companyLogo,
      resume: user.resume || "",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    if (!req.user || !req.user._id) return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.resume && !user.resumePublicId) {
      return res.status(400).json({ message: "No resume to delete" });
    }

    // If you stored Cloudinary public_id as resumePublicId, delete it from Cloudinary
    if (user.resumePublicId) {
      try {
        await cloudinary.uploader.destroy(user.resumePublicId);
      } catch (err) {
        console.error("Cloudinary destroy error:", err);
        // continue even if Cloudinary deletion fails
      }
      user.resumePublicId = undefined;
    }

    user.resume = "";
    await user.save();

    return res.json({ success: true, message: "Resume deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User id required" });

    const user = await User.findById(userId).select(
      "- password"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      _id: user._id,
      name: user.name,
      avatar: user.avatar || "",
      role: user.role,
      companyName: user.companyName || "",
      companyDescription: user.companyDescription || "",
      companyLogo: user.companyLogo || "",
      resume: user.resume || "",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
