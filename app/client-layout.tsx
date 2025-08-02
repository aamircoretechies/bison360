"use client";

import { ReactNode, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { SettingsProvider } from "@/providers/settings-provider";
import { TooltipsProvider } from "@/providers/tooltips-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { I18nProvider } from "@/providers/i18n-provider";
import { ModulesProvider } from "@/providers/modules-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Session } from "next-auth";

export default function ClientLayout({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return (
    <QueryProvider>
      <AuthProvider session={session}>
        <SettingsProvider>
          <ThemeProvider>
            <I18nProvider>
              <TooltipsProvider>
                <ModulesProvider>
                  <Suspense fallback={<div>Loading...</div>}>
                    {children}
                  </Suspense>
                  <Toaster />
                </ModulesProvider>
              </TooltipsProvider>
            </I18nProvider>
          </ThemeProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
