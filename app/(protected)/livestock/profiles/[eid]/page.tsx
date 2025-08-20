'use client';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { Container } from '@/components/common/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusChip } from '../../components/status-chip';

export default function AnimalProfilePage() {
  // @ts-ignore next/navigation types
  const params = useParams<{ eid: string }>();
  const eid = params?.eid;
  if (!eid) return notFound();

  const animal = {
    eid_tag: eid,
    status: 'Alive' as const,
    gender: 'Female' as const,
    dob: '2021-09-01',
  };

  return (
    <Container>
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{animal.eid_tag}</h1>
          <StatusChip status={animal.status} />
          <span className="text-muted-foreground">{animal.gender} · {new Date(animal.dob).toLocaleDateString()}</span>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="movement">Movement</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Key Facts</CardTitle>
            </CardHeader>
            <CardContent>
              Coming soon
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Lifecycle Events</CardTitle>
            </CardHeader>
            <CardContent>
              Timeline list (vaccination, illness, movement, death, breeding, misc)
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="movement">
          <Card>
            <CardHeader>
              <CardTitle>Movement History</CardTitle>
            </CardHeader>
            <CardContent>
              Map/list layout
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Health Logs</CardTitle>
            </CardHeader>
            <CardContent>
              Notes + attachments
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
            </CardHeader>
            <CardContent>
              Admin-only logs
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Link href="/livestock/events" className="underline text-primary">Add Event</Link>
      </div>
    </Container>
  );
} 