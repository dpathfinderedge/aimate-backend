import mongoose from "mongoose";

const emailDraftSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: { type: String, required: true },
    body: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("EmailDraft", emailDraftSchema);
