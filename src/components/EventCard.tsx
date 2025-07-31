'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Event } from '../types';
import { format } from 'date-fns';
import EventTypeSummaryModal from './EventTypeSummaryModal';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function EventCard({
  event,
  allEvents,
}: {
  event: Event;
  allEvents: Event[];
}) {
  const [showSummary, setShowSummary] = useState(false);
  const sameCategoryEvents = allEvents.filter((e) => e.category === event.category);
  const spots = event.spotsAvailable;
  const spotsLabel =
    spots === 0
      ? 'Sold out'
      : spots > 5
      ? 'Free spots available'
      : `${spots} spot${spots === 1 ? '' : 's'} left`;

  const handleCardClick = () => setShowSummary(true);

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden flex flex-col cursor-pointer group"
      >
        <div className="relative h-44">
          <img
            src={event.image || '/placeholder.jpg'}
            alt={event.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-2 left-2 flex gap-2">
            <div
              className={`text-xs font-semibold px-2 py-1 rounded ${
                event.price === 0
                  ? 'bg-green-600 text-white'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              {event.price === 0 ? 'Free' : priceFormatter.format(event.price)}
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
            <div className="mb-3 min-w-0">
                <h3 className="text-lg font-semibold truncate">{event.title}</h3>
                <p className="text-xs text-gray-500">
                {format(new Date(event.time), 'PPPp')}
                </p>
                <div className="mt-2">
                {spots === 0 ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                    Sold out
                    </span>
                ) : spots > 5 ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                    Free spots available
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                    {spotsLabel}
                    </span>
                )}
                </div>
            </div>

            <div className="mt-auto flex justify-end">
                <Link href={`/events/${event.id}`} prefetch={true}>
                <button
                    onClick={(e) => e.stopPropagation()}
                    disabled={spots === 0}
                    className={`px-4 py-2 rounded text-sm font-semibold transition w-full sm:w-auto ${
                    spots === 0
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                >
                    {spots === 0 ? 'Sold out' : 'Book'}
                </button>
                </Link>
            </div>
        </div>


      </div>

      <EventTypeSummaryModal
        event={event}
        sameCategoryEvents={sameCategoryEvents}
        open={showSummary}
        onClose={() => setShowSummary(false)}
      />
    </>
  );
}
