import { QueryClient } from '@tanstack/react-query';

export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 10 * 60_000,
        retry: (failureCount, error) => failureCount < 2 && !(error instanceof Error && error.name === 'AuthError'),
        refetchOnWindowFocus: false,
      },
      mutations: { retry: 0 },
    },
  });
}

