'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/common/container';
import { AddStockForm } from '../components';
import { ChevronRight } from 'lucide-react';

export default function AddStockPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClose = () => {
    router.push('/inventory/stocks');
  };

  const handleSuccess = () => {
    // Optionally refresh the stocks list or show success message
    router.push('/inventory/stocks');
  };

  const mode = (searchParams.get('mode') as 'edit' | 'add') || 'add';
  let initialData = undefined as any;
  const dataParam = searchParams.get('data');
  if (dataParam) {
    try {
      initialData = JSON.parse(decodeURIComponent(dataParam));
    } catch {}
  }

  return (
    <Container>
      <div className="py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
          <Link href="/inventory/stocks" className="hover:text-foreground">
            Stocks
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Add New</span>
        </nav>
        
        <AddStockForm onClose={handleClose} onSuccess={handleSuccess} mode={mode} initialData={initialData} />
      </div>
    </Container>
  );
}
