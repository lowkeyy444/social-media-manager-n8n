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
import { verifyToken } from "@/lib/jwt";
import axios from "axios";
import User from "@/models/User"; // ✅ import User model

export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = await verifyToken(token);

    if (!user || !user.id) {
      console.error("❌ Invalid or missing user in token:", user);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const posts = await Post.find({ user: user.id }).sort({ createdAt: -1 });
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    await connectDB();
    const { postId, status } = await req.json();

    if (!postId || !status) {
      return NextResponse.json(
        { error: "Missing postId or status" },
        { status: 400 }
      );
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // ✅ Fetch current user to get their LinkedIn API key
    const token = req.headers.get("authorization")?.split(" ")[1];
    const userData = await verifyToken(token);
    const user = await User.findById(userData.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Fetch LinkedIn API key from user's saved tokens
    const linkedinApiKey = user.socialTokens?.linkedin;
    if (status === "approved") {
      if (!linkedinApiKey) {
        return NextResponse.json(
          { error: "LinkedIn API key not found for this user" },
          { status: 400 }
        );
      }

      try {
        console.log("📤 Sending post to LinkedIn workflow...");
        await axios.post(
          "https://lately-boss-gator.ngrok-free.app/webhook/linkdin-post-go", 
          {
            linkedinApiKey, // ✅ user’s saved key
            postText: post.postText,
            imageFileName: post.imageFileName,
          }
        );
      } catch (n8nError) {
        console.error("❌ Error calling LinkedIn n8n workflow:", n8nError.message);
        return NextResponse.json(
          { error: "Failed to post via n8n" },
          { status: 500 }
        );
      }
    }

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