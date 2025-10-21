// import mongoose from "mongoose";

// const PostSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   platform: String,
//   topic: String,
//   approvalId: String,
//   status: { type: String, default: "pending" },
//   postText: String,
//   imageFileName: String,
//   imageUrl: String,
//   htmlMessage: String,
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.models.Post || mongoose.model("Post", PostSchema);

import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    platform: { type: String, required: true },
    topic: { type: String },
    approvalId: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    postText: { type: String },
    imageFileName: { type: String },
    imageUrl: { type: String },
    htmlMessage: { type: String },
    n8nApiKey: { type: String }, // ✅ new field to store the API key for that post
  },
  { timestamps: true } // automatically manages createdAt and updatedAt
);

export default mongoose.models.Post || mongoose.model("Post", PostSchema);