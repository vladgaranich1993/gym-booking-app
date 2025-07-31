import { notFound } from 'next/navigation';
import path from 'path';
import fs from 'fs';
import { Event } from '../../../types';
import EventHeader from '../../../components/EventHeader';
import BookingSummary from '../../../components/BookingSummary';
import CopyLinkButton from '../../../components/CopyLinkButton';
import { format } from 'date-fns';
import EventCard from '../../../components/EventCard';

type Params = { params: Promise<{ id: string }> };

async function getEvents(): Promise<Event[]> {
  const filePath = path.join(process.cwd(), 'src', 'data', 'events.json');
  const raw = await fs.promises.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as Event[];
}

async function getEvent(id: string): Promise<Event | null> {
  const events = await getEvents();
  return events.find((e) => e.id === id) ?? null;
}

export default async function EventPage({ params }: Params) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) return notFound();

  const all = await getEvents();
  const similar = all.filter((e) => e.id !== event.id).slice(0, 3);

  return (
    <div className="space-y-10">
      <EventHeader event={event} />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        {/* Left content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {format(new Date(event.time), 'PPPPp')}
            </div>
            <CopyLinkButton />
          </div>

          <div className="prose prose-indigo">
            <h2>About this session</h2>
            <p>
              Join our <strong>{event.title}</strong> class for an energizing
              workout. It's tailored to all levels, led by experienced
              instructors, and designed to leave you feeling strong and
              refreshed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 shadow">
              <h3 className="text-lg font-semibold mb-2">What to bring</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Water bottle</li>
                <li>Workout towel</li>
                <li>Comfortable shoes</li>
                <li>Positive energy</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <h3 className="text-lg font-semibold mb-2">Instructor</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">A</span>
                </div>
                <div>
                  <div className="font-semibold">Alex Morgan</div>
                  <div className="text-sm text-gray-500">Fitness Coach</div>
                </div>
              </div>
              <p className="mt-2 text-sm">
                Alex has 8 years of experience pushing clients toward their
                best performance with a focus on strength and mobility.
              </p>
            </div>
          </div>

          {similar.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">You might also like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similar.map((e) => (
                  <EventCard key={e.id} event={e} allEvents={[]} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar booking */}
        <div>
          <BookingSummary event={event} />
        </div>
      </div>
    </div>
  );
}
