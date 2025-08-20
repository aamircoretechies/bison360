'use client';

import Link from 'next/link';
import { Container } from '@/components/common/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function KpiTile({ title, value, href }: { title: string; value: number; href: string }) {
  return (
    <Card className="hover:shadow-md transition">
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between">
        <div className="text-3xl font-semibold">{value}</div>
        <Button size="sm" variant="outline" asChild>
          <Link href={href}>View</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function LivestockDashboardPage() {
  const totals = { total: 120, alive: 110, sick: 6, deceased: 2, moved: 2 };
  const pendingSync = 3;

  return (
    <Container>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <KpiTile title="Total Headcount" value={totals.total} href="/livestock/profiles" />
        <KpiTile title="Alive" value={totals.alive} href="/livestock/profiles?status=Alive" />
        <KpiTile title="Sick" value={totals.sick} href="/livestock/profiles?status=Sick" />
        <KpiTile title="Deceased" value={totals.deceased} href="/livestock/profiles?status=Deceased" />
        <KpiTile title="Moved" value={totals.moved} href="/livestock/profiles?status=Moved" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Sync</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>{pendingSync} items waiting</div>
          <Button asChild>
            <Link href="/livestock/profiles">Sync now</Link>
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
} 