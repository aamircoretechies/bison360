'use client';

import { useState } from 'react';
import { Container } from '@/components/common/container';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LivestockReportsPage() {
  const [type, setType] = useState('Events');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const canGenerate = !!type && !!from && !!to;

  return (
    <Container>
      <Card>
        <CardHeader>
          <CardTitle>Livestock Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Type</Label>
              <select className="reui-input" value={type} onChange={(e) => setType(e.target.value)}>
                <option>Events</option>
                <option>Health</option>
                <option>Movement</option>
              </select>
            </div>
            <div>
              <Label>From</Label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div>
              <Label>To</Label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="outline" disabled={!canGenerate}>Generate CSV</Button>
          <Button variant="outline" disabled={!canGenerate}>Generate PDF</Button>
          <Button variant="primary" disabled={!canGenerate}>Generate JSON</Button>
        </CardFooter>
      </Card>
    </Container>
  );
} 