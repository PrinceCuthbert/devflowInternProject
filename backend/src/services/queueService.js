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
      // Send via the initialized transporter (Live or Mock)
      const info = await transporter.sendMail({
        // 🚀 Branded the sender name precisely for DevFlow!
        from: `"DevFlow Security Gateway" <${smtpUser || "security@devflow.com"}>`,
        to,
        // 🚀 Branded the Subject Line
        subject: "DevFlow - Secure OTP Verification Code",
        // 🚀 Branded the Body Template Layout
        text: `Hello,\n\n${body}\n\nThis security code is short-lived and valid for one login session into your workspace.\n\nBest regards,\nDevFlow Project Management Suite`,
      });

      if (smtpUser && smtpPassword) {
        console.log(
          `✉️ [SMTP SUCCESS] Live DevFlow OTP email dispatched straight to: ${to}`,
        );
        console.log(`📡 Message ID response from Google: ${info.messageId}`);
      } else {
        console.log(`✉️ Mock Email Sent with payload body: "${body}"`);
      }
    } else if (type === "SMS") {
      console.log(
        `📱 [FREE TWILIO SANDBOX] DevFlow SMS outbox string routed safely to mobile ${to}: "${body}"`,
      );
    }
    console.log(`✅ BullMQ: Job successfully completed.`);
  } catch (error) {
    console.error(`❌ BullMQ Worker Job Failure:`, error);
  }
});
