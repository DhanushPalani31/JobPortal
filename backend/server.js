
import express, { application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import { userRouter } from "./routes/userRoutes.js";
import { connectDB } from "./config/db.js";
import { jobRouter } from "./routes/jobRoutes.js";
import { applicationRouter } from "./routes/applicationRoutes.js";
import { savedJobsRouter } from "./routes/savedJobRoutes.js";
import { analyticsRouter } from "./routes/analyticsRoutes.js";

dotenv.config();


const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/jobs",jobRouter)
app.use("/api/applications",applicationRouter)
app.use("/api/save-jobs",savedJobsRouter)
app.use("/api/analytics",analyticsRouter)

connectDB();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
