"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const [status, setStatus] = useState("Processing...");

    useEffect(() => {
        const base64value = window.location.hash.substring(1); // Remove '#' from the hash
        if (!base64value) return setStatus("Fail"); // Handle missing hash

        try {
            const decoded = atob(base64value);
            const parts = decoded.split("/");
            
            if (parts.length < 3) return setStatus("Fail");
            
            const email = parts[0];
            const expiration = parts[1];
            const token = parts.slice(2).join("/"); // Ensures the full token is captured

            // Ensure all values exist
            if (!email || !expiration || !token) {
                return setStatus("Fail");
            }

            fetch("/api/auth/callback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, expiration, token }),
            })
                .then((res) => setStatus(res.status === 200 ? "Success" : "Fail"))
                .catch(() => setStatus("Fail"));
        } catch {
            setStatus("Fail"); // Handle invalid Base64
        }
    }, []);

    useEffect(() => {
        if (status.toLocaleLowerCase() == "success") {
            router.push("/");
        }
    }, [status]);

    return <p>{status}</p>;
}
