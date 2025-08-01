'use client';
import useSWR from 'swr';

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(res => res.json());

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR('/api/me', fetcher, {
    revalidateOnFocus: false,
  });

  return {
    user: data?.authenticated ? { uid: data.uid, email: data.email } : null,
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}
