import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Calendar, MessageSquare, Heart, Sparkles, AlertCircle, Users } from 'lucide-react';
import {
  getGuestSheetCache,
  refreshGuestSheet,
  GUEST_SHEET_UPDATED_EVENT,
  type GuestEntry,
  type GuestSheetData,
} from '../lib/guestSheet';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function newestFirst(entries: GuestEntry[]): GuestEntry[] {
  return [...entries].reverse();
}

function applySheetToState(
  data: GuestSheetData,
  setGuests: React.Dispatch<React.SetStateAction<GuestEntry[]>>,
  setTotalGuests: React.Dispatch<React.SetStateAction<number>>
) {
  setGuests(newestFirst(data.entries));
  setTotalGuests(data.totalGuests);
}

const GuestBookModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const cached = getGuestSheetCache();
  const [guests, setGuests] = useState<GuestEntry[]>(() =>
    cached ? newestFirst(cached.entries) : []
  );
  const [isLoading, setIsLoading] = useState(() => !cached);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalGuests, setTotalGuests] = useState(() => cached?.totalGuests ?? 0);
  const [isVisible, setIsVisible] = useState(false);

  const loadGuests = useCallback(async (opts?: { silent?: boolean }) => {
    const hasData = Boolean(getGuestSheetCache()?.entries.length);
    if (!opts?.silent && !hasData) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const data = await refreshGuestSheet();
      applySheetToState(data, setGuests, setTotalGuests);
    } catch (err: unknown) {
      console.error('Failed to load guests:', err);
      if (!hasData) {
        const message = err instanceof Error ? err.message : 'Failed to load guest list';
        setError(message);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      const timer = window.setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = '';
      return () => window.clearTimeout(timer);
    }

    setIsVisible(true);
    document.body.style.overflow = 'hidden';

    const seed = getGuestSheetCache();
    if (seed) {
      applySheetToState(seed, setGuests, setTotalGuests);
      setIsLoading(false);
    }

    void loadGuests({ silent: Boolean(seed) });
  }, [isOpen, loadGuests]);

  useEffect(() => {
    const onSheetUpdated = (event: Event) => {
      const data = (event as CustomEvent<GuestSheetData>).detail;
      if (!data) return;
      applySheetToState(data, setGuests, setTotalGuests);
      setIsLoading(false);
      setIsRefreshing(false);
      setError(null);
    };

    window.addEventListener(GUEST_SHEET_UPDATED_EVENT, onSheetUpdated);
    return () => window.removeEventListener(GUEST_SHEET_UPDATED_EVENT, onSheetUpdated);
  }, []);

  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('') || '?';
  };

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  if (!isVisible && !isOpen) return null;

  const showList = !isLoading && !error && guests.length > 0;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="absolute inset-0 bg-[#030712]/75 backdrop-blur-md" onClick={onClose} />

      <div
        className={`relative flex h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#d4af37]/35 bg-gradient-to-b from-[#0c1424] via-[#070d18] to-[#030712] shadow-[0_24px_80px_rgba(0,0,0,0.65),0_0_40px_rgba(212,175,55,0.12)] sm:rounded-3xl transform transition-all duration-500 ${isOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-10 scale-95 opacity-0'}`}
      >
        <div className="relative border-b border-[#d4af37]/20 bg-[#0a0f1a]/80 p-3 text-center sm:p-4 md:p-6">
          {showList && (
            <div className="absolute top-2 left-2 z-10 sm:top-3 sm:left-3 md:top-4 md:left-4">
              <div className="relative group/count">
                <div className="absolute inset-0 rounded-full bg-gold/20 opacity-60 blur-md transition-opacity duration-300 group-hover/count:opacity-100" />
                <div className="relative rounded-full border border-[#d4af37]/35 bg-[#030712]/50 px-3 py-1.5 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover/count:scale-105 group-hover/count:border-[#d4af37]/55 group-hover/count:shadow-md sm:px-4 sm:py-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Users className="h-3 w-3 flex-shrink-0 text-[#d4af37] sm:h-3.5 sm:w-3.5" />
                    <span className="font-serif text-base font-bold tracking-tight text-[#fff8dc] sm:text-lg md:text-xl">
                      {totalGuests}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isRefreshing && (
            <div className="absolute top-2 left-1/2 z-10 -translate-x-1/2 sm:top-3">
              <Loader2 className="h-4 w-4 animate-spin text-[#d4af37]/80" aria-label="Updating guest list" />
            </div>
          )}

          <button
            onClick={onClose}
            className="group/close absolute top-2 right-2 z-10 rounded-full p-1.5 text-[#fff8dc]/65 transition-all duration-300 hover:bg-[#d4af37]/10 hover:text-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 focus:ring-offset-[#030712] sm:top-4 sm:right-4 md:top-6 md:right-6"
            aria-label="Close guest book"
          >
            <svg
              className="h-5 w-5 transition-transform duration-300 group-hover/close:rotate-90 sm:h-6 sm:w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="group/header mb-2 flex items-center justify-center gap-1.5 text-[#d4af37] sm:mb-3 sm:gap-2">
            <Sparkles className="h-3 w-3 transition-all duration-500 group-hover/header:rotate-12 group-hover/header:scale-110 sm:h-4 sm:w-4" />
            <span className="font-serif text-[10px] uppercase tracking-[0.28em] transition-colors duration-300 sm:text-xs">
              Guest Registry
            </span>
            <Sparkles className="h-3 w-3 transition-all duration-500 group-hover/header:-rotate-12 group-hover/header:scale-110 sm:h-4 sm:w-4" />
          </div>
          <h2 className="font-serif text-xl text-[#fffef8] [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] sm:text-2xl md:text-3xl lg:text-4xl">
            Book of Guests
          </h2>
          <p className="mt-1 font-body text-xs text-[#f5e6a8]/80 sm:mt-2 sm:text-sm md:text-base">
            See who&apos;s celebrating with us
          </p>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto p-3 sm:p-4 md:p-8">
          {isLoading ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-[#d4af37] sm:gap-5">
              <Loader2 className="h-8 w-8 animate-spin drop-shadow-sm sm:h-10 sm:w-10" />
              <span className="font-serif text-xs tracking-[0.22em] sm:text-sm">Loading guests...</span>
            </div>
          ) : error ? (
            <div className="flex h-full animate-fade-in-up flex-col items-center justify-center gap-4 text-red-400 sm:gap-5">
              <AlertCircle className="h-8 w-8 drop-shadow-sm sm:h-10 sm:w-10" />
              <span className="max-w-sm px-4 text-center font-serif text-xs tracking-widest sm:text-sm">{error}</span>
            </div>
          ) : guests.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-[#fff8dc]/60 sm:gap-5">
              <Heart className="h-10 w-10 text-[#d4af37]/40 drop-shadow-sm sm:h-12 sm:w-12 md:h-16 md:w-16" />
              <span className="font-body text-sm italic text-[#f5e6a8]/85 sm:text-base md:text-xl">Be the first to RSVP!</span>
            </div>
          ) : (
            <div className="grid gap-2.5 sm:gap-3">
              {guests.map((guest, idx) => (
                <div
                  key={`${guest.timestamp}-${guest.email}-${guest.name}-${idx}`}
                  className="group/card relative overflow-hidden rounded-lg border border-[#d4af37]/20 bg-[#030712]/45 p-2.5 backdrop-blur-sm transition-colors duration-200 hover:border-[#d4af37]/45 sm:p-3"
                >
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#d4af37]/25 bg-gradient-to-br from-[#d4af37]/20 via-[#8b6914]/25 to-[#030712] font-serif text-xs font-semibold text-[#fffef8] sm:h-11 sm:w-11 sm:text-sm">
                      {getInitials(guest.name)}
                    </div>

                    <div className="min-w-0 flex-1 flex-grow">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <h4 className="truncate font-serif text-sm font-semibold text-[#fffef8] sm:text-base">
                          {guest.name}
                        </h4>
                        <span className="flex-shrink-0 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-2 py-0.5 text-[9px] font-bold text-[#fff8dc] sm:text-[10px]">
                          {guest.guests}
                        </span>
                      </div>

                      <div className="mb-1.5 flex items-center gap-1.5 sm:mb-2">
                        <Calendar className="h-3 w-3 flex-shrink-0 text-[#fff8dc]/45" />
                        <span className="font-serif text-[10px] uppercase tracking-wider text-[#f5e6a8]/70 sm:text-[11px]">
                          {formatDate(guest.timestamp)}
                        </span>
                        <span className="text-[#d4af37]/40">•</span>
                        <span className="font-serif text-[10px] text-[#fff8dc]/50 sm:text-[11px]">
                          #{guests.length - idx}
                        </span>
                      </div>

                      {guest.message && (
                        <div className="mt-2 border-t border-[#d4af37]/15 pt-2">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#d4af37]/70 sm:h-4 sm:w-4" />
                            <p className="whitespace-pre-wrap break-words font-body text-xs leading-relaxed text-[#fffef8]/90 sm:text-sm">
                              {guest.message}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestBookModal;
