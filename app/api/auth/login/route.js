import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_ALLOWED_DOMAIN = (
  process.env.GOOGLE_ALLOWED_DOMAIN ||
  process.env.NEXT_PUBLIC_GOOGLE_ALLOWED_DOMAIN ||
  ""
)
  .trim()
  .toLowerCase()
  .replace(/^@/, "");
const ALLOWED_GOOGLE_EMAILS = (process.env.GOOGLE_ALLOWED_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export async function POST(req) {
  let credential = "";

  try {
    const body = await req.json();
    credential = body?.credential || "";
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    );
  }

  try {
    if (!SECRET_KEY) {
      return NextResponse.json(
        { message: "JWT secret is not configured." },
        { status: 500 }
      );
    }

    if (!GOOGLE_CLIENT_ID) {
      return NextResponse.json(
        { message: "Google OAuth client ID is not configured." },
        { status: 500 }
      );
    }

    if (!GOOGLE_ALLOWED_DOMAIN && ALLOWED_GOOGLE_EMAILS.length === 0) {
      return NextResponse.json(
        {
          message:
            "Google organization domain or email allowlist is not configured.",
        },
        { status: 500 }
      );
    }

    if (!credential) {
      return NextResponse.json(
        { message: "Google credential is required." },
        { status: 400 }
      );
    }

    const tokenInfoRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(
        credential
      )}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!tokenInfoRes.ok) {
      return NextResponse.json(
        { message: "Invalid Google credential." },
        { status: 401 }
      );
    }

    const tokenInfo = await tokenInfoRes.json();
    const userEmail = (tokenInfo?.email || "").toLowerCase();
    const audience = tokenInfo?.aud;
    const hostedDomain = (tokenInfo?.hd || "").toLowerCase();
    const isEmailVerified = tokenInfo?.email_verified === "true";

    if (audience !== GOOGLE_CLIENT_ID || !isEmailVerified || !userEmail) {
      return NextResponse.json(
        { message: "Google token validation failed." },
        { status: 401 }
      );
    }

    const isAllowedDomain = GOOGLE_ALLOWED_DOMAIN
      ? userEmail.endsWith(`@${GOOGLE_ALLOWED_DOMAIN}`)
      : true;

    const isAllowedHostedDomain =
      GOOGLE_ALLOWED_DOMAIN && hostedDomain
        ? hostedDomain === GOOGLE_ALLOWED_DOMAIN
        : true;

    const isAllowedEmail = ALLOWED_GOOGLE_EMAILS.length
      ? ALLOWED_GOOGLE_EMAILS.includes(userEmail)
      : true;

    if (!isAllowedDomain || !isAllowedHostedDomain || !isAllowedEmail) {
      return NextResponse.json(
        {
          message: "Only organization Google accounts are authorized.",
        },
        { status: 403 }
      );
    }

    const token = jwt.sign(
      {
        email: userEmail,
        name: tokenInfo?.name || "Editorial Admin",
        provider: "google",
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      { message: "Login successful", token },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error:", e);
    return NextResponse.json(
      { message: "Internal Server Error! Please try again later." },
      { status: 500 }
    );
  }
}
