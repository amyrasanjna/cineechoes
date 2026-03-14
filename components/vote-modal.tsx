'use client';

type VoteModalProps = {
  isOpen: boolean;
  onSubmit: (payload: {
    instagramUsername?: string;
    trafficSource?: string;
    notifyOptIn: boolean;
  }) => Promise<void>;
  onSkip: () => void;
};

export function VoteModal({ isOpen, onSubmit, onSkip }: VoteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-end bg-black/40 p-4 sm:items-center sm:justify-center">
      <form
        className="luxe-card w-full max-w-md space-y-4 p-5"
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          await onSubmit({
            instagramUsername: String(formData.get('instagramUsername') || ''),
            trafficSource: String(formData.get('trafficSource') || ''),
            notifyOptIn: formData.get('notifyOptIn') === 'on'
          });
        }}
      >
        <h3 className="text-lg font-semibold">Optional details</h3>
        <p className="text-sm text-noir/70">Help us improve next rounds (optional)</p>

        <div className="space-y-3">
          <label className="block text-sm">
            Instagram Username
            <input
              type="text"
              name="instagramUsername"
              placeholder="@yourhandle"
              className="mt-1 w-full rounded-xl border border-black/15 px-3 py-3"
            />
          </label>

          <label className="block text-sm">
            Where did you find this poll?
            <select name="trafficSource" className="mt-1 w-full rounded-xl border border-black/15 px-3 py-3">
              <option value="">Select source</option>
              <option value="Instagram">Instagram</option>
              <option value="Friend">Friend</option>
              <option value="Google">Google</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="notifyOptIn" className="h-4 w-4 rounded border-black/30" />
            Notify me when next round starts
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="flex-1 rounded-xl bg-gold-gradient px-4 py-3 font-semibold text-noir">
            Save
          </button>
          <button type="button" onClick={onSkip} className="flex-1 rounded-xl border border-black/20 px-4 py-3">
            Skip
          </button>
        </div>
      </form>
    </div>
  );
}
