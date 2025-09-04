'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, CheckCircle, RefreshCw, Eye, Edit } from 'lucide-react';

interface DataMismatch {
  id: string;
  integration: string;
  entityType: string;
  entityId: string;
  field: string;
  bisonValue: any;
  externalValue: any;
  conflictType: 'value_mismatch' | 'missing_field' | 'type_mismatch' | 'format_mismatch';
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: string;
  status: 'pending' | 'resolved' | 'ignored';
}

interface DataMismatchResolverProps {
  mismatches: DataMismatch[];
  onResolve: (id: string, resolution: any) => void;
  onIgnore: (id: string) => void;
}

export function DataMismatchResolver({ mismatches, onResolve, onIgnore }: DataMismatchResolverProps) {
  const [selectedMismatch, setSelectedMismatch] = useState<DataMismatch | null>(null);
  const [resolutionValue, setResolutionValue] = useState<any>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleResolve = () => {
    if (selectedMismatch) {
      onResolve(selectedMismatch.id, resolutionValue);
      setIsDialogOpen(false);
      setSelectedMismatch(null);
      setResolutionValue('');
    }
  };

  const handleIgnore = (id: string) => {
    onIgnore(id);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getConflictTypeLabel = (type: string) => {
    switch (type) {
      case 'value_mismatch': return 'Value Mismatch';
      case 'missing_field': return 'Missing Field';
      case 'type_mismatch': return 'Type Mismatch';
      case 'format_mismatch': return 'Format Mismatch';
      default: return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
          Data Mismatch Resolution
        </CardTitle>
        <CardDescription>
          Resolve data conflicts and mismatches between BISON 360 and external systems
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Integration</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Field</TableHead>
              <TableHead>Conflict Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>BISON Value</TableHead>
              <TableHead>External Value</TableHead>
              <TableHead>Detected</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mismatches.map((mismatch) => (
              <TableRow key={mismatch.id}>
                <TableCell>
                  <Badge variant="secondary">{mismatch.integration}</Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{mismatch.entityType}</p>
                    <p className="text-sm text-muted-foreground">ID: {mismatch.entityId}</p>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{mismatch.field}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{getConflictTypeLabel(mismatch.conflictType)}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getSeverityColor(mismatch.severity)}>
                    {mismatch.severity.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {mismatch.bisonValue || <span className="text-muted-foreground">null</span>}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {mismatch.externalValue || <span className="text-muted-foreground">null</span>}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{mismatch.detectedAt}</TableCell>
                <TableCell>
                  <Badge variant={
                    mismatch.status === 'resolved' ? 'success' :
                    mismatch.status === 'ignored' ? 'secondary' :
                    'warning'
                  }>
                    {mismatch.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => {
                            setSelectedMismatch(mismatch);
                            setResolutionValue(mismatch.bisonValue);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Resolve Data Mismatch</DialogTitle>
                          <DialogDescription>
                            Choose the correct value for {mismatch.field} in {mismatch.entityType}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>BISON 360 Value</Label>
                              <Input 
                                value={mismatch.bisonValue || ''} 
                                readOnly 
                                className="bg-muted"
                              />
                            </div>
                            <div>
                              <Label>External Value</Label>
                              <Input 
                                value={mismatch.externalValue || ''} 
                                readOnly 
                                className="bg-muted"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="resolution">Resolution Value</Label>
                            <Input
                              id="resolution"
                              value={resolutionValue}
                              onChange={(e) => setResolutionValue(e.target.value)}
                              placeholder="Enter the correct value..."
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="secondary" 
                              onClick={() => setResolutionValue(mismatch.bisonValue)}
                            >
                              Use BISON Value
                            </Button>
                            <Button 
                              variant="secondary" 
                              onClick={() => setResolutionValue(mismatch.externalValue)}
                            >
                              Use External Value
                            </Button>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleResolve}>
                            Resolve Conflict
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleIgnore(mismatch.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Mock data for demonstration
export const mockMismatches: DataMismatch[] = [
  {
    id: 'mismatch-001',
    integration: 'Salesforce',
    entityType: 'Contact',
    entityId: '0015g00000ABC123',
    field: 'email',
    bisonValue: 'john.smith@company.com',
    externalValue: 'john.smith@acme.com',
    conflictType: 'value_mismatch',
    severity: 'medium',
    detectedAt: '2024-01-15 14:30:00',
    status: 'pending'
  },
  {
    id: 'mismatch-002',
    integration: 'GrownBy',
    entityType: 'Product',
    entityId: 'GB-001',
    field: 'price',
    bisonValue: 12.99,
    externalValue: 13.99,
    conflictType: 'value_mismatch',
    severity: 'low',
    detectedAt: '2024-01-15 14:25:00',
    status: 'pending'
  },
  {
    id: 'mismatch-003',
    integration: 'Stripe',
    entityType: 'Customer',
    entityId: 'cus_123456789',
    field: 'phone',
    bisonValue: '+1-555-123-4567',
    externalValue: null,
    conflictType: 'missing_field',
    severity: 'high',
    detectedAt: '2024-01-15 14:20:00',
    status: 'pending'
  },
  {
    id: 'mismatch-004',
    integration: 'Shipping Services',
    entityType: 'Order',
    entityId: 'ORD-12345',
    field: 'weight',
    bisonValue: '2.5 lbs',
    externalValue: 2.5,
    conflictType: 'type_mismatch',
    severity: 'medium',
    detectedAt: '2024-01-15 14:15:00',
    status: 'resolved'
  }
];
