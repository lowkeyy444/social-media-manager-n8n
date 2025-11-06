import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/postModel";
import { verifyToken } from "@/lib/jwt";

export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const user = await verifyToken(token);

    if (!user?.id)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // Fetch posts that were posted to social media
    const posts = await Post.find({
      user: user.id,
      status: "posted",
    }).sort({ createdAt: -1 });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching posted posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posted posts" },
      { status: 500 }
    );
  }
}