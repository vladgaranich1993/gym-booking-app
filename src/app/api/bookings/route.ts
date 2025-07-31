import { NextResponse } from 'next/server';
import { Booking } from '../../../types';
import { nanoid } from 'nanoid';
import { Event } from '../../../types';
import events from '../../../data/events.json';

let bookings: Booking[] = [];


export async function GET() {
  return NextResponse.json(events as Event[]);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { eventId, name, email } = body;
  if (!eventId || !name || !email) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const newBooking: Booking = {
    id: nanoid(),
    eventId,
    name,
    email,
    createdAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  return NextResponse.json({ success: true, booking: newBooking });
}