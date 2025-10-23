// src/app/api/dashboard/generatepost/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { N8N_WEBHOOKS } from "@/config/n8n";
import Post from "@/models/Post";

export async function POST(req) {
  try {
    await connectDB();

    // ✅ Check authorization
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // ✅ Parse incoming body
    const { platform, topic, apiKey, logoUrl, postCount } = await req.json();

    if (!platform || !topic) {
      return NextResponse.json(
        { error: "Platform and topic are required" },
        { status: 400 }
      );
    }

    // ✅ Determine webhook URL
    let webhookUrl = "";
    if (logoUrl && postCount === 1) {
      webhookUrl = N8N_WEBHOOKS.withLogoSingle;
    } else if (!logoUrl && postCount === 1) {
      webhookUrl = N8N_WEBHOOKS.withoutLogoSingle;
    } else {
      webhookUrl = N8N_WEBHOOKS.customApi; // multiple posts
    }

    const allPosts = [];

    if (postCount === 1) {
      // ✅ Single post: keep original behavior
      const n8nRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, topic, apiKey, logoUrl, postCount }),
      });

      if (!n8nRes.ok) {
        const errText = await n8nRes.text();
        console.error("n8n error:", errText);
        return NextResponse.json(
          { error: "Failed to generate posts from workflow" },
          { status: 500 }
        );
      }

      const n8nData = await n8nRes.json();
      allPosts.push(...n8nData);
    } else {
      // ✅ Multiple posts: generate sequentially
      for (let i = 0; i < postCount; i++) {
        const n8nRes = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ platform, topic, apiKey, logoUrl, postCount: 1 }),
        });

        if (!n8nRes.ok) {
          const errText = await n8nRes.text();
          console.error(`n8n error on post ${i + 1}:`, errText);
          return NextResponse.json(
            { error: `Failed to generate post ${i + 1}` },
            { status: 500 }
          );
        }

        const n8nData = await n8nRes.json();
        allPosts.push(...n8nData); // push the single post returned
      }
    }

    // ✅ Format and save posts
    const formattedPosts = allPosts.map((p) => ({
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
      createdAt: new Date(),
    }));

    await Post.insertMany(formattedPosts);

    return NextResponse.json({
      message: "✅ Post(s) generated successfully! Check Review Posts to approve.",
      postsSaved: formattedPosts.length,
    });
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
