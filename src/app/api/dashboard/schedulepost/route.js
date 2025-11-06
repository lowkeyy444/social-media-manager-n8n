import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import PostSchedule from "@/models/PostSchedule";

export async function POST(req) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user?.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { platform, postIds, postsPerSchedule, frequency, startDate } = await req.json();

    if (!platform || !postIds?.length) {
      return NextResponse.json({ error: "Platform and posts are required" }, { status: 400 });
    }

    let intervalDays = 1;
    if (frequency === "every_2_days") intervalDays = 2;
    if (frequency === "every_3_days") intervalDays = 3;
    if (frequency === "weekly") intervalDays = 7;

    const schedule = await PostSchedule.create({
      userId: user.id,
      platform,
      postIds,
      postsPerSchedule,
      frequency,
      startDate: startDate ? new Date(startDate) : new Date(),
      nextRun: startDate ? new Date(startDate) : new Date(),
      totalPosts: postIds.length,
    });

    return NextResponse.json({
      message: "✅ Schedule created successfully!",
      schedule,
    });
  } catch (err) {
    console.error("🔥 Error creating schedule:", err);
    return NextResponse.json({ error: "Failed to create schedule" }, { status: 500 });
  }
}