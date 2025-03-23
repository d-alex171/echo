"use client";

import React from "react";
import type { AppProps } from "next/app";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Assuming your context is set up
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "./components/header";
import TracksPage from "./components/tracksShelf";
import styles from "./home.module.css";

export default function App({ Component, pageProps }: AppProps) {
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
    <div className={styles["main"]}>
      <div className={styles["header"]}>
        <Header
          img_url={profile.images[0] && profile.images[0].url}
          name={profile?.display_name}
        />
      </div>
      <div className={styles["songShelf"]}>
        <TracksPage></TracksPage>
      </div>
    </div>
  );
}
