import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import { VotePayload } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as VotePayload;

    if (!payload.roundId || !payload.actressVoted || !payload.deviceId) {
      return NextResponse.json({ message: 'Invalid vote payload.' }, { status: 400 });
    }

    const { data: existingVote, error: lookupError } = await getSupabaseServer()
      .from('votes')
      .select('id')
      .eq('round_id', payload.roundId)
      .eq('device_id', payload.deviceId)
      .maybeSingle();

    if (lookupError) {
      return NextResponse.json({ message: 'Unable to process vote.' }, { status: 500 });
    }

    if (existingVote) {
      return NextResponse.json({ message: 'You already voted in this round.' }, { status: 409 });
    }

    const { error: voteError } = await getSupabaseServer().from('votes').insert({
      round_id: payload.roundId,
      actress_voted: payload.actressVoted,
      device_id: payload.deviceId,
      instagram_username: payload.instagramUsername || null,
      traffic_source: payload.trafficSource || null
    });

    if (voteError) {
      return NextResponse.json({ message: 'Could not save your vote.' }, { status: 500 });
    }

    if (payload.instagramUsername || payload.notifyOptIn) {
      await getSupabaseServer().from('users').upsert(
        {
          device_id: payload.deviceId,
          instagram_username: payload.instagramUsername || null,
          notify_opt_in: payload.notifyOptIn || false
        },
        { onConflict: 'device_id' }
      );
    }

    return NextResponse.json({ message: 'Vote counted.' }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Unexpected error while voting.' }, { status: 500 });
  }
}
