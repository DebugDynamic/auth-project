import { NextRequest } from "next/server";
import { pool } from "@/lib/pool";
const argon2 = require('argon2');
import crypto from "crypto";

// Device Fingerprinting
export namespace auth {
    export function getFingerprint(req: NextRequest): string {
        const userAgent = req.headers.get("user-agent") || "unknown";
        const language = req.headers.get("accept-language") || "unknown";
        const fingerprint = crypto.createHash("sha256")
            .update(userAgent + language)
            .digest("hex");
        return fingerprint;
    }

    export interface getUserInterface {
        id: string;
        email: string;
        firstname: string;
        lastname?: string;
        status: string;
        created_on: Date;
    }

    export async function getUser(request: NextRequest): Promise<{ success: boolean, error?: string, data?: getUserInterface }> {
        const app_secret = process.env.APP_SECRET;
        if (!app_secret) {
            return { success: false, error: "App secret unavailable!" };
        }
        async function argon2Verify(password: string, hash: string): Promise<boolean> {
            return await argon2.verify(hash, password);
        }
        function sha256Hash(data: string): string {
            return crypto.createHash('sha256').update(data).digest('hex');
        }
        function isNotExpired(timestamp: string): boolean {
            return parseInt(timestamp) > Date.now();
        }
        const deviceFingerprint = getFingerprint(request); // Using the fingerprint function from auth.
        const base64value = request.cookies.get("session_token")?.value;
        if (!base64value) return { success: false, error: "Token Invalid (1)" }; // Handle missing session token

        try {
            const decoded = Buffer.from(base64value, "base64").toString("utf-8");
            const parts = decoded.split("/");

            if (parts.length < 3) return { success: false, error: "Token Invalid (2)" };

            const userId = parts[0];
            const expiration = parts[1];
            const token = parts.slice(2).join("/"); // Ensures the full token is captured

            if (!isNotExpired(expiration)) {
                return { success: false, error: "Token expired" };
            }
            const rawUserDetails = await pool.query(
                "SELECT * FROM users WHERE id = $1",
                [userId]
            );
            if (rawUserDetails.rowCount == 0) {
                return { success: false, error: "No user found!" };
            }
            const userDetails = rawUserDetails.rows[0];
            // Verify the token
            const securityToken = sha256Hash(userDetails.security_token + app_secret);
            const isValidToken = await argon2Verify(securityToken + deviceFingerprint + expiration, token);
            if (isValidToken) {
                const clientData = await pool.query(
                    "SELECT id, email, firstname, lastname, status, created_on FROM users WHERE id = $1",
                    [userId]
                );
                if (clientData.rowCount == 0) {
                    return { success: false, error: "No user found!" };
                }
                const finalClientData = clientData.rows[0];
                return { success: true, data: finalClientData };
            } else {
                return { success: false, error: "Token invalid" };
            }

        } catch (error) {
            return { success: false, error: "Token Decoding Failed" }; // Handle decoding errors
        }
    }

    export function isCookieSet(request: NextRequest): boolean {
        const base64value = request.cookies.get("session_token")?.value;
        if (!base64value) return false; // Handle missing session token
        return true;
    }
}
