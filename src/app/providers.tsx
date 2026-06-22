// FILE: src/app/providers.tsx
"use client";

import { QueryProvider } from "@/lib/providers/QueryProvider";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { CreditsProvider } from "@/lib/contexts/CreditsContext";
import { NotificationProvider } from "@/lib/contexts/NotificationContext";
import { AnalyticsProvider } from "@/lib/analytics/AnalyticsProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <CreditsProvider>
          <NotificationProvider>
            <AnalyticsProvider>{children}</AnalyticsProvider>
          </NotificationProvider>
        </CreditsProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
