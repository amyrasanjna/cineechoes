import Link from 'next/link';
import { BattleCard } from '@/components/battle-card';
import { ShareButton } from '@/components/share-button';
import { getActiveRound } from '@/lib/rounds';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let round = null;

  try {
    round = await getActiveRound();
  } catch {
    round = null;
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-8 sm:py-10">
      {round ? (
        <>
          <BattleCard round={round} />
          <div className="mt-5 flex items-center justify-center gap-3">
            <ShareButton />
            <Link href="/results" className="rounded-full border border-noir/20 px-4 py-2 text-sm font-semibold">
              View Latest Results
            </Link>
          </div>
        </>
      ) : (
        <div className="luxe-card p-8 text-center">
          <h1 className="text-2xl font-bold">No active round right now</h1>
          <p className="mt-2 text-noir/70">Follow @cineechoes.in to know when the next battle starts.</p>
          <Link href="/results" className="mt-4 inline-block rounded-full bg-gold-gradient px-4 py-2 font-semibold text-noir">
            View Results
          </Link>
        </div>
      )}
    </main>
  );
}
