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

    // ✅ Choose n8n webhook
    let webhookUrl = "";
    if (logoUrl && postCount == 1) {
      webhookUrl = N8N_WEBHOOKS.withLogoSingle;
    } else if (!logoUrl && postCount == 1) {
      webhookUrl = N8N_WEBHOOKS.withoutLogoSingle;
    } else {
      webhookUrl = N8N_WEBHOOKS.customApi; // fallback or multiple post generation
    }

    // ✅ Call n8n workflow
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

    // ✅ Format and save posts with API key
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
      n8nApiKey: apiKey, // ✅ Save the key here
      createdAt: new Date(),
    }));

    await Post.insertMany(formattedPosts);

    return NextResponse.json({
      message: "✅ Post(s) generated successfully! Check Review Posts to approve.",
      postsSaved: formattedPosts.length,
    });
  } catch (err) {
    console.error("Generate Post API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
// // src/app/api/dashboard/generatepost/route.js
// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import { verifyToken } from "@/lib/jwt";
// import Post from "@/models/Post";
// import { N8N_WEBHOOKS } from "@/config/n8n";

// export async function POST(req) {
//   try {
//     await connectDB();

//     // Authenticate user
//     const authHeader = req.headers.get("Authorization");
//     if (!authHeader?.startsWith("Bearer ")) {
//       return NextResponse.json(
//         { error: "Unauthorized. Please login." },
//         { status: 401 }
//       );
//     }

//     const token = authHeader.split(" ")[1];
//     const user = verifyToken(token);
//     if (!user) {
//       return NextResponse.json(
//         { error: "Unauthorized. Please login." },
//         { status: 401 }
//       );
//     }

//     // Parse request body
//     const { platform, topic, apiKey, logoUrl, postCount } = await req.json();
//     if (!platform || !topic || !apiKey || !postCount) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Decide which n8n webhook to call
//     let n8nUrl = "";
//     if (postCount === 1 && !logoUrl) {
//       n8nUrl = N8N_WEBHOOKS.withoutLogoSingle;
//     } else if (postCount === 1 && logoUrl) {
//       n8nUrl = N8N_WEBHOOKS.withLogoSingle;
//     } else {
//       n8nUrl = N8N_WEBHOOKS.customApi;
//     }

//     // Call the n8n webhook
//     const response = await fetch(n8nUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ platform, topic, apiKey, logoUrl, postCount, userId: user.id }),
//     });

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: "n8n workflow failed" },
//         { status: 500 }
//       );
//     }

//     const posts = await response.json();

//     // Store posts in DB
//     await Post.insertMany(
//       posts.map((p) => ({ ...p, user: user.id, platform, topic }))
//     );

//     return NextResponse.json({
//       message: "Post(s) generated successfully! Check Review Posts to approve.",
//       posts,
//     });
//   } catch (err) {
//     console.error("Generate Post API error:", err);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }