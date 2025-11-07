import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "ai"], required: true },
  content: { type: String, required: true },
  meta: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String }, 
    provider: { type: String, enum: ["huggingface", "ollama"] },
    model: { type: String }, 
    systemPrompt: { type: String },
    messages: [messageSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);
