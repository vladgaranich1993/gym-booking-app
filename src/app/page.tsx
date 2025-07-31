'use client';

import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';

export default function HomePage() {
  const { data, isLoading, error } = useEvents();

  if (isLoading) return <Loader />;
  if (error) return <p className="text-center text-red-600">Error loading events.</p>;
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No upcoming sessions.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((evt) => (
        <EventCard key={evt.id} event={evt} allEvents={data} />
      ))}
    </div>
  );
}
