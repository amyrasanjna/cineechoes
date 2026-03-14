export type Round = {
  id: string;
  actress_a: string;
  actress_b: string;
  actress_a_image: string;
  actress_b_image: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
};

export type VotePayload = {
  roundId: string;
  actressVoted: string;
  deviceId: string;
  instagramUsername?: string | null;
  trafficSource?: string | null;
  notifyOptIn?: boolean;
};

export type VoteSummary = {
  actress_a_votes: number;
  actress_b_votes: number;
  actress_a_percentage: number;
  actress_b_percentage: number;
  winner: 'actress_a' | 'actress_b' | 'tie';
};
