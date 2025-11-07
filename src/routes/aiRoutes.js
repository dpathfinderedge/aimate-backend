import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { summarizeText, getSummaries } from "../controllers/ai/summarizerController.js";
import { generateTasks, getTasks } from "../controllers/ai/taskGeneratorController.js";
import { generateNote, getNotes } from "../controllers/ai/noteController.js";
import { draftEmail, getDrafts } from "../controllers/ai/emailController.js";
import { getRewrites, rewriteText } from "../controllers/ai/rewriterController.js";

const router = express.Router();

router.post("/summarize", protect, summarizeText);
router.get("/summaries", protect, getSummaries);

router.post("/tasks", protect, generateTasks);
router.get("/tasks", protect, getTasks);

router.post("/notes", protect, generateNote);
router.get("/notes", protect, getNotes);

router.post("/email", protect, draftEmail);
router.get("/emails", protect, getDrafts);

router.post("/rewrite", protect, rewriteText);
router.get("/rewrites", protect, getRewrites);

export default router;