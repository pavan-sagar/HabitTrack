import { NextRequest, NextResponse } from 'next/server';
import { verifyProfilePin } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { id, pin } = await request.json();
    if (!id || !pin) {
      return NextResponse.json({ error: 'ID and PIN are required' }, { status: 400 });
    }

    const isValid = verifyProfilePin(id, String(pin));
    if (!isValid) {
      return NextResponse.json({ error: 'Incorrect PIN' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify PIN' }, { status: 500 });
  }
}
