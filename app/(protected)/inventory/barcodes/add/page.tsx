'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/common/container';
import { AddBarcodeForm } from '../components';
import { ChevronRight } from 'lucide-react';

export default function AddBarcodePage() {
  const router = useRouter();

  const handleClose = () => {
    router.push('/inventory/barcodes');
  };

  const handleSuccess = () => {
    // Optionally refresh the barcodes list or show success message
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
          <span className="text-foreground">Add New</span>
        </nav>
        
        <AddBarcodeForm onClose={handleClose} onSuccess={handleSuccess} />
      </div>
    </Container>
  );
}
