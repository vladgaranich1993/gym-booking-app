import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { Event } from '../../../types';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'events.json');
    const file = await fs.promises.readFile(filePath, 'utf-8');
    const events = JSON.parse(file) as Event[];
    return NextResponse.json(events);
  } catch (err) {
    console.error('Failed to load events.json:', err);
    return NextResponse.json(
      [
        {
          id: 'fallback-1',
          title: 'Fallback Session',
          time: new Date().toISOString(),
        },
      ],
      { status: 200 }
    );
  }
}
