'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScreenLoader } from '@/components/common/screen-loader';
import { Demo1Layout } from '../components/layouts/demo1/layout';
import LoginService from '@/lib/api/login-service';
import SharedPreferences from '@/lib/shared-preferences';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is logged in using shared preferences
    const isLoggedIn = SharedPreferences.isAuthenticated();
    setIsAuthenticated(isLoggedIn);
    
    if (!isLoggedIn) {
      router.push('/signin');
    }
  }, [router]);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return <ScreenLoader />;
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render the protected content
  return <Demo1Layout>{children}</Demo1Layout>;
}
