"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const REDIRECT_URI = "http://localhost:3000/callback"; // Ensure this matches the callback route in Spotify app settings
const SCOPES = "user-read-private user-read-email user-library-read";

const SpotifyAuth = () => {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", SPOTIFY_CLIENT_ID);
    params.append("response_type", "code");
    params.append("redirect_uri", REDIRECT_URI); // Make sure this matches your Spotify app's redirect URI
    params.append("scope", SCOPES);
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    // Redirect to Spotify login page
    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  };

  const generateCodeVerifier = (length: number) => {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
      .map((x) => possible.charAt(x % possible.length))
      .join("");
  };

  const generateCodeChallenge = async (verifier: string) => {
    const data = new TextEncoder().encode(verifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };

  return (
    <div>
      <button onClick={handleLogin}>
        Log in with Spotify
      </button>
    </div>
  );
};

export default SpotifyAuth;
