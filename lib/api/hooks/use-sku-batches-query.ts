import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import SkuBatchesService from '../sku-batches-service';
import { SkuBatchesRequest, SkuBatchesResponse } from '../types';

export const useSkuBatchesQuery = (
  params: SkuBatchesRequest,
  options?: UseQueryOptions<SkuBatchesResponse, Error>
) => {
  return useQuery<SkuBatchesResponse, Error>({
    queryKey: ['sku-batches', params],
    queryFn: () => SkuBatchesService.getAll(params),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};


