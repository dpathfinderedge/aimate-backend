import mongoose from "mongoose";

const summarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalText: { type: String, required: true },
    summary: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Summary", summarySchema);
