import mongoose from "mongoose";

const PostBatchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  platform: { type: String },
  topic: { type: String },
  postCountRequested: { type: Number, required: true },
  postCountReceived: { type: Number, default: 0 },
  batchId: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.PostBatch || mongoose.model("PostBatch", PostBatchSchema);