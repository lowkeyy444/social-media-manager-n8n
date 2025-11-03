// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Post from "@/models/postModel";
// import { verifyToken } from "@/lib/jwt";
// import axios from "axios";

// export async function GET(req) {
//   try {
//     await connectDB();

//     const authHeader = req.headers.get("authorization");
//     if (!authHeader) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];
//     const user = await verifyToken(token); // ✅ added await

//     if (!user || !user.id) {
//       console.error("❌ Invalid or missing user in token:", user);
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//     }

//     const posts = await Post.find({ user: user.id }).sort({ createdAt: -1 });
//     return NextResponse.json(posts, { status: 200 });
//   } catch (error) {
//     console.error("❌ Error fetching posts:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to fetch posts" },
//       { status: 500 }
//     );
//   }
// }

// export async function PATCH(req) {
//   try {
//     await connectDB();
//     const { postId, status } = await req.json();

//     if (!postId || !status) {
//       return NextResponse.json(
//         { error: "Missing postId or status" },
//         { status: 400 }
//       );
//     }

//     const post = await Post.findById(postId);
//     if (!post) {
//       return NextResponse.json({ error: "Post not found" }, { status: 404 });
//     }

//     if (status === "approved") {
//       try {
//         await axios.post(
//           "https://lately-boss-gator.ngrok-free.app/webhook-test/post-to-platform",
//           {
//             platform: post.platform,
//             postText: post.postText,
//             image_url: post.image_url,
//             htmlMessage: post.htmlMessage,
//             approvalId: post.approvalId,
//           }
//         );
//       } catch (n8nError) {
//         console.error("Error calling n8n workflow:", n8nError.message);
//         return NextResponse.json(
//           { error: "Failed to post via n8n" },
//           { status: 500 }
//         );
//       }
//     }

//     const updatedPost = await Post.findByIdAndUpdate(
//       postId,
//       { status },
//       { new: true }
//     );

//     return NextResponse.json(updatedPost, { status: 200 });
//   } catch (error) {
//     console.error("Error updating post:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to update post" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/postModel";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import axios from "axios";

// Fetch posts for logged-in user
export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = await verifyToken(token);

    if (!user?.id) {
      console.error("❌ Invalid user in token:", user);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const posts = await Post.find({ user: user.id }).sort({ createdAt: -1 });
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// Handle approving/rejecting post
export async function PATCH(req) {
  try {
    await connectDB();
    const { postId, status } = await req.json();

    if (!postId || !status) {
      return NextResponse.json({ error: "Missing postId or status" }, { status: 400 });
    }

    const token = req.headers.get("authorization")?.split(" ")[1];
    const userData = await verifyToken(token);
    const user = await User.findById(userData.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Only post to social media when approved
    if (status === "approved") {
      const platform = post.platform?.toLowerCase();

      try {
        // LinkedIn Flow
        if (platform === "linkedin") {
          const linkedinApiKey = user.socialTokens?.linkedin?.token;
          if (!linkedinApiKey) {
            return NextResponse.json({ error: "Missing LinkedIn token" }, { status: 400 });
          }

          console.log("📤 Sending approved post to LinkedIn workflow...");
          await axios.post(
            "https://lately-boss-gator.ngrok-free.app/webhook/linkdin-post-go",
            {
              linkedinApiKey,
              postText: post.postText,
              imageFileName: post.imageFileName,
            }
          );
        }

        //  Instagram Flow
        if (platform === "instagram") {
          const instagramToken = user.socialTokens?.instagram?.token;
          const instagramNodeId = user.socialTokens?.instagram?.nodeId;

          if (!instagramToken) {
            return NextResponse.json({ error: "Missing Instagram API token" }, { status: 400 });
          }
          if (!instagramNodeId) {
            return NextResponse.json({ error: "Missing Instagram Node ID" }, { status: 400 });
          }

          console.log("📸 Sending approved post to Instagram workflow...");
          await axios.post(
            "https://lately-boss-gator.ngrok-free.app/webhook-test/instagram-posting",
            {
              instagramApiKey: instagramToken,
              nodeId: instagramNodeId,
              postText: post.postText,
              imageFileName: post.imageFileName,
            }
          );
        }

        // Facebook Flow
        if (platform === "facebook") {
          const facebookApiKey = user.socialTokens?.facebook?.token;
          const facebookNodeId = user.socialTokens?.facebook?.nodeId;

          if (!facebookApiKey) {
            return NextResponse.json({ error: "Missing Facebook API token" }, { status: 400 });
          }
          if (!facebookNodeId) {
            return NextResponse.json({ error: "Missing Facebook Node ID" }, { status: 400 });
          }

          console.log("📘 Sending approved post to Facebook workflow...");
          await axios.post(
            "https://lately-boss-gator.ngrok-free.app/webhook-test/facebook-posting",
            {
              facebookApiKey,
              nodeId: facebookNodeId,
              postText: post.postText,
              imageFileName: post.imageFileName,
              platform: "facebook",
              topic: post.topic,
              postCount: 1,
              batchId: post.batchId || "manual",
              userId: user._id.toString(),
            }
          );
        }

      } catch (err) {
        console.error(`❌ Error posting to ${post.platform}:`, err.message);
        return NextResponse.json({ error: `Failed to post to ${post.platform}` }, { status: 500 });
      }
    }

    // Update post status in DB
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { status },
      { new: true }
    );

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error("🔥 Error updating post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update post" },
      { status: 500 }
    );
  }
}