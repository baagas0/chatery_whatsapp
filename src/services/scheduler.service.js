const schedule = require("node-schedule");
const whatsappManager = require("./whatsapp");
const { aiClient } = require("./ai.service");

const TARGET_PHONE_MARIO = "6281247430546";
const TARGET_PHONE = "6282193396672";
const MESSAGE = "ayangg mammm";

const getMessage = async () => {
  const listMessage = [
    "ayang dah mam belumm?",
    "yanggg udah mam apa belom?",
    "sayangku mam dulu yaa!",
    "jangan lupa mam ya ayanggg",
    "mammm dulu yangg",
    "ayang mam sekarang yaa",
    "yang udah isi perut belomm?",
    "sayanggg mam duluu",
    "mam yaa ayangku cintaakuu",
    "yanggg jangan lupa mammm",
    "ayang udah makann belumm?",
    "mam dulu dongg sayang",
    "yangg perutnya udah diisi belomm",
    "ayang mam biar kuattt",
    "sayangku ingat mam yaa",
    "mam sekarang yaa yanggg",
    "yang jangan skip mam yaa",
    "sayang udah makann belom?",
    "mam yaa ayangku manissku",
    "ayanggg perut kosong nggakk?",
    "yangg ayo mam duluu",
    "sayang jangan lupa makann",
    "mammmm ayanggg",
    "ayang mam biar sehattt",
    "yangg udah makann apaa",
    "sayangku mam sekarang yaa",
    "ayanggg udah mam belumm sayangg",
    "yang ayo isi perut duluu",
    "mam yaa ayang cantikkk",
    "ayanggg jangan lupa mam yaa",
    "sayang mam biar nggak laper",
    "mam dulu yaa ayangku",
    "ayanggg perutnya udah mam?",
    "yangg jangan telat mam yaa",
    "sayangku udah makann belumm",
    "mam sekarangg ayanggg",
    "ayanggg ayo mam yaa",
    "ayanggg makann dulu yahh",
    "yangg udah isi perut belumm",
    "mam yaa ayangku sayangggku",
    "ayanggg jangan lupa mammm yaa",
    "yang udah makann apaa hari inii",
    "sayangku ayo mam duluu",
    "mam biar nggak masuk anginn",
    "ayanggg makann sekarang yaa",
    "sayang udah mam belom?",
    "mam dulu dong ayanggg",
    "ayanggg perutnya udah keisi belomm",
    "yang ayo makannn",
    "sayang mam yaa biar kuattt",
    "ayanggg jangan lupa isi perut",
    "yangg udah makann belom yaa",
    "mam sekarang ayangkuuu",
    "sayang ayo mam dulu",
    "yang jangan lupa makannn",
    "sayang udah mam belumm ayangg",
    "mam duluu ayanggg",
    "ayanggg ayo isi perut yaa",
    "sayang mam biar sehat yaa",
    "ayanggg udah makann kan?",
    "yang ayo mam sekarangg",
    "sayangku jangan lupa makann",
    "mammm ayanggg",
    "ayanggg mamm dongg",
    "yang udah isi perut belum?",
    "sayang mam dulu yaa aku ingett",
    "ayanggg jangan lupa mam yaa sayang",
    "sayang udah mam belommm",
    "mam sekarang yaa ayangku",
    "yang jangan lupa mam demi kesehatan",
    "sayang mam yaa yangg",
    "ayanggg ayo makann duluu",
    "yangg udah mam belom nih sayangg",
    "mam dulu ayang maniss",
    "ayanggg jangan lupa mam hari inii",
    "yang ayo isi perut sekarang",
    "sayang mam biar nggak capee",
    "ayanggg udah makann apaa",
    "yang jangan lupa makann yaa cintaa",
    "sayangku mam sekarang dongg",
    "ayanggg ayo mammm yaa",
    "yangg jangan telat mam hari inii",
    "sayang udah isi perut belom ayangg",
  ];

  return listMessage[Math.floor(Math.random() * listMessage.length)];
};

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

    const text = (await getMessage()) || MESSAGE;

    console.log(`[Scheduler] Sending message to ${TARGET_PHONE} using session ${session.sessionId}...`);

    await session.sendTextMessage(TARGET_PHONE, text);
    console.log("[Scheduler] Message sent successfully.");
  } catch (error) {
    console.error("[Scheduler] Error sending message:", error);
  }
};

// NOTIFY SEND TO MARIO
const sendMessageMario = async () => {
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

    const text = "mar ingpo update satu sehat";

    console.log(`[Scheduler] Sending message to ${TARGET_PHONE_MARIO} using session ${session.sessionId}...`);

    await session.sendTextMessage(TARGET_PHONE_MARIO, text, 1200);
    console.log("[Scheduler] Message sent successfully.");
  } catch (error) {
    console.error("[Scheduler] Error sending message:", error);
  }
};

const initScheduler = () => {
  console.log("[Scheduler] Initializing scheduler...");

  // Jadwal: 13:00, 13:30, 14:00, 14:30, 15:00 (Senin-Jumat) on UTC+7
  schedule.scheduleJob("* * * * *", () => {
    const date = new Date();
    // Convert to +7 timezone
    const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
    const plusSevenTime = new Date(utcTime + 7 * 3600000);

    const hour = plusSevenTime.getHours();
    const minute = plusSevenTime.getMinutes();
    const dayOfWeek = plusSevenTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday

    // Check if it's a weekday (Monday-Friday)
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

    // Check if time matches 13:00, 13:30, 14:00, 14:30, or 15:00
    const isScheduledTime = (hour === 13 && (minute === 0 || minute === 30)) || (hour === 14 && (minute === 0 || minute === 30)) || (hour === 15 && minute === 0);

    if (isWeekday && isScheduledTime) {
      console.log(`[Scheduler] Triggering scheduled job (${hour}:${minute.toString().padStart(2, "0")} UTC+7)...`);
      sendMessage();
    }
  });

  console.log("[Scheduler] NOTIFY MARIO");
  const rule16 = new schedule.RecurrenceRule();
  rule16.tz = "Asia/Jakarta";
  rule16.hour = 10;
  rule16.minute = 30;
  
  const rule20 = new schedule.RecurrenceRule();
  rule20.tz = "Asia/Jakarta";
  rule20.hour = 20;
  rule20.minute = 0;
  
  schedule.scheduleJob(rule16, () => {
    console.log("[Scheduler] Triggering Mario message (16:00 +7)");
    sendMessageMario();
  });
  
  schedule.scheduleJob(rule20, () => {
    console.log("[Scheduler] Triggering Mario message (20:00 +7)");
    sendMessageMario();
  });

  console.log("[Scheduler] Mario message scheduler active for 20:55-21:05 (+7 timezone).");
};

module.exports = {
  initScheduler,
};
