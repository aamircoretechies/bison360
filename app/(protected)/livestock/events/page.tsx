'use client';

import { useMemo, useState } from 'react';
import { Container } from '@/components/common/container';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScannerInput } from '../components/scanner-input';
import { EID_REGEX, LifecycleEventType } from '../schemas';

export default function LivestockEventsPage() {
  const [eid, setEid] = useState('');
  const [type, setType] = useState<LifecycleEventType>('Vaccination');
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [vaccine, setVaccine] = useState('');
  const [to, setTo] = useState('');
  const [health, setHealth] = useState('');

  const requiresHealth = type === 'Illness' || type === 'Death';
  const canSave = EID_REGEX.test(eid) && !!date && (!requiresHealth || !!health);

  const dynamicFields = useMemo(() => {
    switch (type) {
      case 'Vaccination':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Vaccine</Label>
              <Input value={vaccine} onChange={(e) => setVaccine(e.target.value)} />
            </div>
          </div>
        );
      case 'Movement':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Destination</Label>
              <Input value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
        );
      case 'Illness':
      case 'Death':
        return (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>Health Notes</Label>
              <Input value={health} onChange={(e) => setHealth(e.target.value)} placeholder="Required" />
            </div>
          </div>
        );
      default:
        return null;
    }
  }, [type, vaccine, to, health]);

  return (
    <Container>
      <Card>
        <CardHeader>
          <CardTitle>Add Lifecycle Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <ScannerInput value={eid} onChange={setEid} regex={EID_REGEX} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Event Type</Label>
              <select className="reui-input" value={type} onChange={(e) => setType(e.target.value as LifecycleEventType)}>
                <option>Vaccination</option>
                <option>Illness</option>
                <option>Breeding</option>
                <option>Movement</option>
                <option>Death</option>
                <option>Misc</option>
              </select>
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>
          {dynamicFields}
          <div>
            <Label>Notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button variant="primary" disabled={!canSave}>Save</Button>
        </CardFooter>
      </Card>
    </Container>
  );
} 