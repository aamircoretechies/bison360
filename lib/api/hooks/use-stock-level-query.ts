import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import StockLevelService from '../stock-level-service';
import { StockLevelRequest, StockLevelResponse } from '../types';

export const useStockLevelQuery = (
  params: StockLevelRequest,
  options?: UseQueryOptions<StockLevelResponse, Error>
) => {
  return useQuery<StockLevelResponse, Error>({
    queryKey: ['stock-level', params],
    queryFn: () => StockLevelService.getAll(params),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};


