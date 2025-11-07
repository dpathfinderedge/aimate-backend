import Rewrite from "../../models/Rewrite.js";
import { generateAIResponse } from "../../utils/aiClient.js";

export const rewriteText = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const prompt = `Rewrite the following text, respecting any tone or style preferences mentioned by the user:\n${text}`;

    const rewrittenText = await generateAIResponse(prompt, "textRewriter");

    const saved = await Rewrite.create({
      user: req.user._id,
      originalText: text,
      rewrittenText,
    });

    res.status(201).json({ success: true, saved });
  } catch (err) {
    console.error("Text rewriting error:", err.message);
    next(err);
  }
};

export const getRewrites = async (req, res, next) => {
  try {
    const rewrites = await Rewrite.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, rewrites });
  } catch (err) {
    console.error('Get Text rewrites error:', err);
    next(err);
  }
};
