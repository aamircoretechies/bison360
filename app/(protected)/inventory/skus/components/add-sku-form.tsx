'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { toast } from 'sonner';

interface AddSkuFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

interface SkuFormData {
  skuCode: string;
  productName: string;
  batchNumber: string;
  quantity: number;
  shelf: string;
  expiry: string;
  status: 'Active' | 'Expiry Soon' | 'Expired' | 'Low Stock';
}

export function AddSkuForm({ onClose, onSuccess }: AddSkuFormProps) {
  const [formData, setFormData] = useState<SkuFormData>({
    skuCode: '',
    productName: '',
    batchNumber: '',
    quantity: 0,
    shelf: '',
    expiry: '',
    status: 'Active',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<SkuFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<SkuFormData> = {};

    if (!formData.skuCode.trim()) {
      newErrors.skuCode = 'SKU Code is required';
    } else if (!/^[A-Z]{2}-\d{3}-\d{2}$/.test(formData.skuCode)) {
      newErrors.skuCode = 'SKU Code must be in format XX-XXX-XX';
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      toast.custom(
        (t) => (
          <Alert
            variant="mono"
            icon="success"
            close={false}
            onClose={() => toast.dismiss(t)}
          >
            <RiCheckboxCircleFill />
            <AlertDescription>
              SKU "{formData.productName}" added successfully!
            </AlertDescription>
          </Alert>
        ),
        {
          position: 'top-center',
        }
      );

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
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isFormValid = formData.skuCode && formData.productName && formData.batchNumber && 
                     formData.quantity > 0 && formData.shelf && formData.expiry;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New SKU</CardTitle>
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
                type="date"
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
                onChange={(e) => handleInputChange('status', e.target.value as SkuFormData['status'])}
              >
                <option value="Active">Active</option>
                <option value="Expiry Soon">Expiry Soon</option>
                <option value="Expired">Expired</option>
                <option value="Low Stock">Low Stock</option>
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
            {isSubmitting ? 'Adding...' : 'Add SKU'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
