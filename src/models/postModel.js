import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    platform: { type: String, required: true },
    topic: { type: String, required: true },
    approvalId: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    postText: { type: String, required: true },
    imageFileName: String,
    imageUrl: String,
    htmlMessage: String,
  },
  { timestamps: true }
);

// Prevent recompiling model during hot reloads in Next.js
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;