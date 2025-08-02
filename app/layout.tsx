/* import { ReactNode, Suspense } from 'react';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { SettingsProvider } from '@/providers/settings-provider';
import { TooltipsProvider } from '@/providers/tooltips-provider';
import { Toaster } from '@/components/ui/sonner';
import '@/css/styles.css';
import '@/components/keenicons/assets/styles.css';
import { Metadata } from 'next';
import { AuthProvider } from '@/providers/auth-provider';
import { I18nProvider } from '@/providers/i18n-provider';
import { ModulesProvider } from '@/providers/modules-provider';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';

const inter = Inter({ subsets: ['latin'], display: "swap", });

export const metadata: Metadata = {
  title: {
    template: '%s | Bison360',
    default: 'Bison360', // a default is required when creating a template
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html className="h-full" suppressHydrationWarning>
      <body
        className={cn(
          'antialiased flex h-full text-base text-foreground bg-background',
          inter.className,
        )}
      >
        <QueryProvider>
          <AuthProvider>
            <SettingsProvider>
              <ThemeProvider>
                <I18nProvider>
                  <TooltipsProvider>
                    <ModulesProvider>
                      <Suspense>{children}</Suspense>
                      <Toaster />
                    </ModulesProvider>
                  </TooltipsProvider>
                </I18nProvider>
              </ThemeProvider>
            </SettingsProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
 */

// app/layout.tsx
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "@/css/styles.css";
import "@/components/keenicons/assets/styles.css";
import { Metadata } from "next";

import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { SettingsProvider } from "@/providers/settings-provider";
import { I18nProvider } from "@/providers/i18n-provider";
import { ModulesProvider } from "@/providers/modules-provider";
import { QueryProvider } from "@/providers/query-provider";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    template: "%s | Bison360",
    default: "Bison360",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={cn(
          "antialiased flex h-full text-base text-foreground bg-background",
          inter.className
        )}

        suppressHydrationWarning
      >
        <QueryProvider>
          <AuthProvider>
            <SettingsProvider>
              <ThemeProvider>
                <I18nProvider>
                  <ModulesProvider>
                    {children}
                  </ModulesProvider>
                </I18nProvider>
              </ThemeProvider>
            </SettingsProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

