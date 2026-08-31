// A minimal signed-session scheme for a single admin (you). No user
// accounts, no database table for sessions — just a cookie value that's
// an expiry timestamp plus an HMAC signature, so it can't be forged
// without knowing ADMIN_SESSION_SECRET.
//
// Uses the Web Crypto API (not Node's `crypto` module) because this
// code runs inside Next.js middleware, which executes in the Edge
// Runtime — Node's `crypto` module isn't supported there, but
// globalThis.crypto.subtle is available in both Edge and Node 18+.

const COOKIE_NAME = "blume_admin_session";
const SESSION_LENGTH_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "Missing ADMIN_SESSION_SECRET. Add a long random string to .env.local — see .env.example."
    );
  }
  return secret;
}

async function getHmacKey() {
  const keyData = new TextEncoder().encode(getSecret());
  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function bufferToHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken() {
  const expiresAt = Date.now() + SESSION_LENGTH_MS;
  const key = await getHmacKey();
  const signatureBuf = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(String(expiresAt))
  );
  return `${expiresAt}.${bufferToHex(signatureBuf)}`;
}

export async function isValidSessionToken(token: string | undefined | null) {
  if (!token) return false;
  const [expiresAtRaw, signature] = token.split(".");
  if (!expiresAtRaw || !signature) return false;
  if (Number(expiresAtRaw) <= Date.now()) return false;

  try {
    const key = await getHmacKey();
    const signatureBytes = new Uint8Array(
      signature.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    );
    return crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      new TextEncoder().encode(expiresAtRaw)
    );
  } catch {
    return false;
  }
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
