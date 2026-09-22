export const GUEST_SHEET_API_URL =
  'https://script.google.com/macros/s/AKfycbw4uht16XVxGakrFVNK4w2yJ88LHkC5OGpfZdpNUqHTt-NEilf6BaI2MCkGcedQFG8J/exec';

export type GuestEntry = {
  timestamp: string;
  name: string;
  email: string;
  guests: string;
  message: string;
};

export type GuestSheetData = {
  entries: GuestEntry[];
  totalGuests: number;
};

export const GUEST_SHEET_UPDATED_EVENT = 'guestSheetUpdated';

type GuestSheetCache = GuestSheetData & { fetchedAt: number };

let cache: GuestSheetCache | null = null;
let inflight: Promise<GuestSheetData> | null = null;

function parseGuestRows(rows: string[][]): GuestEntry[] {
  if (!Array.isArray(rows) || rows.length <= 1) return [];

  const header = rows[0];
  const entries = rows.slice(1);

  return entries.map((row) => {
    const rowObj: Record<string, string> = {};
    header.forEach((col, i) => {
      rowObj[col] = row[i] || '';
    });
    return {
      timestamp: rowObj['Timestamp'] || new Date().toISOString(),
      name: rowObj['Full Name'] || 'Guest',
      email: rowObj['Email'] || '',
      guests: rowObj['Number Of Guests'] || '1',
      message: rowObj['Message'] || '',
    };
  });
}

export function totalGuestsFromEntries(entries: GuestEntry[]): number {
  return entries.reduce((sum, entry) => {
    const n = parseInt(entry.guests || '0', 10);
    return sum + (Number.isNaN(n) ? 0 : n);
  }, 0);
}

export function getGuestSheetCache(): GuestSheetData | null {
  if (!cache) return null;
  return { entries: cache.entries, totalGuests: cache.totalGuests };
}

function emitGuestSheetUpdated(data: GuestSheetData) {
  window.dispatchEvent(new CustomEvent(GUEST_SHEET_UPDATED_EVENT, { detail: data }));
}

async function fetchGuestSheetFromNetwork(): Promise<GuestSheetData> {
  const response = await fetch(GUEST_SHEET_API_URL, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('Failed to fetch guest list');
  }

  const data = await response.json();

  if (!data?.GoogleSheetData) {
    return { entries: [], totalGuests: 0 };
  }

  const entries = parseGuestRows(data.GoogleSheetData as string[][]);
  return { entries, totalGuests: totalGuestsFromEntries(entries) };
}

export async function refreshGuestSheet(): Promise<GuestSheetData> {
  if (inflight) return inflight;

  inflight = fetchGuestSheetFromNetwork()
    .then((data) => {
      cache = { ...data, fetchedAt: Date.now() };
      emitGuestSheetUpdated(data);
      return data;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

/** After RSVP, Google Sheets may lag — poll quickly so count + guest book stay in sync. */
export async function pollGuestSheetAfterRsvp(
  delaysMs: number[] = [0, 600, 1500, 3500]
): Promise<GuestSheetData | null> {
  let last: GuestSheetData | null = null;

  for (const delay of delaysMs) {
    if (delay > 0) {
      await new Promise((resolve) => window.setTimeout(resolve, delay));
    }
    try {
      last = await refreshGuestSheet();
    } catch {
      /* keep trying */
    }
  }

  return last;
}

/** @deprecated Use refreshGuestSheet */
export async function fetchGuestSheet(): Promise<GuestSheetData> {
  return refreshGuestSheet();
}
