import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: [process.env.CLIENT_URL, "http://localhost:5173"], credentials: true }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", healthRoutes)

app.use(errorHandler);

export default app;