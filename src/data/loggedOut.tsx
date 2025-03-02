"use client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import supabase from "@/data/supabase"; // Importing the Supabase client

export default function OnlyLoggedOut() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isRedirecting) return;

    const checkSession = async () => {
      try {
        // Fetch user session info using Supabase client
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          // If an error occurs, treat it as no user logged in
          console.log("User is not logged in.");
          return;
        }

        if (user) {
          // If user is logged in, show success toast and redirect
          toast.success("Successfully logged in! Redirecting...");
          setIsRedirecting(true);
          window.location.href = "/"; // Redirect to the home page or desired route
        }
      } catch {
        // Do nothing for other unexpected issues
        console.log("An unexpected error occurred.");
      }
    };

    checkSession();
  }, [isRedirecting]);

  return (
    <div>
      {isRedirecting ? <p>Automatically logging you in...</p> : null}
    </div>
  );
}
