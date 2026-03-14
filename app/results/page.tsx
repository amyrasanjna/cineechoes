import { ResultsChart } from '@/components/results-chart';
import { getLatestCompletedRound, getRoundSummary } from '@/lib/rounds';

export const dynamic = 'force-dynamic';

export default async function ResultsPage() {
  let round = null;

  try {
    round = await getLatestCompletedRound();
  } catch {
    round = null;
  }

  if (!round) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10">
        <div className="luxe-card p-8 text-center">
          <h1 className="text-xl font-bold">Results are not available yet.</h1>
        </div>
      </main>
    );
  }

  const summary = await getRoundSummary(round);

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10">
      <ResultsChart round={round} summary={summary} />
    </main>
  );
}
