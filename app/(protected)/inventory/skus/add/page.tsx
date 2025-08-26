'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/common/container';
import { AddSkuForm } from '../components';
import { ChevronRight } from 'lucide-react';

export default function AddSkuPage() {
  const router = useRouter();

  const handleClose = () => {
    router.push('/inventory/skus');
  };

  const handleSuccess = () => {
    // Optionally refresh the SKUs list or show success message
    router.push('/inventory/skus');
  };

  return (
    <Container>
      <div className="py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
          <Link href="/inventory/skus" className="hover:text-foreground">
            SKUs
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Add New</span>
        </nav>
        
        <AddSkuForm onClose={handleClose} onSuccess={handleSuccess} />
      </div>
    </Container>
  );
}
