import { Badge } from '@/components/ui/badge';

export function StatusChip({ status }: { status: 'Alive' | 'Sick' | 'Moved' | 'Deceased' }) {
  const variant =
    status === 'Alive'
      ? 'success'
      : status === 'Sick'
      ? 'warning'
      : status === 'Moved'
      ? 'info'
      : 'destructive';

  return (
    <Badge variant={variant} size="sm">
      {status}
    </Badge>
  );
} 