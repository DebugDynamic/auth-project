import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/pool";


async function sendMagicLink(email: string) {
    try {
        const response = await fetch("/api/auth/magiclink", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            return true;
        } else {
            console.error("Error sending magic link:", response.statusText);
            return response.statusText;
        }
    } catch (error) {
        console.error("Error in sending magic link:", error);
        return (error as Error).message;
    }
}

export function GET() {
    return NextResponse.json({ message:"This is a GET request!" }, { status: 200 });
}

export async function POST(req: NextRequest) {
    const { firstName, lastName, email } = await req.json();

    // Check for missing parameters
    if (!firstName || !email) {
        return NextResponse.json({ error: "params_missing", message: "You must submit your first name & email" }, { status: 400 });
    }

    try {
        let signupQuery;

        if (!lastName) {
            // Perform query for inserting without last name
            signupQuery = await pool.query(
                "INSERT INTO users (firstname, email) VALUES ($1, $2)", [firstName, email]
            );
        } else {
            // Perform query for inserting with last name
            signupQuery = await pool.query(
                "INSERT INTO users (firstname, lastname, email) VALUES ($1, $2, $3)", [firstName, lastName, email]
            );
        }
        
        if (!signupQuery || !signupQuery.rowCount) {
            return NextResponse.json({ error: "sql_fail", message: "An error occured on our end! We are sorry!" }, { status: 500 });
        }

        // Check if query was successful
        if (signupQuery.rowCount > 0) {
            // Send magic link if query was successful
            const magicLinkSent = await sendMagicLink(email);

            if (magicLinkSent) {
                return NextResponse.json({ success: true, magiclink: true }, { status: 200 });
            } else {
                return NextResponse.json({ error: "magiclink_failed", message: "Failed to send magic link" }, { status: 500 });
            }
        } else {
            return NextResponse.json({ error: "signup_failed", message: "Signup failed" }, { status: 500 });
        }
    } catch (error) {
        console.error("Error during signup process:", error);
        return NextResponse.json({ error: "internal_error", message: (error as Error).message }, { status: 500 });
    }
}
