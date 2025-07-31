'use client';

import { useState, useEffect, useRef } from 'react';
import { Event } from '../types';
import EventTypeSummaryModal from './EventTypeSummaryModal';

export default function EventTypeSummarySection({
  event,
  sameCategoryEvents,
}: {
  event: Event;
  sameCategoryEvents: Event[];
}) {
  const [open, setOpen] = useState(false);

  // close on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between bg-white border rounded-lg p-4 shadow">
        <div>
          <h2 className="text-lg font-semibold">{event.category} sessions</h2>
          <p className="text-sm text-gray-500">
            Quick summary & upcoming sessions
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          View summary
        </button>
      </div>
      <EventTypeSummaryModal
        event={event}
        sameCategoryEvents={sameCategoryEvents}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
