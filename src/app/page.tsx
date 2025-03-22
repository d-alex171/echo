"use client"

import React from "react";
import type { AppProps } from "next/app";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Assuming your context is set up
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function App({ Component, pageProps }: AppProps){
  const { isLoggedIn, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      // Redirect to login if not logged in
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {profile?.display_name}!</h1>
      {profile?.images[0] && (
        <img src={profile.images[0].url} alt="Profile" width={200} height={200} />
      )}
      <p>Email: {profile?.email}</p>
      <a href={profile?.external_urls.spotify}>Spotify Profile</a>
    </div>
  );
}
