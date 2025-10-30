'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { toast } from 'sonner';
import SkuBatchesService from '@/lib/api/sku-batches-service';
import { SkuCreateRequest, SkuUpdateRequest } from '@/lib/api/types';

interface AddSkuFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  mode?: 'add' | 'edit';
  initialData?: Partial<SkuUpdateRequest> & { status?: number };
}

interface SkuFormData {
  skuCode: string;
  productName: string;
  batchNumber: string;
  quantity: number;
  shelf: string;
  expiry: string; // dd/mm/yyyy
  status: number; // 1..4
}

export function AddSkuForm({ onClose, onSuccess, mode = 'add', initialData }: AddSkuFormProps) {
  const initialStatus = (() => {
    const s: any = initialData?.status;
    if (typeof s === 'number') return s || 1;
    if (typeof s === 'string') {
      const map: Record<string, number> = {
        'Active': 1,
        'Expiring Soon': 2,
        'Out of Stock': 3,
        'Low Stock': 4,
      };
      return map[s] || 1;
    }
    return 1;
  })();

  const [formData, setFormData] = useState<SkuFormData>({
    skuCode: (initialData?.sku_code as string) || '',
    productName: (initialData?.product_name as string) || '',
    batchNumber: (initialData?.batch_number as string) || '',
    quantity: (initialData?.quantity as number) || 0,
    shelf: (initialData?.shelf as string) || '',
    expiry: (initialData?.expiry_date as string) || '',
    status: initialStatus,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.skuCode.trim()) {
      newErrors.skuCode = 'SKU Code is required';
    }

    if (!formData.productName.trim()) {
      newErrors.productName = 'Product Name is required';
    }

    if (!formData.batchNumber.trim()) {
      newErrors.batchNumber = 'Batch Number is required';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (!formData.shelf.trim()) {
      newErrors.shelf = 'Shelf is required';
    }

    if (!formData.expiry) {
      newErrors.expiry = 'Expiry date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'edit' && initialData?.sku_batch_id) {
        const payload: SkuUpdateRequest = {
          sku_batch_id: initialData.sku_batch_id,
          sku_code: formData.skuCode,
          product_name: formData.productName,
          batch_number: formData.batchNumber,
          quantity: formData.quantity,
          shelf: formData.shelf,
          expiry_date: formData.expiry,
          status: formData.status,
        };
        const res = await SkuBatchesService.update(payload);
        toast.success(res.message || 'SKU batch updated successfully.');
      } else {
        const payload: SkuCreateRequest = {
          sku_code: formData.skuCode,
          product_name: formData.productName,
          batch_number: formData.batchNumber,
          quantity: formData.quantity,
          shelf: formData.shelf,
          expiry_date: formData.expiry,
          status: formData.status,
        };
        const res = await SkuBatchesService.create(payload);
        toast.success(res.message || 'SKU batch created successfully.');
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error('Failed to add SKU. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof SkuFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const isFormValid = formData.skuCode && formData.productName && formData.batchNumber && 
                     formData.quantity > 0 && formData.shelf && formData.expiry && formData.status;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'edit' ? 'Edit SKU' : 'Add New SKU'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="skuCode">SKU Code *</Label>
              <Input
                id="skuCode"
                placeholder="e.g., MT-001-23"
                value={formData.skuCode}
                onChange={(e) => handleInputChange('skuCode', e.target.value)}
                className={errors.skuCode ? 'border-destructive' : ''}
              />
              {errors.skuCode && (
                <p className="text-sm text-destructive">{errors.skuCode}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                placeholder="e.g., Ground Bison"
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                className={errors.productName ? 'border-destructive' : ''}
              />
              {errors.productName && (
                <p className="text-sm text-destructive">{errors.productName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="batchNumber">Batch Number *</Label>
              <Input
                id="batchNumber"
                placeholder="e.g., B-1001"
                value={formData.batchNumber}
                onChange={(e) => handleInputChange('batchNumber', e.target.value)}
                className={errors.batchNumber ? 'border-destructive' : ''}
              />
              {errors.batchNumber && (
                <p className="text-sm text-destructive">{errors.batchNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                className={errors.quantity ? 'border-destructive' : ''}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">{errors.quantity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shelf">Shelf *</Label>
              <Input
                id="shelf"
                placeholder="e.g., A1-S2"
                value={formData.shelf}
                onChange={(e) => handleInputChange('shelf', e.target.value)}
                className={errors.shelf ? 'border-destructive' : ''}
              />
              {errors.shelf && (
                <p className="text-sm text-destructive">{errors.shelf}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date *</Label>
              <Input
                id="expiry"
                placeholder="dd/mm/yyyy"
                value={formData.expiry}
                onChange={(e) => handleInputChange('expiry', e.target.value)}
                className={errors.expiry ? 'border-destructive' : ''}
              />
              {errors.expiry && (
                <p className="text-sm text-destructive">{errors.expiry}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.status}
                onChange={(e) => handleInputChange('status', parseInt(e.target.value) || 1)}
              >
                <option value={1}>Active</option>
                <option value={2}>Expiring Soon</option>
                <option value={3}>Out of Stock</option>
                <option value={4}>Low Stock</option>
              </select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (mode === 'edit' ? 'Saving...' : 'Adding...') : (mode === 'edit' ? 'Save Changes' : 'Add SKU')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
