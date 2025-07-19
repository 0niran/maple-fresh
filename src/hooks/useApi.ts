import { useState, useEffect } from 'react';
import { ApiResponse, LoadingState } from '@/types';

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall();
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'An error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

export function useAsyncOperation<T>() {
  const [state, setState] = useState<LoadingState & { data?: T }>({
    isLoading: false,
    error: undefined,
    data: undefined,
  });

  const execute = async (operation: () => Promise<ApiResponse<T>>) => {
    setState({ isLoading: true, error: undefined });
    
    try {
      const response = await operation();
      
      if (response.success) {
        setState({ 
          isLoading: false, 
          error: undefined, 
          data: response.data 
        });
        return response.data;
      } else {
        setState({ 
          isLoading: false, 
          error: response.error || 'Operation failed' 
        });
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setState({ isLoading: false, error: errorMessage });
      return null;
    }
  };

  return {
    ...state,
    execute,
  };
}