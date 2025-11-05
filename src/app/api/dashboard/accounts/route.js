import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SocialAccount from "@/models/SocialAccount";
import { verifyToken } from "@/lib/jwt";

export async function GET(req) {
  try {
    await connectDB();
    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const platform = req.nextUrl.searchParams.get("platform");
    const query = { userId: user.id };
    if (platform) query.platform = platform;

    // ✅ Fetch accounts including logoUrl
    const accounts = await SocialAccount.find(query);
    return NextResponse.json(accounts);
  } catch (err) {
    console.error("GET /accounts error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // ✅ Now also accept logoUrl
    const { platform, accountName, apiKey, nodeId, logoUrl } = await req.json();

    const newAccount = await SocialAccount.create({
      userId: user.id,
      platform,
      accountName,
      apiKey,
      nodeId,
      logoUrl: logoUrl || "", // Default empty string if not provided
    });

    return NextResponse.json(newAccount);
  } catch (err) {
    console.error("POST /accounts error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    await SocialAccount.deleteOne({ _id: id, userId: user.id });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /accounts error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}