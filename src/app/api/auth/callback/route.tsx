import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/pool"
const argon2 = require('argon2');
import crypto from "crypto";
import exp from "constants";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const app_secret = process.env.APP_SECRET;
  if (!app_secret) {
    return NextResponse.json({ error: "Something went wrong! (Error -1)" }, { status: 500 });
  }
  // Define Functions
  async function argon2Hash(password: string) {
      return await argon2.hash(password, { type: argon2.argon2id });
  }
  async function argon2Verify(password: string, hash: string) {
      return await argon2.verify(hash, password);
  }
  function sha256Hash(data: string) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  function isNotExpired(timestamp: string) {
    return parseInt(timestamp) > Date.now();
  }

  function getExpiration(hours: number) {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + hours);
    const expiration = expirationDate.getTime();    
    return expiration;
  }

  const deviceFingerprint = auth.getFingerprint(req);
  const { email, expiration, token } = await req.json();

  if (!email || !expiration || !token) {
    return NextResponse.json({ error: "Email, expiration or token missing!" }, { status: 400 });
  }
  if (!isNotExpired(expiration)) {
    return NextResponse.json({ error: "Token is expired" }, { status: 401 });
  }
  const rawUserDetails = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  if (rawUserDetails.rowCount == 0) {
    return NextResponse.json({ error: "Error during token validation! (no results)" }, { status: 401 });
  }
  const userDetails = rawUserDetails.rows[0]
  // Verify the token
  const securityToken = sha256Hash(userDetails.security_token + app_secret);
  const isValidToken = await argon2Verify(securityToken + deviceFingerprint + expiration + "emailToken", token)
  if (isValidToken) {
    // Generating Session Token
    const sessionExpires = getExpiration(720);
    const hashToken = await argon2Hash(securityToken + deviceFingerprint + sessionExpires);
    const sessionTokenRaw = userDetails.id + "/" + sessionExpires + "/" + hashToken;
    const sessionToken = Buffer.from(sessionTokenRaw).toString('base64');
        // Create HTTP-only cookie
    const response = NextResponse.json({ message: 'Session created' }, { status: 200 });

        // Set cookie with HttpOnly, Secure, SameSite attributes
        response.cookies.set('session_token', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Ensure secure in production
            maxAge: 60 * 60 * 24 * 30,  // 30 days expiration
            sameSite: 'strict',  // Optional, adjust based on your needs
        });
    
        return response;
  } else {
    return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
  }
}
  