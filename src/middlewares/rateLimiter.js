import rateLimit from "express-rate-limit";

export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: parseInt(process.env.CHAT_RATE_LIMIT || "10", 10),
  message: { message: "Too many requests to the chat endpoint, please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});
