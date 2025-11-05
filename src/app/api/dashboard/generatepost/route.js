import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { N8N_WEBHOOKS } from "@/config/n8n";
import { v4 as uuidv4 } from "uuid";
import PostBatch from "@/models/PostBatch";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const userData = verifyToken(token);
    if (!userData?.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const { platform, topic, logoUrl, postCount, imageUrl } = await req.json();
    if (!platform || !topic) {
      return NextResponse.json({ error: "Platform and topic are required" }, { status: 400 });
    }

    const user = await User.findById(userData.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // ✅ Get stored credentials from Manage Social Accounts (if needed later)
    // We’re not saving or modifying them here anymore.

    // ---------- Instagram ----------
    if (platform === "instagram") {
      const batchId = uuidv4();
      const payload = {
        platform,
        topic,
        postCount,
        batchId,
        userId: userData.id,
        imageUrl: imageUrl || "",
      };

      const webhookUrl = N8N_WEBHOOKS.instagram;

      if (postCount > 1) {
        await PostBatch.create({
          userId: userData.id,
          platform,
          topic,
          postCountRequested: postCount,
          postCountReceived: 0,
          batchId,
          createdAt: new Date(),
        });
      }

      const n8nRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!n8nRes.ok) {
        const errText = await n8nRes.text();
        console.error("❌ Instagram workflow error:", errText);
        return NextResponse.json({ error: "Failed to generate Instagram post" }, { status: 500 });
      }

      const n8nData = await n8nRes.json();
      return NextResponse.json({
        message: `✅ Instagram workflow triggered successfully (${postCount} post${postCount > 1 ? "s" : ""})`,
        posts: n8nData,
        batchId,
      });
    }

    // ---------- Facebook ----------
    if (platform === "facebook") {
      const batchId = uuidv4();
      const payload = {
        platform,
        topic,
        postCount,
        batchId,
        userId: userData.id,
        imageUrl: imageUrl || "",
      };

      const webhookUrl = logoUrl
        ? N8N_WEBHOOKS.facebookWithUrl
        : N8N_WEBHOOKS.facebook;

      if (postCount > 1) {
        await PostBatch.create({
          userId: userData.id,
          platform,
          topic,
          postCountRequested: postCount,
          postCountReceived: 0,
          batchId,
          createdAt: new Date(),
        });
      }

      const n8nRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!n8nRes.ok) {
        const errText = await n8nRes.text();
        console.error("❌ Facebook workflow error:", errText);
        return NextResponse.json({ error: "Failed to generate Facebook post" }, { status: 500 });
      }

      const n8nData = await n8nRes.json();
      return NextResponse.json({
        message: `✅ Facebook workflow triggered successfully (${postCount} post${postCount > 1 ? "s" : ""})`,
        posts: n8nData,
        batchId,
      });
    }

    // ---------- Default (LinkedIn and others) ----------
    let webhookUrl = "";
    if (postCount === 1 && logoUrl) webhookUrl = N8N_WEBHOOKS.withLogoSingle;
    else if (postCount === 1 && !logoUrl) webhookUrl = N8N_WEBHOOKS.withoutLogoSingle;
    else webhookUrl = N8N_WEBHOOKS.customApi;

    const payload = { platform, topic, logoUrl, postCount, userId: userData.id };

    if (postCount === 1) {
      const n8nRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!n8nRes.ok) {
        const errText = await n8nRes.text();
        console.error("❌ N8N single-post error:", errText);
        return NextResponse.json({ error: "Failed to generate post from workflow" }, { status: 500 });
      }

      const n8nData = await n8nRes.json();
      return NextResponse.json({
        message: "✅ Single post generated! Check Review Posts to approve.",
        posts: n8nData,
      });
    }

    const batchId = uuidv4();
    await PostBatch.create({
      userId: userData.id,
      platform,
      topic,
      postCountRequested: postCount,
      postCountReceived: 0,
      batchId,
      createdAt: new Date(),
    });

    const multiPayload = { ...payload, batchId };
    const n8nRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(multiPayload),
    });

    if (!n8nRes.ok) {
      const errText = await n8nRes.text();
      console.error("❌ N8N multi-post trigger error:", errText);
      return NextResponse.json({ error: "Failed to trigger multi-post workflow" }, { status: 500 });
    }

    return NextResponse.json({
      message: `✅ Multi-post workflow started for ${postCount} posts!`,
      batchId,
    });

  } catch (err) {
    console.error("🔥 GeneratePost API fatal error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
