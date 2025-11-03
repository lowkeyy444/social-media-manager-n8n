import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/postModel";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import axios from "axios";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const { status } = await req.json();

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Verify user & get token
    const token = req.headers.get("authorization")?.split(" ")[1];
    const userData = await verifyToken(token);
    const user = await User.findById(userData.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    
    if (status === "approved") {
      const platform = post.platform?.toLowerCase();

      try {
        if (platform === "linkedin") {
          const linkedinApiKey = user.socialTokens?.linkedin;
          if (!linkedinApiKey)
            return NextResponse.json({ error: "Missing LinkedIn API key" }, { status: 400 });

          console.log("📤 Sending post to LinkedIn...");
          await axios.post("https://lately-boss-gator.ngrok-free.app/webhook/linkdin-post-go", {
            linkedinApiKey,
            postText: post.postText,
            imageFileName: post.imageFileName,
          });
        }

        if (platform === "instagram") {
          const instagramApiKey = user.socialTokens?.instagram;
          if (!instagramApiKey)
            return NextResponse.json({ error: "Missing Instagram API key" }, { status: 400 });

          console.log("📤 Sending post to Instagram...");
          await axios.post("https://lately-boss-gator.ngrok-free.app/webhook/insta-post-go", {
            instagramApiKey,
            caption: post.postText,
            imageFileName: post.imageFileName,
          });
        }
      } catch (n8nError) {
        console.error("❌ Error sending post to n8n:", n8nError.message);
        return NextResponse.json({ error: "n8n workflow failed" }, { status: 500 });
      }
    }

    //post status update
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error("🔥 Error in PATCH /reviewpost/[id]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}