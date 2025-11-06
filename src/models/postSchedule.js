import mongoose from "mongoose";

const PostScheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  platform: { type: String, required: true },
  postIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }],
  postsPerSchedule: { type: Number, default: 1 },
  frequency: { type: String, enum: ["daily", "every_2_days", "every_3_days", "weekly"], default: "daily" },
  startDate: { type: Date, required: true },
  nextRun: { type: Date, required: true },
  currentIndex: { type: Number, default: 0 },
  totalPosts: { type: Number, required: true },
  status: { type: String, enum: ["active", "completed"], default: "active" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.PostSchedule ||
  mongoose.model("PostSchedule", PostScheduleSchema);