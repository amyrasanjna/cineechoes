'use client';

import { FormEvent, useState } from 'react';

type RoundStats = {
  id: string;
  actress_a: string;
  actress_b: string;
  is_active: boolean;
  start_time: string;
  end_time: string;
  vote_count: number;
};

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [message, setMessage] = useState('');
  const [rounds, setRounds] = useState<RoundStats[]>([]);

  const headers = { 'Content-Type': 'application/json', 'x-admin-password': password };

  const loadStats = async () => {
    const res = await fetch('/api/admin/stats', { headers: { 'x-admin-password': password } });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message || 'Could not load stats.');
      return;
    }
    setRounds(data.rounds);
  };

  const login = async () => {
    const res = await fetch('/api/admin/stats', { headers: { 'x-admin-password': password } });
    if (res.ok) {
      setAuthenticated(true);
      setMessage('Admin unlocked.');
      await loadStats();
      return;
    }
    setMessage('Wrong password.');
  };

  const uploadImage = async (file: File) => {
    const form = new FormData();
    form.append('file', file);

    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'x-admin-password': password },
      body: form
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Upload failed');

    return data.url as string;
  };

  const onCreateRound = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const actressAFile = formData.get('actressAFile');
    const actressBFile = formData.get('actressBFile');

    let actressAImage = String(formData.get('actressAImage') || '');
    let actressBImage = String(formData.get('actressBImage') || '');

    if (actressAFile instanceof File && actressAFile.size > 0) {
      actressAImage = await uploadImage(actressAFile);
    }

    if (actressBFile instanceof File && actressBFile.size > 0) {
      actressBImage = await uploadImage(actressBFile);
    }

    const payload = {
      actressA: String(formData.get('actressA') || ''),
      actressB: String(formData.get('actressB') || ''),
      actressAImage,
      actressBImage,
      startTime: new Date().toISOString(),
      endTime: String(formData.get('endTime') || new Date().toISOString())
    };

    const response = await fetch('/api/admin/rounds', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    setMessage(data.message || (response.ok ? 'Round created.' : 'Failed creating round.'));
    if (response.ok) {
      event.currentTarget.reset();
      await loadStats();
    }
  };

  const endRound = async (roundId: string) => {
    const response = await fetch(`/api/admin/rounds/${roundId}/end`, {
      method: 'POST',
      headers: { 'x-admin-password': password }
    });

    const data = await response.json();
    setMessage(data.message || (response.ok ? 'Round ended.' : 'Failed ending round.'));
    if (response.ok) await loadStats();
  };

  if (!authenticated) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
        <div className="luxe-card w-full space-y-4 p-6">
          <h1 className="text-xl font-bold">Admin Access</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-black/20 px-3 py-3"
            placeholder="Enter admin password"
          />
          <button onClick={login} className="w-full rounded-xl bg-gold-gradient px-4 py-3 font-semibold text-noir">
            Unlock
          </button>
          {message ? <p className="text-sm">{message}</p> : null}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-8">
      <div className="luxe-card space-y-5 p-5">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <form className="grid gap-3 md:grid-cols-2" onSubmit={onCreateRound}>
          <input name="actressA" required placeholder="Actress A Name" className="rounded-xl border border-black/20 px-3 py-3" />
          <input name="actressB" required placeholder="Actress B Name" className="rounded-xl border border-black/20 px-3 py-3" />
          <input name="actressAImage" placeholder="Actress A image URL (optional)" className="rounded-xl border border-black/20 px-3 py-3" />
          <input name="actressBImage" placeholder="Actress B image URL (optional)" className="rounded-xl border border-black/20 px-3 py-3" />
          <input name="actressAFile" type="file" accept="image/*" className="rounded-xl border border-black/20 px-3 py-3" />
          <input name="actressBFile" type="file" accept="image/*" className="rounded-xl border border-black/20 px-3 py-3" />
          <input name="endTime" type="datetime-local" required className="rounded-xl border border-black/20 px-3 py-3" />
          <button type="submit" className="rounded-xl bg-gold-gradient px-4 py-3 font-semibold text-noir">
            Create Round
          </button>
        </form>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Rounds</h2>
            <button onClick={loadStats} className="rounded-full border border-noir/20 px-3 py-1 text-sm">
              Refresh
            </button>
          </div>

          <ul className="space-y-2">
            {rounds.map((round) => (
              <li key={round.id} className="rounded-2xl border border-black/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{round.actress_a} vs {round.actress_b}</p>
                    <p className="text-sm text-noir/70">Votes: {round.vote_count}</p>
                  </div>
                  {round.is_active ? (
                    <button
                      onClick={() => endRound(round.id)}
                      className="rounded-lg border border-noir/20 px-3 py-2 text-sm font-medium"
                    >
                      End Round
                    </button>
                  ) : (
                    <span className="text-sm font-medium text-noir/60">Ended</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {message ? <p className="rounded-xl bg-noir px-3 py-2 text-sm text-white">{message}</p> : null}
      </div>
    </main>
  );
}
