import mongoose from "mongoose";

const SocialAccountSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  platform: { 
    type: String, 
    enum: ["linkedin", "instagram", "facebook", "twitter"], 
    required: true 
  },

  accountName: { 
    type: String, 
    required: true 
  },

  apiKey: { 
    type: String, 
    required: true 
  },

  nodeId: { 
    type: String, 
    required: true 
  },

  // ✅ new field
  logoUrl: { 
    type: String, 
    default: "", 
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

export default mongoose.models.SocialAccount ||
  mongoose.model("SocialAccount", SocialAccountSchema);