import mongoose from "mongoose";

const rewriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalText: { type: String, required: true },
    rewrittenText: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Rewrite", rewriteSchema);
