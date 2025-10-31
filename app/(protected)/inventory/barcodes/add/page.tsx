'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/common/container';
import { AddBarcodeForm } from '../components';
import { ChevronRight } from 'lucide-react';

export default function AddBarcodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'add'; // 'add' or 'edit'
  const dataParam = searchParams.get('data');
  const initialData = dataParam ? JSON.parse(decodeURIComponent(dataParam)) : undefined;

  const handleClose = () => {
    router.push('/inventory/barcodes');
  };

  const handleSuccess = () => {
    router.push('/inventory/barcodes');
  };

  return (
    <Container>
      <div className="py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
          <Link href="/inventory/barcodes" className="hover:text-foreground">
            Barcodes
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{mode === 'edit' ? 'Edit Barcode' : 'Add New'}</span>
        </nav>
        
        <AddBarcodeForm 
          onClose={handleClose} 
          onSuccess={handleSuccess} 
          mode={mode as 'add' | 'edit'}
          initialData={initialData}
        />
      </div>
    </Container>
  );
}
