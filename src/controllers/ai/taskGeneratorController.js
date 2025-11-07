import Task from "../../models/Task.js";
import { generateAIResponse } from "../../utils/aiClient.js";

export const generateTasks = async (req, res, next) => {
  try {
    const { description } = req.body;
    if (!description?.trim()) {
      return res.status(400).json({ message: "Description is required" });
    }
    const prompt = `
      You are a productivity assistant. Based on the following description, generate 4–6 short, actionable, and specific tasks.
      Each task should be on a new line, starting with a dash (-).

      Description: "${description}"
    `;

    const aiResult = await generateAIResponse(prompt, "taskGenerator");
    const result = aiResult || aiResult?.reply || String(aiResult?.raw || "");

    const tasks = result
      .split("\n")
      .map(line => line.trim())
      .filter(line => line && /^[\-\•\d\*]/.test(line))
      .map(line => line.replace(/^[-•\d\.\)\s]+/, "").trim());

    if (!tasks.length) {
      return res.status(500).json({ message: "No tasks could be generated." });
    }

    const savedTasks = await Promise.all(
      tasks.map((title) =>
        Task.create({ user: req.user._id, title, description })
      )
    );

    res.status(201).json({ success: true, tasks: savedTasks });
  } catch (err) {
    console.error("Task generation error:", err);
    next(err);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, tasks });
  } catch (err) {
    console.error("Fetch tasks error:", err);
    next(err);
  }
};
