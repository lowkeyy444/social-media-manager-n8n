import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  platform: String,
  topic: String,
  approvalId: String,
  status: { type: String, default: "pending" },
  postText: String,
  imageFileName: String,
  imageUrl: String,
  htmlMessage: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);