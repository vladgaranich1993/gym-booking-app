'use client';

import { Event } from '../types';
import { format } from 'date-fns';
import BookingForm from './BookingForm';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function BookingSummary({ event }: { event: Event }) {
  const spots = event.spotsAvailable;

  return (
    <div className="sticky top-24 space-y-4 p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs uppercase font-semibold text-gray-500">
            Price
          </div>
          <div className="text-2xl font-bold">
            {event.price === 0
              ? 'Free'
              : priceFormatter.format(event.price)}
          </div>
        </div>
        <div className="text-right">
          {spots === 0 ? (
            <div className="text-red-600 font-semibold">Sold out</div>
          ) : spots > 5 ? (
            <div className="text-green-600 font-semibold">
              Free spots available
            </div>
          ) : (
            <div className="text-yellow-700 font-semibold">
              {spots} spot{spots === 1 ? '' : 's'} left
            </div>
          )}
        </div>
      </div>

      <div className="mt-2">
        <div className="text-sm text-gray-700 mb-1">Book this session:</div>
        <BookingForm eventId={event.id} />
      </div>
    </div>
  );
}
