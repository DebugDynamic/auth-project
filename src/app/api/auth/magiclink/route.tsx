import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/pool";
const argon2 = require('argon2');
import crypto from "crypto";
import exp from "constants";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Define Functions & Variables
  async function argon2Hash(password: string) {
      return await argon2.hash(password, { type: argon2.argon2id });
  }
  async function argon2Verify(password: string, hash: string) {
      return await argon2.verify(hash, password);
  }
  function sha256Hash(data: string) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  function getExpiration(hours: number) {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + hours);
    const expiration = expirationDate.getTime();    
    return expiration;
  }

  const deviceFingerprint = auth.getFingerprint(request);
  const app_secret = process.env.APP_SECRET;
  if (!app_secret) {
    return NextResponse.json({ error: "Something went wrong! (Error -1)" }, { status: 500 });
  }

  // Actual Code
  try {
    const { email } = await request.json();
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Generate Authentication URL
    const rawUserDetails = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    const userDetails = rawUserDetails.rows[0]
    const securityToken = sha256Hash(userDetails.security_token + app_secret);
    const expires = getExpiration(1);
    const emailToken = await argon2Hash(securityToken + deviceFingerprint + expires + "emailToken")

    const URLdata = email + "/" + expires + "/" + emailToken;
    // Convert to Base64
    const b64URLdata = Buffer.from(URLdata).toString('base64');
    const loginLink = process.env.NEXT_PUBLIC_URL + "/email/confirm#" + b64URLdata;

    return NextResponse.json({ message: "Magic link sent", loginLink }, { status: 200 });

  } catch (error: any) {
    console.error("Email send error:", error);

    return NextResponse.json({ 
        error: "Failed to send email", 
        details: error instanceof Error ? error.message + "/" + JSON.stringify(error, null, 2) : JSON.stringify(error, null, 2) 
    }, { status: 500 });
  }
}
