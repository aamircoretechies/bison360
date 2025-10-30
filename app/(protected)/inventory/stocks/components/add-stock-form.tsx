'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { toast } from 'sonner';
import StockLevelService from '@/lib/api/stock-level-service';
import { StockCreateRequest, StockUpdateRequest } from '@/lib/api/types';
import { useQueryClient } from '@tanstack/react-query';

interface AddStockFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  mode?: 'add' | 'edit';
  initialData?: Partial<StockUpdateRequest> & { status?: number };
}

interface StockFormData {
  skuCode: string;
  productName: string;
  batchNumber: string;
  quantity: number;
  location: string;
  expiry: string;
  status: number; // 1..4
}

export function AddStockForm({ onClose, onSuccess, mode = 'add', initialData }: AddStockFormProps) {
  const queryClient = useQueryClient();
  const initStatus = (() => {
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

  const [formData, setFormData] = useState<StockFormData>({
    skuCode: (initialData?.sku_code as string) || '',
    productName: (initialData?.product_name as string) || '',
    batchNumber: (initialData?.batch_number as string) || '',
    quantity: (initialData?.quantity as number) || 0,
    location: (initialData?.location as string) || '',
    expiry: (initialData?.expiry_date as string) || '',
    status: initStatus,
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

    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
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
      if (mode === 'edit' && initialData?.stock_level_id) {
        const payload: StockUpdateRequest = {
          stock_level_id: initialData.stock_level_id,
          sku_code: formData.skuCode,
          product_name: formData.productName,
          batch_number: formData.batchNumber,
          quantity: formData.quantity,
          location: formData.location,
          expiry_date: formData.expiry,
          status: formData.status,
        };
        const res = await StockLevelService.update(payload);
        if (res.status === 0) {
          alert(res.message || 'Update failed.');
          return;
        }
        toast.success(res.message || 'Stock updated successfully.');
        queryClient.invalidateQueries({ queryKey: ['stock-level'] });
      } else {
        const payload: StockCreateRequest = {
          sku_code: formData.skuCode,
          product_name: formData.productName,
          batch_number: formData.batchNumber,
          quantity: formData.quantity,
          location: formData.location,
          expiry_date: formData.expiry,
          status: formData.status,
        };
        const res = await StockLevelService.create(payload);
        if (res.status === 0) {
          alert(res.message || 'Creation failed.');
          return;
        }
        toast.success(res.message || 'Stock created successfully.');
        queryClient.invalidateQueries({ queryKey: ['stock-level'] });
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error('Failed to add stock. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof StockFormData, value: string | number) => {
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
                     formData.quantity >= 0 && formData.location && formData.expiry;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'edit' ? 'Edit Stock' : 'Add New Stock'}</CardTitle>
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
                min="0"
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
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Freezer A1"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={errors.location ? 'border-destructive' : ''}
              />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location}</p>
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
            {isSubmitting ? (mode === 'edit' ? 'Saving...' : 'Adding...') : (mode === 'edit' ? 'Save Changes' : 'Add Stock')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
