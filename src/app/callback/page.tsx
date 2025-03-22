// pages/callback.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const CallbackPage = () => {
  const { login } = useAuth();
  const router = useRouter(); // For navigation
  const searchParams = useSearchParams(); // Access search params
  
  const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
  const REDIRECT_URI = 'http://localhost:3000/callback';

  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      exchangeCodeForToken(code);
    }
  }, [searchParams]);

  const exchangeCodeForToken = async (code: string) => {
    try {
      const verifier = localStorage.getItem("verifier")!;
      const params = new URLSearchParams();

      if (SPOTIFY_CLIENT_ID) {
        params.append("client_id", SPOTIFY_CLIENT_ID);
      }

      params.append("grant_type", "authorization_code");
      params.append("code", code);
      params.append("redirect_uri", REDIRECT_URI);
      params.append("code_verifier", verifier);

      const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      });

      const data = await result.json();
      const accessToken = data.access_token;

      if (accessToken) {
        const profileResponse = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const profile = await profileResponse.json();

        // Use the login function to store the user's profile and token
        login(profile, accessToken);

        // Redirect to home page after successful login using next/navigation's router.push
        router.push("/"); // Use push method from next/navigation
      } else {
        console.error("No access token received");
      }
    } catch (error) {
      console.error("Error exchanging code for token", error);
    }
  };

  return <div>Loading...</div>; // You can customize this UI
};

export default CallbackPage;
