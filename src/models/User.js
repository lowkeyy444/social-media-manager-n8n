import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    credits: { type: Number, default: 0 },

    // Optionally: reference connected accounts
    connectedAccounts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SocialAccount",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;