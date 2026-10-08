import { NextRequest, NextResponse } from 'next/server';
import { createHabit, getHabits, deleteHabit } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');
    
    if (!profileId) {
      return NextResponse.json({ error: 'profileId is required' }, { status: 400 });
    }
    
    const habits = getHabits(profileId);
    return NextResponse.json(habits);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch habits' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { profileId, title, description } = await request.json();
    
    if (!profileId || !title) {
      return NextResponse.json({ error: 'profileId and title are required' }, { status: 400 });
    }
    
    const habit = createHabit(profileId, title, description);
    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create habit' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    deleteHabit(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete habit' }, { status: 500 });
  }
}
