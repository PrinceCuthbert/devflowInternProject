import { EventEmitter } from "events";
import nodemailer from "nodemailer";

// Mocking an ultra-fast in-memory transaction layer
const mockRedisMemory = new EventEmitter();

// Configure our local mock transporter to output strings to console logs
const transporter = nodemailer.createTransport({
  jsonTransport: true,
});

// 📤 THE PRODUCER: Drops job into memory pool
export const addNotificationJob = (payload) => {
  console.log(`📥 BullMQ: Job received in queue. Enqueuing for: ${payload.to}`);

  // Simulate network tick latency delay before worker handles it
  setTimeout(() => {
    mockRedisMemory.emit("process_notification", payload);
  }, 100);
};

// ⚙️ THE CONSUMER WORKER: Processes job out of memory asynchronously
mockRedisMemory.on("process_notification", async (job) => {
  const { to, type, body } = job;
  console.log(
    `⚙️ BullMQ Worker: Popping task off. Mode: [${type}] ➔ To: ${to}`,
  );

  try {
    if (type === "EMAIL") {
      await transporter.sendMail({
        from: '"Identity Security Gateway" <security@todoapp.com>',
        to,
        subject: "Your OTP Verification Code",
        text: body,
      });
      console.log(`✉️ Mock Email Sent with payload body: "${body}"`);
    } else if (type === "SMS") {
      // 📱 Free SMS Sandbox: Outputs cleanly to developer log screen
      console.log(
        `📱 [FREE TWILIO SANDBOX] SMS outbox string routed safely to mobile ${to}: "${body}"`,
      );
    }
    console.log(`✅ BullMQ: Job successfully completed.`);
  } catch (error) {
    console.error(`❌ BullMQ Worker Job Failure:`, error);
  }
});
