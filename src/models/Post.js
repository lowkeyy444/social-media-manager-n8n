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

// src/models/Post.js
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    // Reference to the user who created this post
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Social platform (e.g., facebook, linkedin, instagram)
    platform: { type: String, required: true, trim: true },

    // Topic of the post (optional)
    topic: { type: String, trim: true },

    // Unique approval ID from n8n workflow
    approvalId: { type: String, required: true, trim: true },

    // Status of the post in review
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // Text content of the post
    postText: { type: String, required: true, trim: true },

    // Optional image info
    imageFileName: { type: String, trim: true },
    imageUrl: { type: String, trim: true },

    // Optional HTML message for rich posts
    htmlMessage: { type: String },

    // Store the API key used in n8n for this post
    n8nApiKey: { type: String, trim: true },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Prevent model overwrite upon hot-reload in Next.js
export default mongoose.models.Post || mongoose.model("Post", PostSchema);