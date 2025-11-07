import EmailDraft from "../../models/EmailDraft.js";
import { generateAIResponse } from "../../utils/aiClient.js";

export const draftEmail = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt?.trim()) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const aiPrompt = `
      Write a clear, concise, and professional email based on the following input:
      "${prompt}"

      - Include a subject line suggestion.
      - Maintain a natural but professional tone.
      - Keep the email body well-formatted with greetings and closing.
    `;

    const aiResponse = await generateAIResponse(aiPrompt, "emailDrafter");

    const draft =
      typeof aiResponse === "string"
        ? aiResponse.trim()
        : aiResponse?.reply || aiResponse?.raw || "No draft generated.";

    const subject =
      (draft.match(/Subject:\s*(.*)/i)?.[1]?.trim() ||
        prompt.slice(0, 60).trim()) + (prompt.length > 60 ? "..." : "");

    const saved = await EmailDraft.create({
      user: req.user._id,
      subject,
      body: draft,
    });

    res.status(201).json({ success: true, saved });
  } catch (err) {
    console.error("Email drafting error:", err.message);
    next(err);
  }
};

export const getDrafts = async (req, res) => {
  try {
    const drafts = await EmailDraft.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, drafts });
  } catch (err) {
    console.error("Get drafts error:", err.message);
    res.status(500).json({ message: "Failed to fetch email drafts." });
  }
};

