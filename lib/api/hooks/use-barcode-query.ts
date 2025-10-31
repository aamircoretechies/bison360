import { useQuery } from '@tanstack/react-query';
import { BarcodesRequest, BarcodesResponse } from '../types';
import BarcodeService from '../barcode-service';

export const useBarcodeQuery = (params: BarcodesRequest) => {
  return useQuery<BarcodesResponse, Error>({
    queryKey: ['barcodes', params],
    queryFn: () => BarcodeService.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 60 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};

