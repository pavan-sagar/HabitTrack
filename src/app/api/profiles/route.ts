import { NextRequest, NextResponse } from 'next/server';
import { createProfile, getProfiles, getProfile, deleteProfile } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      const profile = getProfile(id);
      if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      return NextResponse.json(profile);
    }
    const profiles = getProfiles();
    return NextResponse.json(profiles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, pin } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    const profile = createProfile(name, pin);
    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id, pin } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    if (pin !== undefined && !verifyProfilePin(id, String(pin))) {
      return NextResponse.json({ error: 'Incorrect PIN' }, { status: 401 });
    }
    deleteProfile(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 });
  }
}