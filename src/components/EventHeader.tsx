'use client';

import { Event } from '../types';
import { format, differenceInDays, differenceInHours } from 'date-fns';

export default function EventHeader({ event }: { event: Event }) {
  const date = new Date(event.time);
  const now = new Date();
  const diffDays = differenceInDays(date, now);
  const diffHours = differenceInHours(date, now);

  const upcomingLabel =
    diffDays > 1
      ? `${diffDays} days away`
      : diffHours > 1
      ? `${diffHours} hours away`
      : 'Happening soon';

  return (
    <div className="relative rounded-lg overflow-hidden shadow">
      <div className="h-64 sm:h-96 relative">
        <img
          src={event.image || '/placeholder.jpg'}
          alt={event.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-black/40" />
      </div>
      <div className="relative -mt-16 px-6 pb-6 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        <div className="flex-1 bg-white rounded-lg p-6 shadow -mt-8">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
            <div>
              <span className="font-semibold">When:</span>{' '}
              {format(date, 'EEEE, MMMM d, yyyy')} at{' '}
              {format(date, 'h:mm a')}
            </div>
            <div>
              <span className="font-semibold">Status:</span> {upcomingLabel}
            </div>
          </div>
        </div>
        <div className="w-full sm:w-96 flex-shrink-0" />
      </div>
    </div>
  );
}
