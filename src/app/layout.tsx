import React from "react";
import { AuthProvider } from "./context/AuthContext";
import "../../styles/globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <title>Echo</title>
        </head>
        <body>{children}</body>
      </html>
    </AuthProvider>
  );
}
