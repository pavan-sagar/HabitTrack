import { NextRequest, NextResponse } from 'next/server';
import { getProfileAnalytics } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());
    
    if (!profileId) {
      return NextResponse.json({ error: 'profileId is required' }, { status: 400 });
    }
    
    const analytics = getProfileAnalytics(profileId, year, month);
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
