export type CampInfo = {
  name: string;
  description: string | null;
  location: string | null;
  startDate: Date | null;
  endDate: Date | null;
  availableSpots: number;
  currentBatch: { name: string; priceCents: number } | null;
};
