import { connectDB } from "@/lib/db";
import PostSchedule from "@/models/PostSchedule";

let isRunning = false;

async function simulateScheduler() {
  if (isRunning) return;
  isRunning = true;

  try {
    await connectDB();
    const now = new Date();

    const schedules = await PostSchedule.find({
      status: "active",
      nextRun: { $lte: now },
    });

    for (const schedule of schedules) {
      console.log(`🚀 Simulating post #${schedule.currentIndex + 1} on ${schedule.platform}`);

      schedule.currentIndex += 1;
      if (schedule.currentIndex >= schedule.totalPosts) {
        schedule.status = "completed";
        console.log(`✅ Completed schedule for ${schedule.platform}`);
      } else {
        schedule.nextRun = new Date(Date.now() + 10000); // every 10s for demo
      }

      await schedule.save();
    }
  } catch (err) {
    console.error("Scheduler error:", err);
  } finally {
    isRunning = false;
  }
}

setInterval(simulateScheduler, 5000); // every 5s
console.log("🧪 Demo Scheduler running every 5 seconds");

export default simulateScheduler;