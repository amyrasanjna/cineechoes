'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getOrCreateDeviceId } from '@/utils/device-id';
import { Round } from '@/lib/types';
import { VoteModal } from '@/components/vote-modal';

type BattleCardProps = {
  round: Round;
};

type ActressPaneProps = {
  name: string;
  image: string;
  loading: boolean;
  selectedActress: string | null;
  onVote: (name: string) => void;
};

function ActressPane({ name, image, loading, selectedActress, onVote }: ActressPaneProps) {
  return (
    <div className="w-[43%] max-w-[180px] space-y-3 text-center">
      <div className="relative mx-auto aspect-[3/4] w-full overflow-hidden rounded-2xl">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
      <h2 className="text-sm font-semibold sm:text-base">{name}</h2>
      <button
        disabled={loading}
        onClick={() => onVote(name)}
        className="w-full rounded-xl bg-gold-gradient px-3 py-3 text-sm font-bold text-noir disabled:opacity-60"
      >
        {loading && selectedActress === name ? 'Submitting...' : `Vote ${name.split(' ')[0]}`}
      </button>
    </div>
  );
}

export function BattleCard({ round }: BattleCardProps) {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedActress, setSelectedActress] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    setDeviceId(getOrCreateDeviceId());
  }, []);

  const submitVote = async (payload?: {
    instagramUsername?: string;
    trafficSource?: string;
    notifyOptIn: boolean;
  }) => {
    if (!selectedActress || !deviceId) return;
    setLoading(true);

    const response = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roundId: round.id,
        actressVoted: selectedActress,
        deviceId,
        instagramUsername: payload?.instagramUsername || null,
        trafficSource: payload?.trafficSource || null,
        notifyOptIn: payload?.notifyOptIn || false
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(data.message ?? 'Unable to submit vote right now.');
      setLoading(false);
      setOpenModal(false);
      return;
    }

    setStatus('🎉 Your vote is counted! Follow @cineechoes.in on insta for next rounds.');
    setLoading(false);
    setOpenModal(false);
  };

  const vote = (actressName: string) => {
    if (!deviceId) {
      setStatus('Preparing your voting session. Please try again in a second.');
      return;
    }
    setSelectedActress(actressName);
    setOpenModal(true);
  };

  return (
    <div className="luxe-card p-4 sm:p-6">
      <h1 className="text-center text-2xl font-bold">CineEchoes Actress League</h1>
      <p className="mt-2 text-center text-sm text-noir/70">Pick your favorite in this round</p>

      <div className="mt-5 flex items-center justify-center gap-2 sm:gap-4">
        <ActressPane
          name={round.actress_a}
          image={round.actress_a_image}
          loading={loading}
          selectedActress={selectedActress}
          onVote={vote}
        />
        <div className="text-xl font-bold text-gold">VS</div>
        <ActressPane
          name={round.actress_b}
          image={round.actress_b_image}
          loading={loading}
          selectedActress={selectedActress}
          onVote={vote}
        />
      </div>

      {status ? <p className="mt-4 rounded-xl bg-noir px-3 py-2 text-center text-sm text-white">{status}</p> : null}

      <VoteModal
        isOpen={openModal}
        onSubmit={submitVote}
        onSkip={async () => {
          await submitVote({ notifyOptIn: false });
        }}
      />
    </div>
  );
}
