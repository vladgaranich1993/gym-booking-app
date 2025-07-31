'use client';

import { Event, Trainer } from '../types';
import { format } from 'date-fns';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Avatar from './Avatar';

const categoryDescriptions: Record<string, string> = {
  HIIT: 'High-intensity interval training to maximize calorie burn in short bursts. Expect dynamic cardio and bodyweight intervals.',
  Yoga: 'Flow-based yoga sessions focusing on breath, flexibility, and recovery—suitable for all levels.',
  Spin: 'Music-driven indoor cycling for endurance and leg strength with interval variations.',
};

type Props = {
  event: Event;
  sameCategoryEvents: Event[];
  open: boolean;
  onClose: () => void;
};

function uniqueTrainers(events: Event[]): Trainer[] {
  const map = new Map<string, Trainer>();
  events.forEach((e) => {
    e.trainers?.forEach((t) => {
      if (!map.has(t.id)) map.set(t.id, t);
    });
  });
  return Array.from(map.values());
}

export default function EventTypeSummaryModal({
  event,
  sameCategoryEvents,
  open,
  onClose,
}: Props) {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Aggs
  const avgPrice =
    sameCategoryEvents.reduce((sum, e) => sum + e.price, 0) /
    Math.max(1, sameCategoryEvents.length);
  const avgSpots = Math.round(
    sameCategoryEvents.reduce((sum, e) => sum + e.spotsAvailable, 0) /
      Math.max(1, sameCategoryEvents.length)
  );

  const now = new Date();
  const upcoming = sameCategoryEvents
    .filter((e) => new Date(e.time) >= now)
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  const nextSessions = upcoming.slice(0, 3);
  const trainers = uniqueTrainers(sameCategoryEvents);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (typeof document === 'undefined') return null;
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center px-4 py-8">
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* panel */}
      <div className="relative bg-white max-w-3xl w-full rounded-xl shadow-xl overflow-auto max-h-[90vh] z-10">
        <div className="flex justify-between items-start p-6 border-b border-gray-300">
          <div>
            <h2 className="text-2xl font-bold">
              {event.category} sessions summary
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {categoryDescriptions[event.category] ||
                'Overview of this session type.'}
            </p>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-xs uppercase font-medium text-gray-500">
                Upcoming
              </div>
              <div className="text-lg font-semibold">
                {upcoming.length}{' '}
                {upcoming.length === 1 ? 'session' : 'sessions'}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-xs uppercase font-medium text-gray-500">
                Avg price
              </div>
              <div className="text-lg font-semibold">
                {avgPrice === 0
                  ? 'Free'
                  : new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(avgPrice)}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-xs uppercase font-medium text-gray-500">
                Avg spots left
              </div>
              <div className="text-lg font-semibold">{avgSpots}</div>
            </div>
          </div>

          {/* Trainers */}
          {trainers.length > 0 && (
            <div className="bg-white border rounded-lg border-gray-300 p-4 shadow">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Trainers</div>
              </div>
              <div className="mt-2 flex gap-4 flex-wrap">
                {trainers.map((t) => (
                <div key={t.id} className="flex items-center gap-3 bg-gray-50 rounded px-3 py-2">
                    <Avatar name={t.name} src={t.avatar} size={40} />
                    <div className="text-sm">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-gray-500">{t.role || ''}</div>
                    </div>
                </div>
                ))}
              </div>
            </div>
          )}

          {/* Next sessions */}
          {nextSessions.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">
                Next sessions
              </div>
              <ul className="space-y-2">
                {nextSessions.map((s) => (
                  <li
                    key={s.id}
                    className="flex justify-between items-center border-b border-gray-300 rounded px-4 py-2"
                  >
                    <div>
                      <div className="font-semibold">{s.title}</div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(s.time), 'EEE, MMM d @ h:mm a')}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm">
                        {s.spotsAvailable === 0
                          ? 'Sold out'
                          : s.spotsAvailable > 5
                          ? 'Free spots'
                          : `${s.spotsAvailable} left`}
                      </div>
                      <Link
                        href={`/events/${s.id}`}
                        className="text-indigo-600 text-sm hover:underline"
                      >
                        View
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-4 flex-wrap">
            <Link
              href={`/events/${event.id}`}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Book this session
            </Link>
            <Link
              href={`/events`}
              className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition"
            >
              See all {event.category} sessions
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-300 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
