import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const HUGGINGFACE_BASE = process.env.HUGGINGFACE_BASE_URL || "https://router.huggingface.co";

const hfClient = axios.create({
  baseURL: HUGGINGFACE_BASE,
  headers: {
    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

export const callHuggingFace = async (model, prompt) => {
  if (!model) throw new Error("Hugging Face model name required");

  const isChatModel =
    model.includes("mistral") ||
    model.includes("falcon") ||
    model.includes("llama") ||
    model.includes("chat") ||
    model.includes("meta-llama");

  const url = isChatModel
    ? "/v1/chat/completions"
    : `/hf-inference/models/${model}`;

  const payload = isChatModel
    ? {
        model,
        messages: [{ role: "user", content: prompt }],
        stream: false,
      }
    : { inputs: prompt };

  try {
    const res = await hfClient.post(url, payload);
    const data = res?.data;

    if (!data) return "";
    if (data.choices?.[0]?.message?.content) return data.choices[0].message.content;
    if (data.generated_text) return data.generated_text;
    if (Array.isArray(data) && data[0]?.generated_text) return data[0].generated_text;
    if (data[0]?.summary_text) return data[0].summary_text;
    if (typeof data === "string") return data;

    return JSON.stringify(data);
  } catch (err) {
    console.error("Hugging Face error:", err.response?.data || err.message);
    throw new Error("Hugging Face request failed");
  }
};

export const generateChatReply = async ({
  provider = "huggingface",
  model,
  history = [],
  message,
  systemPrompt,
}) => {
  if (!message) throw new Error("message is required");

  const pieces = [];
  if (systemPrompt && systemPrompt.trim()) pieces.push(`System: ${systemPrompt}`);
  for (const h of history)
    pieces.push(`${h.role === "ai" ? "Assistant" : "User"}: ${h.content}`);
  pieces.push(`User: ${message}`);
  pieces.push(`Assistant:`);

  const prompt = pieces.join("\n");
  const raw = await callHuggingFace(
    model || process.env.DEFAULT_HF_MODEL || "meta-llama/Meta-Llama-3-8B-Instruct",
    prompt
  );
  return { reply: String(raw), raw };
};

export const generateAIResponse = async (prompt, tool = "default") => {
  const toolMap = {
    summarizer: {
      model: process.env.HF_SUMMARIZER_MODEL || "facebook/bart-large-cnn",
    },
    taskGenerator: {
      model: process.env.HF_TASK_MODEL || "meta-llama/Meta-Llama-3-8B-Instruct",
    },
    noteTaker: {
      model: process.env.HF_NOTE_MODEL || "meta-llama/Meta-Llama-3-8B-Instruct",
    },
    emailDrafter: {
      model: process.env.HF_EMAIL_MODEL || "meta-llama/Meta-Llama-3-8B-Instruct",
    },
    textRewriter: {
      model: process.env.HF_REWRITER_MODEL || "meta-llama/Meta-Llama-3-8B-Instruct",
    },
    default: {
      model:
      process.env.DEFAULT_HF_MODEL ||
      process.env.HF_SUMMARIZER_MODEL ||
      "meta-llama/Meta-Llama-3-8B-Instruct",
    },
  };

  const config = toolMap[tool] || toolMap.default;

  try {
    const output = await callHuggingFace(config.model, prompt);
    return output;
  } catch (err) {
    console.error("generateAIResponse failed:", err.message);
    return "AI service is currently unavailable. Please try again later.";
  }
};
