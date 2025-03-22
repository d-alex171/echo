// pages/callback.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { SP } from "next/dist/shared/lib/utils";

const CallbackPage = () => {
  const router = useRouter();
  const { login } = useAuth();

  const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI='http://localhost:3000'

  useEffect(() => {
    const { code } = router.query;
    if (code) {
      exchangeCodeForToken(code as string);
    }
  }, [router.query]);

  const exchangeCodeForToken = async (code: string) => {
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

    const profileResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profile = await profileResponse.json();

    // Use the login function to store the user's profile and token
    login(profile, accessToken);
    router.push("/"); // Redirect to the home page after login
  };

  return <div>Loading...</div>;
};

export default CallbackPage;
