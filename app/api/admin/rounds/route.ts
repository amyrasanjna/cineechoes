import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';

function isAuthorized(request: Request): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const submittedPassword = request.headers.get('x-admin-password');
  return Boolean(adminPassword && submittedPassword && submittedPassword === adminPassword);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const { error } = await getSupabaseServer().from('rounds').insert({
    actress_a: body.actressA,
    actress_b: body.actressB,
    actress_a_image: body.actressAImage,
    actress_b_image: body.actressBImage,
    start_time: body.startTime,
    end_time: body.endTime,
    is_active: true
  });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json({ message: 'Round created.' }, { status: 201 });
}
