// src/app/api/dashboard/generatepost/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { N8N_WEBHOOKS } from "@/config/n8n";
import Post from "@/models/Post";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    await connectDB();

    // ✅ Authorization
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // ✅ Parse body
    const { platform, topic, apiKey, logoUrl, postCount } = await req.json();
    if (!platform || !topic) {
      return NextResponse.json(
        { error: "Platform and topic are required" },
        { status: 400 }
      );
    }

    // ✅ Determine n8n webhook
    let webhookUrl = "";
    if (logoUrl && postCount == 1) webhookUrl = N8N_WEBHOOKS.withLogoSingle;
    else if (!logoUrl && postCount == 1) webhookUrl = N8N_WEBHOOKS.withoutLogoSingle;
    else webhookUrl = N8N_WEBHOOKS.customApi;

    const batchId = uuidv4();
    let totalPosts = [];
    let retries = 0;
    const maxRetries = 3;

    // ✅ Pre-check n8n availability
    try {
      const health = await fetch(webhookUrl.replace("/webhook", "/health"));
      if (!health.ok) throw new Error("n8n workflow not available");
    } catch (err) {
      return NextResponse.json(
        { error: "n8n workflow is currently unavailable. Try again later." },
        { status: 503 }
      );
    }

    // ✅ Loop to generate missing posts
    while (totalPosts.length < postCount && retries < maxRetries) {
      const remainingCount = postCount - totalPosts.length;

      let n8nRes;
      try {
        n8nRes = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ platform, topic, apiKey, logoUrl, postCount: remainingCount }),
        });
      } catch (err) {
        console.error("n8n request failed:", err);
        retries++;
        continue;
      }

      if (!n8nRes.ok) {
        const errText = await n8nRes.text();
        console.error("n8n error:", errText);
        retries++;
        continue;
      }

      const n8nData = await n8nRes.json();
      if (!Array.isArray(n8nData) || n8nData.length === 0) {
        retries++;
        continue;
      }

      // ✅ Format and save to DB
      const formattedPosts = n8nData.map((p) => ({
        user: user.id,
        platform,
        topic,
        approvalId: p.approvalId,
        status: p.status || "pending",
        postText: p.postText,
        imageFileName: p.imageFileName,
        imageUrl: p.image_url,
        htmlMessage: p.htmlMessage,
        n8nApiKey: apiKey,
        batchId,
        createdAt: new Date(),
      }));

      await Post.insertMany(formattedPosts);
      totalPosts.push(...formattedPosts);
    }

    // ✅ Return proper response
    if (totalPosts.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate any posts. Please try again later." },
        { status: 500 }
      );
    } else if (totalPosts.length < postCount) {
      return NextResponse.json({
        message: `⚠️ Only ${totalPosts.length} out of ${postCount} posts were generated after ${maxRetries} retries.`,
        postsSaved: totalPosts.length,
      });
    } else {
      return NextResponse.json({
        message: "✅ Post(s) generated successfully! Check Review Posts to approve.",
        postsSaved: totalPosts.length,
      });
    }
  } catch (err) {
    console.error("Generate Post API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// // src/app/api/dashboard/generatepost/route.js
// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import { verifyToken } from "@/lib/jwt";
// import { N8N_WEBHOOKS } from "@/config/n8n";
// import Post from "@/models/Post";

// export async function POST(req) {
//   try {
//     await connectDB();

//     // ✅ Check authorization
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader?.startsWith("Bearer ")) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];
//     const user = verifyToken(token);
//     if (!user) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 403 });
//     }

//     // ✅ Parse incoming body
//     const { platform, topic, apiKey, logoUrl, postCount } = await req.json();

//     if (!platform || !topic) {
//       return NextResponse.json(
//         { error: "Platform and topic are required" },
//         { status: 400 }
//       );
//     }

//     // ✅ Choose n8n webhook
//     let webhookUrl = "";
//     if (logoUrl && postCount == 1) {
//       webhookUrl = N8N_WEBHOOKS.withLogoSingle;
//     } else if (!logoUrl && postCount == 1) {
//       webhookUrl = N8N_WEBHOOKS.withoutLogoSingle;
//     } else {
//       webhookUrl = N8N_WEBHOOKS.customApi; // fallback or multiple post generation
//     }

//     // ✅ Call n8n workflow
//     const n8nRes = await fetch(webhookUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ platform, topic, apiKey, logoUrl, postCount }),
//     });

//     if (!n8nRes.ok) {
//       const errText = await n8nRes.text();
//       console.error("n8n error:", errText);
//       return NextResponse.json(
//         { error: "Failed to generate posts from workflow" },
//         { status: 500 }
//       );
//     }

//     const n8nData = await n8nRes.json();

//     // ✅ Format and save posts with API key
//     const formattedPosts = n8nData.map((p) => ({
//       user: user.id,
//       platform,
//       topic,
//       approvalId: p.approvalId,
//       status: p.status || "pending",
//       postText: p.postText,
//       imageFileName: p.imageFileName,
//       imageUrl: p.image_url,
//       htmlMessage: p.htmlMessage,
//       n8nApiKey: apiKey, // ✅ Save the key here
//       createdAt: new Date(),
//     }));

//     await Post.insertMany(formattedPosts);

//     return NextResponse.json({
//       message: "✅ Post(s) generated successfully! Check Review Posts to approve.",
//       postsSaved: formattedPosts.length,
//     });
//   } catch (err) {
//     console.error("Generate Post API error:", err);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
