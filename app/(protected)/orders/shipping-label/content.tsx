'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Truck, Package, Download, Printer, Eye, Scale } from 'lucide-react';
import { toast } from 'sonner';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ShippingLabelData {
  orderId: string;
  customerName: string;
  customerAddress: string;
  carrier: 'USPS' | 'FedEx' | 'UPS';
  service: string;
  weight: number;
  trackingNumber: string;
  labelGenerated: boolean;
}

const carriers = {
  USPS: {
    name: 'USPS',
    services: ['Priority Mail', 'First Class', 'Media Mail', 'Ground'],
    icon: '📮',
  },
  FedEx: {
    name: 'FedEx',
    services: ['Ground', '2-Day', 'Overnight', 'Express'],
    icon: '🚚',
  },
  UPS: {
    name: 'UPS',
    services: ['Ground', '2nd Day Air', 'Next Day Air', 'Express'],
    icon: '📦',
  },
};

export function ShippingLabelContent() {
  const [labelData, setLabelData] = useState<ShippingLabelData>({
    orderId: 'ORD-2024-001',
    customerName: 'John Smith',
    customerAddress: '123 Main St, Anytown, ST 12345',
    carrier: 'USPS',
    service: 'Priority Mail',
    weight: 2.5,
    trackingNumber: '1Z999AA1234567890',
    labelGenerated: false,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleCarrierChange = (carrier: ShippingLabelData['carrier']) => {
    setLabelData(prev => ({
      ...prev,
      carrier,
      service: carriers[carrier].services[0],
    }));
  };

  const handleServiceChange = (service: string) => {
    setLabelData(prev => ({ ...prev, service }));
  };

  const handleWeightChange = (weight: number) => {
    setLabelData(prev => ({ ...prev, weight }));
  };

  const generateLabel = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLabelData(prev => ({ ...prev, labelGenerated: true }));
      
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
              Shipping label generated successfully!
            </AlertDescription>
          </Alert>
        ),
        {
          position: 'top-center',
        }
      );
    } catch (error) {
      toast.error('Failed to generate shipping label');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadLabel = () => {
    toast.success('Label downloaded successfully!');
  };

  const printLabel = () => {
    toast.success('Label sent to printer!');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Configuration Panel */}
      <div className="space-y-6">
        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Order ID</Label>
              <p className="text-sm font-mono">{labelData.orderId}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Customer</Label>
              <p className="text-sm">{labelData.customerName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Shipping Address</Label>
              <p className="text-sm">{labelData.customerAddress}</p>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipping Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="carrier">Carrier</Label>
              <Select value={labelData.carrier} onValueChange={handleCarrierChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(carriers).map(([key, carrier]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <span>{carrier.icon}</span>
                        <span>{carrier.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="service">Service</Label>
              <Select value={labelData.service} onValueChange={handleServiceChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {carriers[labelData.carrier].services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="weight" className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Weight (lbs)
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="0"
                value={labelData.weight}
                onChange={(e) => handleWeightChange(parseFloat(e.target.value) || 0)}
                placeholder="0.0"
              />
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={generateLabel}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Label'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Information */}
        {labelData.labelGenerated && (
          <Card>
            <CardHeader>
              <CardTitle>Tracking Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Tracking Number</Label>
                <p className="text-sm font-mono">{labelData.trackingNumber}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={downloadLabel}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={printLabel}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Label Preview */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Label Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {labelData.labelGenerated ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white">
                <div className="space-y-4">
                  {/* Carrier Logo */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{carriers[labelData.carrier].icon}</span>
                      <span className="font-bold text-lg">{carriers[labelData.carrier].name}</span>
                    </div>
                    <Badge variant="outline">{labelData.service}</Badge>
                  </div>

                  <Separator />

                  {/* From Address */}
                  <div>
                    <Label className="text-xs font-medium text-gray-500">FROM:</Label>
                    <div className="text-sm">
                      <div className="font-medium">Bison360 Ranch</div>
                      <div>123 Ranch Road</div>
                      <div>Rural Town, ST 12345</div>
                    </div>
                  </div>

                  {/* To Address */}
                  <div>
                    <Label className="text-xs font-medium text-gray-500">TO:</Label>
                    <div className="text-sm">
                      <div className="font-medium">{labelData.customerName}</div>
                      <div>{labelData.customerAddress}</div>
                    </div>
                  </div>

                  <Separator />

                  {/* Package Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-xs font-medium text-gray-500">Weight:</Label>
                      <div>{labelData.weight} lbs</div>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500">Service:</Label>
                      <div>{labelData.service}</div>
                    </div>
                  </div>

                  {/* Tracking Barcode */}
                  <div className="text-center">
                    <div className="text-xs font-medium text-gray-500 mb-2">Tracking Number</div>
                    <div className="font-mono text-lg font-bold">{labelData.trackingNumber}</div>
                    <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                      |||| |||| |||| |||| |||| |||| |||| ||||
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">
                  Generate a shipping label to see the preview
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shipping Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="text-sm">
                <strong>Frozen Items:</strong> Use dry ice and proper insulation
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="text-sm">
                <strong>Fragile Items:</strong> Add extra padding and mark as fragile
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="text-sm">
                <strong>Weight Accuracy:</strong> Ensure weight is accurate for proper pricing
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="text-sm">
                <strong>Address Verification:</strong> Double-check shipping address
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
