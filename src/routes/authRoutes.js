import express from "express";
import {
  register,
  login,
  logout,
  checkAuth,
  refreshAccessToken,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/check", protect, checkAuth);
router.post("/refresh", refreshAccessToken);

export default router;
