import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';

function isAuthorized(request: Request): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const submittedPassword = request.headers.get('x-admin-password');
  return Boolean(adminPassword && submittedPassword && submittedPassword === adminPassword);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await getSupabaseServer()
    .from('rounds')
    .update({ is_active: false, end_time: new Date().toISOString() })
    .eq('id', params.id);

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json({ message: 'Round ended.' });
}
