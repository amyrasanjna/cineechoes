import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';

function isAuthorized(request: Request): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const submittedPassword = request.headers.get('x-admin-password');
  return Boolean(adminPassword && submittedPassword && submittedPassword === adminPassword);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { data: rounds, error: roundError } = await getSupabaseServer()
    .from('rounds')
    .select('*')
    .order('start_time', { ascending: false })
    .limit(10);

  if (roundError) return NextResponse.json({ message: roundError.message }, { status: 500 });

  const enriched = await Promise.all(
    (rounds || []).map(async (round) => {
      const { count, error } = await getSupabaseServer()
        .from('votes')
        .select('id', { head: true, count: 'exact' })
        .eq('round_id', round.id);

      if (error) throw error;
      return { ...round, vote_count: count || 0 };
    })
  );

  return NextResponse.json({ rounds: enriched });
}
