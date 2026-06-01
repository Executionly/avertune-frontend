"use client";

import { QueryProvider } from "@/lib/providers/QueryProvider";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { CreditsProvider } from "@/lib/contexts/CreditsContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <CreditsProvider>{children}</CreditsProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
