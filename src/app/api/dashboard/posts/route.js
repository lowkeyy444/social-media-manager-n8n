// src/app/api/dashboard/posts/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Post from "@/models/Post";

export async function GET(req) {
  try {
    await connectDB();

    // ✅ Authorization check
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // ✅ Fetch all valid posts for the user (filter out empty/dummy posts)
    const posts = await Post.find({ 
      user: user.id,
      $or: [
        { postText: { $exists: true, $ne: "" } },
        { imageUrl: { $exists: true, $ne: "" } }
      ]
    }).sort({ createdAt: -1 });

    return NextResponse.json({ posts }, { status: 200 });
  } catch (err) {
    console.error("Fetch Posts API Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}