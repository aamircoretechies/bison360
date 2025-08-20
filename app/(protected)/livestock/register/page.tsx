'use client';

import { useState } from 'react';
import { Container } from '@/components/common/container';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScannerInput } from '../components/scanner-input';
import { EID_REGEX } from '../schemas';

export default function RegisterTagPage() {
  const [eid, setEid] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Unknown'>('Unknown');
  const [health, setHealth] = useState('');

  const canSave = EID_REGEX.test(eid) && !!dob && !!gender;

  return (
    <Container>
      <Card>
        <CardHeader>
          <CardTitle>New Tag Assignment (Chute Mode)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <ScannerInput value={eid} onChange={setEid} regex={EID_REGEX} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>DOB</Label>
              <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
            <div>
              <Label>Gender</Label>
              <select className="reui-input" value={gender} onChange={(e) => setGender(e.target.value as any)}>
                <option value="Unknown">Unknown</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <Label>Starting Health Note (optional)</Label>
              <Input value={health} onChange={(e) => setHealth(e.target.value)} placeholder="Notes" />
            </div>
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