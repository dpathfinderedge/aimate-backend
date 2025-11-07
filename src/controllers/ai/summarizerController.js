import { generateAIResponse } from "../../utils/aiClient.js";
import Summary from "../../models/Summary.js";

export const summarizeText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const summary = await generateAIResponse(`Summarize this text:\n${text}`, "summarizer");

    if (!summary || summary.includes("loading")) {
      return res.status(503).json({
        message:
          "The AI model is currently loading or unavailable. Please try again in a few seconds.",
      });
    }

    const saved = await Summary.create({
      user: req.user._id,
      originalText: text,
      summary,
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error("Summarization error:", err.message);
    res.status(500).json({
      message:
        err.message.includes("Hugging Face") ||
        err.message.includes("connect")
          ? "Failed to reach Hugging Face API. Please try again later."
          : "An unexpected error occurred.",
    });
  }
};

export const getSummaries = async (req, res) => {
  try {
    const summaries = await Summary.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(summaries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
