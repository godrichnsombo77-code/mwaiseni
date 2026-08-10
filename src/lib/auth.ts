import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "mwaiseni_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

type Role = "super_admin" | "editor";

type Session = {
  role: Role;
  exp: number;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be set and contain at least 32 characters");
  }
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function encode(session: Session) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decode(token: string): Session | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session;
    if (!session.role || !session.exp || session.exp < Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch {
    return null;
  }
}

export async function createSession(role: Role) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const token = encode({ role, exp });
  const store = await cookies();

  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  return { role };
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return decode(token);
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
