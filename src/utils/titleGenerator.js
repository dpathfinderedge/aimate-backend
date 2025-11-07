import { generateChatReply } from "./aiClient.js";

export const generateTitleFromMessage = async (message) => {
  try {
    if (!message) return "New Session";

    const provider = process.env.DEFAULT_AI_PROVIDER || "huggingface";
    const model =
      provider === "huggingface"
        ? process.env.DEFAULT_HF_MODEL || "meta-llama/Meta-Llama-3-8B-Instruct"
        : process.env.OLLAMA_MODEL || "llama3";

    const prompt = `
      Generate a very short and descriptive title (max 6 words) for this conversation.
      Do NOT include quotes, punctuation marks, or emojis.
      Return only the title text.

      Message: "${message}"
    `;

    const aiResult = await generateChatReply({
      provider,
      model,
      history: [],
      message: prompt,
    });

    let title = aiResult?.reply?.trim() || "New Session";

    title = title.replace(/^["']|["']$/g, "").trim();

    if (!title || title.length < 2) {
      title = message.split(" ").slice(0, 6).join(" ") + "...";
    }

    return title;
  } catch (err) {
    console.error("Title generation failed:", err.message);
    return "New Session";
  }
};