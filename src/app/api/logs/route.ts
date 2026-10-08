import { NextRequest, NextResponse } from 'next/server';
import { toggleLog, getLogsByProfileAndDate } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');
    const date = searchParams.get('date');
    
    if (!profileId || !date) {
      return NextResponse.json({ error: 'profileId and date are required' }, { status: 400 });
    }
    
    const logs = getLogsByProfileAndDate(profileId, date);
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { habitId, date } = await request.json();
    
    if (!habitId || !date) {
      return NextResponse.json({ error: 'habitId and date are required' }, { status: 400 });
    }
    
    const result = toggleLog(habitId, date);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to toggle log' }, { status: 500 });
  }
}
