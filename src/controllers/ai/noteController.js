import Note from "../../models/Note.js";
import { generateAIResponse } from "../../utils/aiClient.js";

export const generateNote = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content)
      return res.status(400).json({ message: "Note content or key points are required" });

    const aiResponse = await generateAIResponse(
      `Turn the following rough notes or ideas into a well-organized note with proper structure, headings, and clarity. 
       Keep it concise and readable.

       Input: ${content}`,
      "noteTaker"
    );

    if (!aiResponse)
      return res.status(400).json({ message: "No note could be generated." });

    
    const title = aiResponse.split("\n")[0].replace(/^#+\s*/, "").trim() || "Untitled Note";

    const note = await Note.create({
      user: req.user._id,
      title,
      content: aiResponse,
    });

    res.status(201).json({ sucess: true, note });
  } catch (err) {
    console.error('Note generation error', err);
    next(err);
  }
};

export const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, notes });
  } catch (err) {
    console.error("Fetch notes error:", err);
    next(err);
  }
};
