import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Post from "@/models/Post";

export async function GET(req) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyToken(token);
    if (!user?.id)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // ✅ Fetch only approved posts for that user
    const approvedPosts = await Post.find({
      user: user.id,
      status: "approved",
    }).sort({ createdAt: -1 });

    return NextResponse.json(approvedPosts, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching approved posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}