import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { chatRateLimiter } from "../middlewares/rateLimiter.js";

import { sendMessage, getSession, listSessions, createSession, updateSystemPrompt, getSystemPrompt } from "../controllers/chatController.js";

const router = express.Router();

router.post("/session/:id/message", protect, chatRateLimiter, sendMessage);
router.post("/session", protect, createSession);
router.get("/sessions", protect, listSessions);
router.get("/session/:id", protect, getSession);
router.patch("/session/:id/system-prompt", protect, updateSystemPrompt);
router.get("/session/:id/system-prompt", protect, getSystemPrompt);

export default router;
