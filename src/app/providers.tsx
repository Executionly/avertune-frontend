// FILE: src/app/providers.tsx
"use client";

import { QueryProvider } from "@/lib/providers/QueryProvider";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { CreditsProvider } from "@/lib/contexts/CreditsContext";
import { NotificationProvider } from "@/lib/contexts/NotificationContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <CreditsProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </CreditsProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
