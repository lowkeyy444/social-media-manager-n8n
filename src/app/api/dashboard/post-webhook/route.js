// ✅ src/app/api/dashboard/post-webhook/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("📩 Incoming post webhook:", body);

    const {
      userId,
      platform,
      topic,
      approvalId,
      postText,
      imageFileName,
      image_url,
      htmlMessage,
      n8nApiKey,
    } = body;

    // ✅ Validate minimum required fields
    if (!userId || !postText) {
      console.warn("⚠️ Missing required fields in webhook payload:", body);
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Create new post entry
    const post = await Post.create({
      user: userId,
      platform: platform || "unknown",
      topic: topic || "general",
      approvalId: approvalId || `n8n-${Date.now()}`,
      postText,
      imageFileName: imageFileName || null,
      imageUrl: image_url || null,
      htmlMessage: htmlMessage || null,
      n8nApiKey: n8nApiKey || null,
      status: "pending",
      createdAt: new Date(),
    });

    console.log("✅ Post saved to DB:", post._id);

    // ✅ Respond quickly so n8n continues sending others
    return NextResponse.json({ success: true, postId: post._id });
  } catch (err) {
    console.error("❌ Post webhook error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}