export type BatchInfo = {
  id: string;
  name: string;
  startsAt: Date | string | null;
  endsAt: Date | string | null;
  isCurrent: boolean;
  priceCents: number | null;
};

export type CampInfo = {
  name: string;
  description: string | null;
  location: string | null;
  startDate: Date | null;
  endDate: Date | null;
  availableSpots: number;
  currentBatch: { name: string; priceCents: number } | null;
  batches?: BatchInfo[];
};
