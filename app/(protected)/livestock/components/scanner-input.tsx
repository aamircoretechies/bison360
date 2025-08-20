'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlugZap, QrCode } from 'lucide-react';

interface ScannerInputProps {
  label?: string;
  value?: string;
  onChange?: (eid: string) => void;
  regex?: RegExp;
}

export function ScannerInput({ label = 'EID Tag', value, onChange, regex }: ScannerInputProps) {
  const [eid, setEid] = useState<string>(value || '');
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setEid(value || '');
  }, [value]);

  const validate = (v: string) => {
    if (regex && !regex.test(v)) {
      setError('Invalid EID format');
    } else {
      setError('');
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          placeholder="Scan or enter EID (e.g., EID-1234)"
          value={eid}
          onChange={(e) => {
            setEid(e.target.value);
            validate(e.target.value);
            onChange?.(e.target.value);
          }}
        />
        <Button variant="outline" type="button" onClick={() => inputRef.current?.focus()}>
          <QrCode /> Scan
        </Button>
        <Button variant="outline" type="button" onClick={() => {}}>
          <PlugZap /> Connect reader
        </Button>
      </div>
      {error && <div className="text-xs text-destructive">{error}</div>}
    </div>
  );
} 