'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MoveLeft, UserPen } from 'lucide-react';
import { UserData } from '@/lib/api/types';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Container } from '@/components/common/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from '@/components/common/toolbar';
import { UserProvider } from './components/user-context';
import UserHero from './components/user-hero';

type NavRoutes = Record<
  string,
  {
    title: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    path: string;
  }
>;

export default function UserLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  // 1) Unwrap the params Promise
  const { id } = use(params);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Use local state to control active tab
  const [activeTab, setActiveTab] = useState<string>('');
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Define your nav routes
  const navRoutes = useMemo<NavRoutes>(
    () => ({
      general: {
        title: 'Profile',
        icon: UserPen,
        path: `/user-management/users/${id}`,
      },
      // Commented out Activity Logs as it's currently not working
      // logs: {
      //   title: 'Activity Logs',
      //   icon: Activity,
      //   path: `/user-management/users/${id}/logs`,
      // },
    }),
    [id],
  );

  // Set initial active tab based on the pathname
  useEffect(() => {
    const found = Object.keys(navRoutes).find(
      (key) => pathname === navRoutes[key].path,
    );
    if (found) {
      setActiveTab(found);
    } else {
      setActiveTab('general');
    }
  }, [navRoutes, pathname]);

  // Get user data from URL parameters
  useEffect(() => {
    const userDataParam = searchParams.get('data');
    if (userDataParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataParam));
        setUser(userData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // If data parsing fails, redirect back to users list
        router.push('/user-management/users');
      }
    } else {
      // If no data parameter, redirect back to users list
      router.push('/user-management/users');
    }
  }, [searchParams, router]);

  // Handler for tab click: instantly update active tab then navigate.
  const handleTabClick = (key: string, path: string) => {
    setActiveTab(key);
    // Optionally, you can prefetch or delay navigation slightly if needed
    router.push(path);
  };

  return (
    <UserProvider user={user} isLoading={isLoading}>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarTitle>User</ToolbarTitle>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>User Management</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/user/users">Users</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </ToolbarHeading>
          <ToolbarActions>
            <Button asChild variant="outline">
              <Link href="/user-management/users">
                <MoveLeft /> Back to users
              </Link>
            </Button>
          </ToolbarActions>
        </Toolbar>
        <UserHero user={user} isLoading={isLoading} />
        <Tabs defaultValue={activeTab} value={activeTab}>
          <TabsList variant="line" className="mb-5">
            {Object.entries(navRoutes).map(
              ([key, { title, icon: Icon, path }]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  disabled={isLoading}
                  onClick={() => handleTabClick(key, path)}
                >
                  <Icon />
                  <span>{title}</span>
                </TabsTrigger>
              ),
            )}
          </TabsList>
        </Tabs>
        {children}
      </Container>
    </UserProvider>
  );
}
