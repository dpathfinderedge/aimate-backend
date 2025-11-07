import Session from "../models/Session.js";
import { generateChatReply } from "../utils/aiClient.js";
import { generateTitleFromMessage } from "../utils/titleGenerator.js";

export const sendMessage = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const sessionId = req.params.id;
    const { message } = req.body;

    if (!message) return res.status(400).json({ message: "message is required" });

    const defaultProvider = process.env.DEFAULT_AI_PROVIDER || "huggingface";
    const defaultModel = process.env.DEFAULT_HF_MODEL || "meta-llama/Meta-Llama-3-8B-Instruct";

    let session = sessionId
      ? await Session.findOne({ _id: sessionId, user: userId })
      : null;

    if (!session) {
      session = new Session({
        user: userId, 
        provider: defaultProvider, 
        model: defaultModel ,
        title: "New Session",
        systemPrompt:
          process.env.DEFAULT_SYSTEM_PROMPT ||
          "You are AIMate, an AI-powered productivity assistant that helps users summarize, generate tasks, take notes, draft emails, and rewrite text efficiently.",
      });
    } 

    const HISTORY_LIMIT = parseInt(process.env.CHAT_HISTORY_LIMIT || "12", 10);
    const history = session.messages.slice(-HISTORY_LIMIT).map(m => ({ 
      role: m.role, 
      content: m.content 
    }));

    session.messages.push({ 
      role: "user", 
      content: message, 
      meta: { model: session.model, provider: session.provider } 
    });

    const aiResult = await generateChatReply({
      provider: session.provider,
      model: session.model,
      history,
      message,
      systemPrompt: session.systemPrompt,
    });

    const aiReply = aiResult?.reply || String(aiResult?.raw || "");

    session.messages.push({ 
      role: "ai", 
      content: aiReply, 
      meta: { 
        model: session.model, 
        provider: session.provider 
      } 
    });

    if (session.title === "New Session" && session.messages.length <= 2) {
      session.title = await generateTitleFromMessage(message);
    }

    await session.save();

    res.status(200).json({
      success: true,
      sessionId: session._id,
      reply: aiReply,
      session,
    });
  } catch (err) {
    next(err);
  }
};

export const getSession = async (req, res, next) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json(session);
  } catch (err) {
    next(err);
  }
};

export const listSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ user: req.user._id }).select("title provider model updatedAt").sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (err) {
    next(err);
  }
};

export const createSession = async (req, res, next) => {
  try {
    const defaultProvider = process.env.DEFAULT_AI_PROVIDER || "huggingface";
    const defaultModel =  process.env.DEFAULT_HF_MODEL || "meta-llama/Meta-Llama-3-8B-Instruct";

    const session = await Session.create({
      user: req.user._id, 
      title: "New Session", 
      provider: defaultProvider, 
      model: defaultModel,
      systemPrompt: process.env.DEFAULT_SYSTEM_PROMPT || "You are AIMate, an AI-powered productivity assistant that helps users summarize, generate tasks, take notes, draft emails, and rewrite text efficiently.",
      messages: [],
    });

    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
};

export const updateSystemPrompt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { systemPrompt } = req.body;

    const session = await Session.findOne({ _id: id, user: req.user._id });
    if (!session) return res.status(404).json({ message: "Session not found" });

    session.systemPrompt = systemPrompt?.trim() || undefined;
    await session.save();

    res.json({ success: true, session });
  } catch (err) {
    next(err);
  }
};

export const getSystemPrompt = async (req, res, next) => {
  try {
    const session = await Session.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    }).select("systemPrompt");
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json({ systemPrompt: session.systemPrompt || null });
  } catch (err) {
    next(err);
  }
};