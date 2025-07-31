// src/hooks/useEvents.ts
import { useQuery } from '@tanstack/react-query';
import { Event } from '../types';

async function fetchEvents(): Promise<Event[]> {
  const res = await fetch('/api/events');
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });
}
