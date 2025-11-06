import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import PostSchedule from "./src/models/PostSchedule.js";
import Post from "./src/models/Post.js";
import SocialAccount from "./src/models/SocialAccount.js";

dotenv.config({ path: ".env.local" });

await mongoose.connect(process.env.MONGODB_URI);
console.log("✅ Scheduler connected to MongoDB");

// 🔹 Utility Functions
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const getIntervalDays = (frequency) => {
  switch (frequency) {
    case "every_2_days":
      return 2;
    case "every_3_days":
      return 3;
    case "weekly":
      return 7;
    default:
      return 1;
  }
};

// 🔹 Function to safely post to n8n with retry support
async function postToWebhook(url, payload, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await axios.post(url, payload);
      return true;
    } catch (err) {
      console.error(
        `⚠️ [Attempt ${attempt}] Failed to post to ${url}:`,
        err.message
      );
      if (attempt === retries) return false;
      await new Promise((res) => setTimeout(res, 2000)); // wait 2s before retry
    }
  }
}

// 🔹 Main Scheduler Loop
async function runScheduler() {
  const now = new Date();
  const schedules = await PostSchedule.find({
    status: "active",
    nextRun: { $lte: now },
  });

  if (schedules.length === 0) {
    console.log("⏳ No active schedules to run right now.");
    return;
  }

  for (const s of schedules) {
    console.log(`🚀 Running schedule for ${s.platform} (${s._id})`);

    const startIdx = s.currentIndex;
    const endIdx = Math.min(startIdx + s.postsPerSchedule, s.totalPosts);
    const postIdsToSend = s.postIds.slice(startIdx, endIdx);
    const posts = await Post.find({ _id: { $in: postIdsToSend } });

    for (const post of posts) {
      try {
        const platform = post.platform?.toLowerCase();
        if (!platform) {
          console.error(`⚠️ Post ${post._id} has no platform.`);
          continue;
        }

        const socialAccount = await SocialAccount.findOne({
          userId: s.userId,
          platform,
        });

        if (!socialAccount) {
          console.error(`⚠️ No connected ${platform} account found for user ${s.userId}`);
          continue;
        }

        const { apiKey, nodeId } = socialAccount;
        let success = false;

        // 🔹 LinkedIn
        if (platform === "linkedin") {
          if (!apiKey) {
            console.error("❌ Missing LinkedIn API key for user", s.userId);
            continue;
          }

          console.log(`📤 Posting LinkedIn post for user ${s.userId}`);
          success = await postToWebhook(
            "https://lately-boss-gator.ngrok-free.app/webhook/linkdin-post-go",
            {
              linkedinApiKey: apiKey,
              postText: post.postText,
              imageFileName: post.imageFileName,
            }
          );
        }

        // 🔹 Instagram
        else if (platform === "instagram") {
          if (!apiKey || !nodeId) {
            console.error("❌ Missing Instagram credentials for user", s.userId);
            continue;
          }

          console.log(`📸 Posting Instagram post for user ${s.userId}`);
          success = await postToWebhook(
            "https://lately-boss-gator.ngrok-free.app/webhook-test/instagram-posting",
            {
              instagramApiKey: apiKey,
              nodeId,
              postText: post.postText,
              imageFileName: post.imageFileName,
            }
          );
        }

        // 🔹 Facebook
        else if (platform === "facebook") {
          if (!apiKey || !nodeId) {
            console.error("❌ Missing Facebook credentials for user", s.userId);
            continue;
          }

          console.log(`📘 Posting Facebook post for user ${s.userId}`);
          success = await postToWebhook(
            "https://lately-boss-gator.ngrok-free.app/webhook-test/facebook-posting",
            {
              facebookApiKey: apiKey,
              nodeId,
              postText: post.postText,
              imageFileName: post.imageFileName,
              platform: "facebook",
              topic: post.topic,
              postCount: 1,
              batchId: post.batchId || "manual",
              userId: s.userId.toString(),
            }
          );
        }

        // ✅ If successfully posted, update post status
        if (success) {
          await Post.findByIdAndUpdate(post._id, {
            status: "posted",
            postedAt: new Date(),
          });
          console.log(`✅ Successfully posted ${post._id} to ${platform}`);
        } else {
          console.error(`❌ Failed after retries for post ${post._id} (${platform})`);
        }
      } catch (err) {
        console.error(`🔥 Error in scheduler for post ${post._id}:`, err.message);
      }
    }

    // 🔹 Update schedule progress
    s.currentIndex = endIdx;
    if (endIdx >= s.totalPosts) {
      s.status = "completed";
      console.log(`🎉 Schedule ${s._id} completed!`);
    } else {
      s.nextRun = addDays(now, getIntervalDays(s.frequency));
      console.log(`⏭️ Next run for ${s._id} set to ${s.nextRun.toISOString()}`);
    }
    await s.save();
  }
}

// 🔁 Run scheduler every minute
setInterval(runScheduler, 60 * 1000);
console.log("🕐 Scheduler running every 60 seconds...");