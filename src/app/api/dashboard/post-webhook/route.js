// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Post from "@/models/Post";
// import PostBatch from "@/models/PostBatch";
// import { N8N_WEBHOOKS } from "@/config/n8n";

// export async function POST(req) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     console.log("📩 Incoming post webhook:", body);

//     const {
//       userId,
//       platform,
//       topic,
//       approvalId,
//       postText,
//       imageFileName,
//       image_url,
//       htmlMessage,
//       n8nApiKey,
//       batchId,
//     } = body;

//     if (!userId || !postText) {
//       console.warn("⚠️ Missing required fields in webhook payload:", body);
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     // ✅ Save post
//     const post = await Post.create({
//       user: userId,
//       platform: platform || "unknown",
//       topic: topic || "general",
//       approvalId: approvalId || `n8n-${Date.now()}`,
//       postText,
//       imageFileName: imageFileName || null,
//       imageUrl: image_url || null,
//       htmlMessage: htmlMessage || null,
//       n8nApiKey: n8nApiKey || null,
//       status: "pending",
//       createdAt: new Date(),
//     });

//     console.log("✅ Post saved to DB:", post._id);

//     // ✅ Update batch if exists
//     if (batchId) {
//       const batch = await PostBatch.findOne({ batchId });
//       if (batch) {
//         batch.postCountReceived += 1;
//         await batch.save();

//         // check for missing posts after 30 sec
//         setTimeout(async () => {
//           const updatedBatch = await PostBatch.findOne({ batchId });
//           if (!updatedBatch) return;

//           const missingPosts = updatedBatch.postCountRequested - updatedBatch.postCountReceived;
//           if (missingPosts > 0) {
//             console.warn(`⚠️ Missing ${missingPosts} posts in batch ${batchId}, recalling n8n...`);

//             try {
//               await fetch(N8N_WEBHOOKS.customApi, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                   platform: updatedBatch.platform,
//                   topic: updatedBatch.topic,
//                   userId: updatedBatch.userId,
//                   postCount: missingPosts,
//                   batchId: updatedBatch.batchId,
//                 }),
//               });
//             } catch (err) {
//               console.error("❌ Error recalling n8n for missing posts:", err);
//             }
//           }
//         }, 30000); // 30 sec delay
//       }
//     }

//     return NextResponse.json({ success: true, postId: post._id });
//   } catch (err) {
//     console.error("❌ Post webhook error:", err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import PostBatch from "@/models/PostBatch";
import { N8N_WEBHOOKS } from "@/config/n8n";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("📩 Incoming post webhook:", body);

    const {
      userId,
      platform,
      topic,
      approvalId,
      postText,
      imageFileName,
      image_url,
      htmlMessage,
      n8nApiKey,
      batchId,
    } = body;

    if (!userId || !postText) {
      console.warn("⚠️ Missing required fields in webhook payload:", body);
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    //  Save post to DB
    const post = await Post.create({
      user: userId,
      platform: platform || "unknown",
      topic: topic || "general",
      approvalId: approvalId || `n8n-${Date.now()}`,
      postText,
      imageFileName: imageFileName || null,
      imageUrl: image_url || null,
      htmlMessage: htmlMessage || null,
      n8nApiKey: n8nApiKey || null,
      batchId: batchId || null,
      status: "pending",
      createdAt: new Date(),
    });

    console.log("✅ Post saved to DB:", post._id);

    // Update batch info if batchId exists
    if (batchId) {
      const batch = await PostBatch.findOne({ batchId });
      if (batch) {
        batch.postCountReceived += 1;

        // Mark batch completed if all posts received
        if (batch.postCountReceived >= batch.postCountRequested) {
          batch.status = "completed";
        }

        await batch.save();

        // If first post received, schedule a delayed check for missing posts
        if (!batch.retryScheduled) {
          batch.retryScheduled = true;
          await batch.save();

          const maxTimePerPost = 60 * 1000; // 1 min per post, adjust if needed
          const delay = batch.postCountRequested * maxTimePerPost;

          setTimeout(async () => {
            try {
              const currentBatch = await PostBatch.findOne({ batchId });
              if (!currentBatch || currentBatch.status === "completed") return;

              const remainingPosts = currentBatch.postCountRequested - currentBatch.postCountReceived;
              if (remainingPosts > 0) {
                console.warn(`⚠️ Missing ${remainingPosts} posts in batch ${batchId}, retrying...`);

                // Trigger n8n for remaining posts
                await fetch(N8N_WEBHOOKS.customApi, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    platform: currentBatch.platform,
                    topic: currentBatch.topic,
                    userId: currentBatch.userId,
                    postCount: remainingPosts,
                    batchId: currentBatch.batchId,
                  }),
                });
              }
            } catch (err) {
              console.error("❌ Error retrying missing posts:", err);
            }
          }, delay);
        }
      }
    }

    return NextResponse.json({ success: true, postId: post._id });
  } catch (err) {
    console.error("❌ Post webhook error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}