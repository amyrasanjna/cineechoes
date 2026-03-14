import { getSupabaseServer } from '@/lib/supabase/server';
import { Round, VoteSummary } from '@/lib/types';

export async function getActiveRound(): Promise<Round | null> {
  const supabaseServer = getSupabaseServer();
  const { data, error } = await supabaseServer
    .from('rounds')
    .select('*')
    .eq('is_active', true)
    .order('start_time', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getLatestCompletedRound(): Promise<Round | null> {
  const supabaseServer = getSupabaseServer();
  const { data, error } = await supabaseServer
    .from('rounds')
    .select('*')
    .eq('is_active', false)
    .order('end_time', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getRoundSummary(round: Round): Promise<VoteSummary> {
  const supabaseServer = getSupabaseServer();
  const { data, error } = await supabaseServer
    .from('votes')
    .select('actress_voted')
    .eq('round_id', round.id);

  if (error) throw error;

  const actressAVotes = data.filter((vote) => vote.actress_voted === round.actress_a).length;
  const actressBVotes = data.filter((vote) => vote.actress_voted === round.actress_b).length;
  const total = actressAVotes + actressBVotes;
  const actressAPercentage = total === 0 ? 0 : Math.round((actressAVotes / total) * 100);
  const actressBPercentage = total === 0 ? 0 : 100 - actressAPercentage;

  const winner =
    actressAVotes === actressBVotes
      ? 'tie'
      : actressAVotes > actressBVotes
        ? 'actress_a'
        : 'actress_b';

  return {
    actress_a_votes: actressAVotes,
    actress_b_votes: actressBVotes,
    actress_a_percentage: actressAPercentage,
    actress_b_percentage: actressBPercentage,
    winner
  };
}
