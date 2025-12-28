// models/Analytics.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const analyticsSchema = new Schema(
  {
    employer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // each employer has one analytics doc (optional but recommended)
    },
    totalJobsPosted: {
      type: Number,
      default: 0,
    },
    totalApplicationsRecieved: { // keeping your original field name
      type: Number,
      default: 0,
    },
    totalHired: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export const Analytics = model("Analytics", analyticsSchema);
