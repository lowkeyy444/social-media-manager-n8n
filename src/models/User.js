// src/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // 👇 New field to store per-platform API keys
  socialTokens: {
    instagram: { type: String, default: "" },
    linkedin: { type: String, default: "" },
  },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;