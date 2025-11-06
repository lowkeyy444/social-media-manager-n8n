import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/postModel";
import User from "@/models/User";
import SocialAccount from "@/models/SocialAccount";
import { verifyToken } from "@/lib/jwt";
import axios from "axios";

// 🟩 GET — Fetch only pending posts for review
export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = await verifyToken(token);
    if (!user?.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const posts = await Post.find({ user: user.id, status: "pending" }).sort({ createdAt: -1 });
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// 🟦 PATCH — Approve / Reject post (no posting happens here)
export async function PATCH(req) {
  try {
    await connectDB();
    const { postId, status } = await req.json();

    if (!postId || !status) {
      return NextResponse.json({ error: "Missing postId or status" }, { status: 400 });
    }

    const token = req.headers.get("authorization")?.split(" ")[1];
    const userData = await verifyToken(token);

    const post = await Post.findById(postId);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    await Post.findByIdAndUpdate(postId, { status }, { new: true });
    console.log(`✅ Post ${postId} marked as ${status}`);

    return NextResponse.json({ message: `Post ${status}` }, { status: 200 });
  } catch (error) {
    console.error("🔥 Error updating post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟥 POST — "Post Now" to send immediately to n8n workflow
export async function POST(req) {
  try {
    await connectDB();
    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json({ error: "Missing postId" }, { status: 400 });
    }

    const token = req.headers.get("authorization")?.split(" ")[1];
    const userData = await verifyToken(token);
    const user = await User.findById(userData.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const post = await Post.findById(postId);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const platform = post.platform?.toLowerCase();
    if (!platform) return NextResponse.json({ error: "Missing platform" }, { status: 400 });

    // 🔍 Find connected account
    const socialAccount = await SocialAccount.findOne({ userId: user._id, platform });
    if (!socialAccount) {
      return NextResponse.json({ error: `No connected ${platform} account found` }, { status: 400 });
    }

    const { apiKey, nodeId } = socialAccount;

    // ✅ Same posting logic as before
    try {
      if (platform === "linkedin") {
        console.log("📤 Posting to LinkedIn workflow...");
        await axios.post("https://lately-boss-gator.ngrok-free.app/webhook/linkdin-post-go", {
          linkedinApiKey: apiKey,
          postText: post.postText,
          imageFileName: post.imageFileName,
        });
        await Post.findByIdAndUpdate(post._id, { status: "posted" });
      }

      if (platform === "instagram") {
        console.log("📸 Posting to Instagram workflow...");
        await axios.post("https://lately-boss-gator.ngrok-free.app/webhook-test/instagram-posting", {
          instagramApiKey: apiKey,
          nodeId,
          postText: post.postText,
          imageFileName: post.imageFileName,
        });
        await Post.findByIdAndUpdate(post._id, { status: "posted" });
      }

      if (platform === "facebook") {
        console.log("📘 Posting to Facebook workflow...");
        await axios.post("https://lately-boss-gator.ngrok-free.app/webhook-test/facebook-posting", {
          facebookApiKey: apiKey,
          nodeId,
          postText: post.postText,
          imageFileName: post.imageFileName,
          platform: "facebook",
          topic: post.topic,
          postCount: 1,
          batchId: post.batchId || "manual",
          userId: user._id.toString(),
        });
        await Post.findByIdAndUpdate(post._id, { status: "posted" });
      }

      // 🟢 Mark as posted
      await Post.findByIdAndUpdate(postId, { status: "posted" });
      return NextResponse.json({ message: `✅ Posted to ${platform}!` }, { status: 200 });
    } catch (err) {
      console.error(`❌ Error posting to ${platform}:`, err.message);
      return NextResponse.json({ error: `Failed to post to ${platform}` }, { status: 500 });
    }
  } catch (error) {
    console.error("🔥 Error in POST NOW:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}