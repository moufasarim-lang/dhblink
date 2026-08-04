import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

const DIST_ROOT = "./dist";
const ENABLE_IP_BLOCKING = true;
const ipCache = new Map<string, { blocked: boolean; timestamp: number }>();
const CACHE_DURATION_MS = 5 * 60 * 1000;

function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  const realIP = req.headers.get("x-real-ip");
  if (realIP) return realIP;

  return "Unknown";
}

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
    const org = String(data.org || "").toLowerCase();
    const asn = String(data.asn || "");

    if (data.proxy === true || data.hosting === true) {
      ipCache.set(ip, { blocked: true, timestamp: now });
      return true;
    }

    const blockedKeywords = [
      "vpn",
      "proxy",
      "hosting",
      "cloud",
      "datacenter",
      "server",
      "vps",
      "dedicated",
      "amazon",
      "aws",
      "google cloud",
      "microsoft azure",
      "digitalocean",
      "ovh",
      "hetzner",
      "linode",
      "vultr",
      "scaleway",
      "leaseweb",
      "nordvpn",
      "expressvpn",
      "surfshark",
      "cloudflare",
      "fastly",
      "akamai",
    ];

    if (blockedKeywords.some((keyword) => org.includes(keyword))) {
      ipCache.set(ip, { blocked: true, timestamp: now });
      return true;
    }

    const blockedASNs = [
      "AS13335",
      "AS15169",
      "AS16509",
      "AS14061",
      "AS16276",
      "AS8075",
      "AS396982",
      "AS32934",
      "AS54113",
      "AS62567",
      "AS14618",
      "AS63949",
      "AS31898",
      "AS8100",
      "AS36351",
      "AS20473",
      "AS25820",
      "AS63473",
      "AS62240",
    ];

    const blocked = blockedASNs.some((as) => asn.startsWith(as) || asn.includes(as));
    ipCache.set(ip, { blocked, timestamp: now });
    return blocked;
  } catch {
    ipCache.set(ip, { blocked: false, timestamp: now });
    return false;
  }
}

async function distExists(): Promise<boolean> {
  try {
    return (await Deno.stat(DIST_ROOT)).isDirectory;
  } catch {
    return false;
  }
}

function fallbackResponse(): Response {
  return new Response(
    "<!doctype html><html><head><meta charset=\"utf-8\"><title>Site en cours</title></head><body><h1>Site en cours de preparation</h1></body></html>",
    {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    },
  );
}

Deno.serve(async (req: Request) => {
  const ip = getClientIP(req);

  if (await isBlockedIP(ip)) {
    return new Response(null, {
      status: 302,
      headers: { Location: "https://www.google.com" },
    });
  }

  if (!await distExists()) {
    console.warn("dist/ is missing, serving fallback HTML");
    return fallbackResponse();
  }

  const response = await serveDir(req, {
    fsRoot: DIST_ROOT,
    urlRoot: "",
    showDirListing: false,
    enableCors: true,
  });

  if (response.status !== 404 || req.method !== "GET") {
    return response;
  }

  const accept = req.headers.get("accept") ?? "";
  const pathname = new URL(req.url).pathname;
  if (!accept.includes("text/html") || pathname.includes(".")) {
    return response;
  }

  return serveDir(new Request(new URL("/index.html", req.url), req), {
    fsRoot: DIST_ROOT,
    urlRoot: "",
    showDirListing: false,
    enableCors: true,
  });
});
