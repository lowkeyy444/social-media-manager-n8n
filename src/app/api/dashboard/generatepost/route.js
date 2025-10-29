import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { N8N_WEBHOOKS } from "@/config/n8n";
import { v4 as uuidv4 } from "uuid";
import PostBatch from "@/models/PostBatch";
import User from "@/models/User"; // 🆕 import User model

export async function POST(req) {
  try {
    await connectDB();

    // 🔒 Auth validation
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const userData = verifyToken(token);
    if (!userData || !userData.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // 🧠 Parse request body
    const { platform, topic, apiKey, logoUrl, postCount } = await req.json();
    if (!platform || !topic) {
      return NextResponse.json(
        { error: "Platform and topic are required" },
        { status: 400 }
      );
    }

    console.log("🔹 GeneratePost request received:", {
      userId: userData.id,
      platform,
      topic,
      postCount,
      hasLogo: !!logoUrl,
    });

    // 🧾 Fetch user from DB
    const user = await User.findById(userData.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🧠 Determine which API key to use
    let platformApiKey = apiKey;
    const existingKey = user.socialTokens?.[platform];

    if (!existingKey && apiKey) {
      // 🆕 Save new API key if not already stored
      user.socialTokens[platform] = apiKey;
      await user.save();
      console.log(`💾 Saved new ${platform} API key for user ${user.email}`);
    } else if (existingKey && !apiKey) {
      // ✅ Reuse stored API key
      platformApiKey = existingKey;
      console.log(`🔁 Using saved ${platform} API key for user ${user.email}`);
    } else if (!existingKey && !apiKey) {
      // ❌ Neither provided nor stored
      return NextResponse.json(
        { error: `API key required for ${platform}` },
        { status: 400 }
      );
    }

    // 🌐 Select appropriate n8n webhook URL
    let webhookUrl = "";
    if (postCount === 1 && logoUrl) webhookUrl = N8N_WEBHOOKS.withLogoSingle;
    else if (postCount === 1 && !logoUrl) webhookUrl = N8N_WEBHOOKS.withoutLogoSingle;
    else webhookUrl = N8N_WEBHOOKS.customApi;

    const payload = {
      platform,
      topic,
      apiKey: platformApiKey,
      logoUrl,
      postCount,
      userId: userData.id,
    };

    // 🟢 Single post flow
    if (postCount === 1) {
      console.log("📤 Sending single-post request to:", webhookUrl);

      const n8nRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!n8nRes.ok) {
        const errText = await n8nRes.text();
        console.error("❌ N8N single-post error:", errText);
        return NextResponse.json(
          { error: "Failed to generate post from workflow" },
          { status: 500 }
        );
      }

      const n8nData = await n8nRes.json();
      return NextResponse.json({
        message: "✅ Single post generated! Check Review Posts to approve.",
        posts: n8nData,
      });
    }

    // 🟡 Multi-post flow
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
    console.log("📤 Triggering multi-post workflow:", webhookUrl);

    const n8nRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(multiPayload),
    });

    if (!n8nRes.ok) {
      const errText = await n8nRes.text();
      console.error("❌ N8N multi-post trigger error:", errText);
      return NextResponse.json(
        { error: "Failed to trigger multi-post workflow" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `✅ Multi-post workflow started for ${postCount} posts! Posts will be saved as they are generated.`,
      batchId,
    });
  } catch (err) {
    console.error("🔥 GeneratePost API fatal error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
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
