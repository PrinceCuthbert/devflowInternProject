import { EventEmitter } from "events";
import nodemailer from "nodemailer";

// Mocking our ultra-fast asynchronous in-memory transaction queue layer
const mockRedisMemory = new EventEmitter();

// 🌐 READ ENVIRONMENT VARIABLES GENERATED FROM YOUR HUB
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;

let transporter;

if (smtpUser && smtpPassword) {
  // 🚀 Live Google SMTP Connection Mode
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: false, // false for TLS (Port 587)
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false, // Prevents local developer machine certificate blockages
    },
  });
  console.log(`📡 SMTP Status: Live production gateway initialized for ${smtpUser}`);
} else {
  // 🪵 Local Sandbox Fallback Mode
  transporter = nodemailer.createTransport({
    jsonTransport: true,
  });
  console.log("🪵 SMTP Status: Running in local terminal mock sandbox.");
}

// 📤 THE PRODUCER: Drops job into memory pool
export const addNotificationJob = (payload) => {
  console.log(`📥 BullMQ: Job received in queue. Enqueuing for: ${payload.to}`);

  setTimeout(() => {
    mockRedisMemory.emit("process_notification", payload);
  }, 100);
};

// ⚙️ THE CONSUMER WORKER: Processes job out of memory asynchronously
mockRedisMemory.on("process_notification", async (job) => {
  const { to, type, body } = job;
  console.log(`⚙️ BullMQ Worker: Popping task off. Mode: [${type}] ➔ To: ${to}`);

  try {
    if (type === "EMAIL") {
      // Send via the initialized transporter (Live or Mock)
      const info = await transporter.sendMail({
        from: `"DevFlow System's Authentication." <${smtpUser || 'security@todoapp.com'}>`,
        to,
        subject: "Your OTP Verification Code",
        text: `Hello,\n\n${body}\n\nThis code is valid for one login attempt.\n\nDevFlow Security Team.`,
      });

      if (smtpUser && smtpPassword) {
        console.log(`✉️ [SMTP SUCCESS] Live OTP email dispatched straight to: ${to}`);
        console.log(`📡 Message ID response from Google: ${info.messageId}`);
      } else {
        console.log(`✉️ Mock Email Sent with payload body: "${body}"`);
      }
    } else if (type === "SMS") {
      console.log(
        `📱 [FREE TWILIO SANDBOX] SMS outbox string routed safely to mobile ${to}: "${body}"`,
      );
    }
    console.log(`✅ BullMQ: Job successfully completed.`);
  } catch (error) {
    console.error(`❌ BullMQ Worker Job Failure:`, error);
  }
});