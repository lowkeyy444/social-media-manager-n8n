import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    credits: { type: Number, default: 0 },

    socialTokens: {
      instagram: {
        token: { type: String, default: "" },
        nodeId: { type: String, default: "" },
      },
      linkedin: {
        token: { type: String, default: "" },
      },
      facebook: {
        token: { type: String, default: "" },  // 👈 Facebook access token
        nodeId: { type: String, default: "" }, // 👈 Facebook Node ID
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;