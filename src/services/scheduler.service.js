const schedule = require("node-schedule");
const whatsappManager = require("./whatsapp");

const TARGET_PHONE = "6289506373551";
const MESSAGE = "HALO INI ADALAH PESAN OTOMATIS DARI SCHEDULLER";

/**
 * Send message to header
 */
const sendMessage = async () => {
  try {
    // Get all connected sessions
    const sessions = whatsappManager.getAllSessions();
    const connectedSession = sessions.find((s) => s.isConnected);

    if (!connectedSession) {
      console.log("[Scheduler] No connected session found. Skipping message send.");
      return;
    }

    const session = whatsappManager.getSession(connectedSession.sessionId);
    if (!session) {
      console.log(`[Scheduler] Session ${connectedSession.sessionId} not found (unexpected).`);
      return;
    }

    console.log(`[Scheduler] Sending message to ${TARGET_PHONE} using session ${session.sessionId}...`);

    await session.sendTextMessage(TARGET_PHONE, MESSAGE);
    console.log("[Scheduler] Message sent successfully.");
  } catch (error) {
    console.error("[Scheduler] Error sending message:", error);
  }
};

const initScheduler = () => {
  console.log("[Scheduler] Initializing scheduler...");

  // Jadwal: 13:00, 13:30, 14:00, 14:30
  schedule.scheduleJob("0,30 13-14 * * *", () => {
    console.log("[Scheduler] Triggering scheduled job (13:00-14:30 range)...");
    sendMessage();
  });

  // Jadwal: 15:00
  schedule.scheduleJob("0 15 * * *", () => {
    console.log("[Scheduler] Triggering scheduled job (15:00)...");
    sendMessage();
  });

  schedule.scheduleJob("* * * * *", () => {
    console.log("[Scheduler] TEST");
    sendMessage();
  });

  console.log("[Scheduler] Jobs scheduled for 13:00, 13:30, 14:00, 14:30, 15:00 daily.");
};

module.exports = {
  initScheduler,
};
