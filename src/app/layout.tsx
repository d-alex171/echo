import React from "react";
import { AuthProvider } from "./context/AuthContext";


export default function Layout ({ children,}: {children: React.ReactNode }) {
    return (
    <AuthProvider>
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
    </AuthProvider>
  );
};

