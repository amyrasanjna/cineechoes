import { Round, VoteSummary } from '@/lib/types';

type ResultsChartProps = {
  round: Round;
  summary: VoteSummary;
};

function Row({ label, percent, votes, winner }: { label: string; percent: number; votes: number; winner: boolean }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-semibold">{label}</span>
        <span className="text-sm font-medium">{percent}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-noir/10">
        <div
          className="h-full bg-gold-gradient transition-all duration-700"
          style={{ width: `${Math.max(percent, 3)}%` }}
          aria-label={`${label} ${percent}%`}
        />
      </div>
      <p className="text-xs text-noir/70">
        {votes} votes {winner ? '👑 Winner' : ''}
      </p>
    </div>
  );
}

export function ResultsChart({ round, summary }: ResultsChartProps) {
  return (
    <div className="luxe-card mx-auto w-full max-w-xl space-y-6 p-6">
      <h1 className="text-center text-2xl font-bold">Round Results</h1>
      <Row
        label={round.actress_a}
        percent={summary.actress_a_percentage}
        votes={summary.actress_a_votes}
        winner={summary.winner === 'actress_a'}
      />
      <Row
        label={round.actress_b}
        percent={summary.actress_b_percentage}
        votes={summary.actress_b_votes}
        winner={summary.winner === 'actress_b'}
      />
      {summary.winner === 'tie' ? <p className="text-center font-medium">It&apos;s a tie! 🔥</p> : null}
    </div>
  );
}
