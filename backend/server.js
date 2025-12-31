
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
import { validateOpenAIKey } from "./config/openai.js";
import aiRouter from "./routes/aiRoutes.js";

dotenv.config();


const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://jobportal-q4yg.onrender.com/"
  ],
  credentials: true
}));


app.use(express.json());
validateOpenAIKey();


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/jobs",jobRouter)
app.use("/api/applications",applicationRouter)
app.use("/api/save-jobs",savedJobsRouter)
app.use("/api/analytics",analyticsRouter)
app.use("/api/ai", aiRouter);

connectDB();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
