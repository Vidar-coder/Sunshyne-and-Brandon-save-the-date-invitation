import React, { useEffect, useMemo, useRef, useState } from 'react';
import { InvitationDetails } from '../types';
import { Users } from 'lucide-react';
import CoupleParticleNames from './CoupleParticleNames';

interface Props {
  details: InvitationDetails;
  onRSVP: () => void;
  guestCount: number | null;
  onViewGuestBook: () => void;
}

const INVITE_STARFIELD_VIDEO = encodeURI(
  '/Fast Motion Night Full of Stars 4K Relaxing Screensaver 3 online video cutter com - Vlogs Ysu (1080p) (online-video-cutter.com).mp4'
);

const SPARKLE_LAYOUT = [
  { top: '5%', left: '16%', size: 8, delay: 0, dur: 2.8 },
  { top: '10%', left: '74%', size: 11, delay: 0.6, dur: 3.4 },
  { top: '20%', left: '6%', size: 7, delay: 1.1, dur: 2.5 },
  { top: '16%', left: '90%', size: 9, delay: 0.3, dur: 3.1 },
  { top: '32%', left: '3%', size: 7, delay: 1.8, dur: 2.9 },
  { top: '38%', left: '95%', size: 10, delay: 0.9, dur: 3.6 },
  { top: '56%', left: '10%', size: 10, delay: 0.2, dur: 3.2 },
  { top: '52%', left: '84%', size: 8, delay: 1.4, dur: 2.7 },
  { top: '70%', left: '5%', size: 9, delay: 0.7, dur: 3.5 },
  { top: '66%', left: '92%', size: 12, delay: 1.2, dur: 2.6 },
  { top: '84%', left: '24%', size: 9, delay: 0.5, dur: 3.3 },
  { top: '80%', left: '64%', size: 7, delay: 1.6, dur: 2.4 },
  { top: '90%', left: '44%', size: 10, delay: 0.8, dur: 3.8 },
  { top: '24%', left: '46%', size: 6, delay: 2, dur: 2.2 },
  { top: '46%', left: '22%', size: 5, delay: 1.3, dur: 2.1 },
  { top: '48%', left: '72%', size: 6, delay: 1.9, dur: 2.3 },
  { top: '13%', left: '40%', size: 7, delay: 0.4, dur: 3 },
  { top: '60%', left: '50%', size: 6, delay: 1.1, dur: 2.8 },
  { top: '93%', left: '16%', size: 9, delay: 0.6, dur: 3.4 },
  { top: '95%', left: '80%', size: 8, delay: 1.5, dur: 3.1 },
] as const;

/** Midnight of the wedding day in the Philippines. */
const WEDDING_AT = new Date('2027-08-14T00:00:00+08:00');

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  arrived: boolean;
};

function getTimeLeft(from: Date, target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - from.getTime());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    arrived: diff <= 0,
  };
}

function padUnit(value: number, size = 2) {
  return String(value).padStart(size, '0');
}

function SparkleStar({
  top,
  left,
  size,
  delay,
  dur,
  variant = 'default',
}: {
  top: string;
  left: string;
  size: number;
  delay: number;
  dur: number;
  variant?: 'default' | 'soft' | 'spark';
}) {
  const variantClass =
    variant === 'soft' ? 'invite-star-soft' : variant === 'spark' ? 'invite-star-spark' : 'invite-star-default';

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`invite-star pointer-events-none absolute z-[25] text-[#fceabb] ${variantClass}`}
      style={
        {
          top,
          left,
          width: size,
          height: size,
          '--delay': `${delay}s`,
          '--dur': `${dur}s`,
        } as React.CSSProperties
      }
    >
      <path
        fill="currentColor"
        d="M12 0.5l2.2 7.4L22 10l-7.8 2.1L12 20l-2.2-7.9L2 10l7.8-2.1L12 0.5z"
      />
      <path fill="#fff8dc" opacity="0.85" d="M12 4l1.1 3.8L17 9l-3.9 1.1L12 14l-1.1-3.9L7 9l3.9-1.2L12 4z" />
    </svg>
  );
}

function CountdownUnit({ value, label, digits = 2 }: { value: number; label: string; digits?: number }) {
  const display = padUnit(value, digits);

  return (
    <div className="invite-count-unit relative flex flex-col items-center">
      <span
        key={display}
        className="invite-tick invite-count-num font-serif font-semibold tabular-nums leading-none text-[#fffef8] [text-shadow:0_1px_2px_rgba(0,0,0,0.5),0_0_18px_rgba(255,248,220,0.45)]"
      >
        {display}
      </span>
      <span className="invite-count-label mt-1.5 font-serif uppercase text-[#fff8dc] sm:mt-2">
        {label}
      </span>
    </div>
  );
}

function CountdownColon() {
  return (
    <span className="invite-colon invite-count-colon select-none font-serif text-[#fceabb]" aria-hidden>
      :
    </span>
  );
}

function OrnamentalStar({ className, gradId = 'inviteStarGrad' }: { className?: string; gradId?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff8dc" />
          <stop offset="45%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#f5e6a8" />
        </linearGradient>
      </defs>
      <path fill={`url(#${gradId})`} d="M12 1l2.5 8.2L22 11.5l-7.5 2.3L12 22l-2.5-8.2L2 11.5l7.5-2.3L12 1z" />
    </svg>
  );
}

const InvitationCard: React.FC<Props> = ({ details, onRSVP, guestCount, onViewGuestBook }) => {
  const sparkles = useMemo(() => SPARKLE_LAYOUT, []);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(new Date(), WEDDING_AT));

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft(new Date(), WEDDING_AT));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const video = bgVideoRef.current;
    if (!video) return;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.defaultMuted = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const ensurePlaying = () => {
      if (document.visibilityState === 'hidden') return;

      if (video.ended) {
        video.currentTime = 0;
      }

      if (video.paused) {
        void video.play().catch(() => {
          /* may need a user gesture first; interaction handlers will retry */
        });
      }
    };

    const onVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        ensurePlaying();
      }
    };

    const onVideoPause = () => {
      window.requestAnimationFrame(ensurePlaying);
    };

    const onVideoEnded = () => {
      video.currentTime = 0;
      ensurePlaying();
    };

    ensurePlaying();

    video.addEventListener('loadeddata', ensurePlaying);
    video.addEventListener('canplay', ensurePlaying);
    video.addEventListener('ended', onVideoEnded);
    video.addEventListener('pause', onVideoPause);

    document.addEventListener('visibilitychange', onVisibilityOrFocus);
    window.addEventListener('focus', onVisibilityOrFocus);
    document.addEventListener('pointerdown', ensurePlaying, { capture: true });
    document.addEventListener('touchstart', ensurePlaying, { capture: true, passive: true });

    const watchdog = window.setInterval(ensurePlaying, 2500);

    return () => {
      window.clearInterval(watchdog);
      video.removeEventListener('loadeddata', ensurePlaying);
      video.removeEventListener('canplay', ensurePlaying);
      video.removeEventListener('ended', onVideoEnded);
      video.removeEventListener('pause', onVideoPause);
      document.removeEventListener('visibilitychange', onVisibilityOrFocus);
      window.removeEventListener('focus', onVisibilityOrFocus);
      document.removeEventListener('pointerdown', ensurePlaying, true);
      document.removeEventListener('touchstart', ensurePlaying, true);
    };
  }, []);

  const countdownLabel = timeLeft.arrived ? 'Forever begins today' : 'Until we say I do';
  const liveCountdown = timeLeft.arrived
    ? 'The wedding day is here'
    : `${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, and ${timeLeft.seconds} seconds until the wedding`;

  return (
    <div className="relative h-full max-h-[100dvh] w-full overflow-hidden">
      <style>{`
        @keyframes invite-twinkle {
          0%, 100% {
            opacity: 0.15;
            transform: scale(0.6) rotate(0deg);
            filter: drop-shadow(0 0 1px rgba(255, 248, 220, 0.15));
          }
          30% {
            opacity: 0.55;
            transform: scale(0.88) rotate(10deg);
            filter: drop-shadow(0 0 3px rgba(255, 248, 220, 0.35));
          }
          50% {
            opacity: 1;
            transform: scale(1.12) rotate(22deg);
            filter: drop-shadow(0 0 8px rgba(255, 248, 220, 0.95)) drop-shadow(0 0 14px rgba(212, 175, 55, 0.45));
          }
          70% {
            opacity: 0.65;
            transform: scale(0.92) rotate(8deg);
            filter: drop-shadow(0 0 4px rgba(255, 248, 220, 0.4));
          }
        }
        @keyframes invite-twinkle-spark {
          0%, 100% { opacity: 0.1; transform: scale(0.5); }
          40% { opacity: 0.35; transform: scale(0.75); }
          48% { opacity: 1; transform: scale(1.25); filter: drop-shadow(0 0 12px #fff8dc); }
          52% { opacity: 1; transform: scale(1.15); }
          60% { opacity: 0.4; transform: scale(0.8); }
        }
        .invite-star {
          transform-origin: center center;
          will-change: transform, opacity, filter;
        }
        .invite-star-default {
          animation: invite-twinkle var(--dur, 3s) cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
          animation-delay: var(--delay, 0s);
        }
        .invite-star-soft {
          animation: invite-twinkle calc(var(--dur, 3s) * 1.35) cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: var(--delay, 0s);
        }
        .invite-star-spark {
          animation: invite-twinkle-spark calc(var(--dur, 3s) * 0.85) ease-in-out infinite;
          animation-delay: var(--delay, 0s);
        }
        @keyframes invite-tick {
          0% { transform: translateY(6px); opacity: 0.35; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .invite-tick {
          display: inline-block;
          animation: invite-tick 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        @keyframes invite-colon-pulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 1; }
        }
        .invite-colon {
          animation: invite-colon-pulse 1s steps(1, end) infinite;
        }
        .invite-count-unit {
          min-width: clamp(2.6rem, 8vw, 3.4rem);
          padding: 0.4rem 0.2rem;
        }
        .invite-count-num {
          font-size: clamp(1.35rem, 4.2vw + 0.35rem, 1.85rem);
        }
        .invite-count-label {
          font-size: clamp(0.4375rem, 0.15vw + 0.4rem, 0.5625rem);
          letter-spacing: 0.28em;
        }
        .invite-count-colon {
          margin-bottom: 0.85rem;
          font-size: clamp(0.95rem, 1.6vw + 0.4rem, 1.25rem);
        }
        .invite-desktop-header {
          padding-top: clamp(1.35rem, 5vh, 2.75rem);
        }
        .invite-desktop-img-save {
          margin-top: clamp(2rem, 6.5vh, 4rem);
        }
        .invite-kicker {
          font-size: clamp(0.625rem, 0.2vw + 0.55rem, 0.8125rem);
          letter-spacing: clamp(0.22em, 0.08em + 0.18vw, 0.34em);
        }
        @media (max-width: 767px) {
          .invite-kicker {
            margin-top: clamp(1.25rem, 3.75vh, 2rem);
            margin-bottom: clamp(0.35rem, 1.2vh, 0.65rem);
            padding-inline: clamp(0.85rem, 6vw, 1.5rem);
            max-width: min(22rem, 92vw);
          }
        }
        @media (min-width: 768px) {
          .invite-kicker {
            margin-top: clamp(0.5rem, 1.2vh, 0.85rem);
            padding-inline: 0;
          }
        }
        .invite-count-heading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(0.15rem, 0.45vh, 0.35rem);
        }
        .invite-beauty-beast-img {
          width: min(42vw, 5.25rem);
          height: auto;
          margin-inline: auto;
          object-fit: contain;
          transform: translateY(clamp(-0.35rem, -1.1vh, -0.7rem));
          filter: brightness(0) invert(1) drop-shadow(0 1px 8px rgba(255, 255, 255, 0.2));
          opacity: 0.95;
        }
        @media (min-width: 768px) {
          .invite-beauty-beast-img {
            width: min(18vw, 6.5rem);
          }
        }
        .invite-count-eyebrow {
          font-size: clamp(0.5625rem, 0.18vw + 0.48rem, 0.75rem);
          letter-spacing: clamp(0.28em, 0.1em + 0.2vw, 0.42em);
          color: #fffef8;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55), 0 0 12px rgba(255, 255, 255, 0.15);
        }
        .invite-date-line {
          font-size: clamp(0.6875rem, 0.25vw + 0.55rem, 1rem);
          letter-spacing: clamp(0.12em, 0.04em + 0.12vw, 0.22em);
        }
        .invite-rsvp-block {
          gap: clamp(0.75rem, 2.2vh, 1.35rem);
          margin-top: clamp(0.85rem, 2.5vh, 1.5rem);
        }
        .invite-guest-count {
          margin-top: clamp(0.85rem, 2.2vh, 1.35rem);
          margin-bottom: clamp(0.85rem, 3vh, 1.75rem);
        }
        .invite-btn-rsvp {
          font-family: "Prata", "Cormorant Garamond", Georgia, serif;
          font-size: clamp(0.6875rem, 0.2vw + 0.58rem, 0.875rem);
          letter-spacing: clamp(0.24em, 0.08em + 0.18vw, 0.32em);
          padding: clamp(0.65rem, 1.6vh, 0.85rem) clamp(2rem, 8vw, 3.25rem);
        }
        .invite-btn-guest {
          font-family: "Prata", "Cormorant Garamond", Georgia, serif;
          font-size: clamp(0.6875rem, 0.18vw + 0.55rem, 0.9375rem);
          letter-spacing: clamp(0.14em, 0.05em + 0.1vw, 0.2em);
          color: #fffef8;
          border: 1px solid rgba(212, 175, 55, 0.42);
          background: rgba(3, 7, 18, 0.45);
          padding: clamp(0.45rem, 1.2vh, 0.65rem) clamp(0.85rem, 3vw, 1.25rem);
          border-radius: 9999px;
          box-shadow: 0 0 18px rgba(212, 175, 55, 0.08);
        }
        .invite-btn-guest:hover {
          color: #fff8dc;
          border-color: rgba(212, 175, 55, 0.65);
          background: rgba(212, 175, 55, 0.12);
          box-shadow: 0 0 22px rgba(212, 175, 55, 0.18);
        }
        .invite-desktop-shell {
          height: 100%;
          max-height: 100dvh;
          overflow: hidden;
          justify-content: space-between;
          gap: clamp(0.2rem, 1vh, 0.85rem);
          padding-top: max(0.5rem, env(safe-area-inset-top));
          padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
        }
        @media (min-width: 768px) {
          .invite-desktop-shell {
            padding-top: clamp(0.75rem, 2.5vh, 2rem);
            padding-bottom: clamp(0.75rem, 2.5vh, 2rem);
            gap: clamp(0.35rem, 1.2vh, 1rem);
            max-width: min(86vw, 54rem);
          }
          .invite-desktop-header,
          .invite-desktop-footer {
            flex-shrink: 0;
            width: 100%;
          }
          .invite-desktop-hero {
            flex: 1 1 auto;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            min-height: 0;
            width: 100%;
            padding-top: clamp(0.25rem, 1.5vh, 1rem);
          }
          .invite-desktop-header {
            padding-top: clamp(1.35rem, 4vh, 2.75rem);
          }
          .invite-desktop-img-save {
            width: min(28vw, 20rem) !important;
            max-width: 100%;
            margin-top: clamp(1.75rem, 4.5vh, 3.25rem);
          }
          .invite-count-unit {
            min-width: clamp(4.25rem, 5.5vw, 6.25rem);
            padding: clamp(0.35rem, 0.8vh, 0.75rem) clamp(0.35rem, 0.8vw, 0.85rem);
          }
          .invite-count-num {
            font-size: clamp(2.15rem, 2.2vw + 1.1rem, 3.5rem);
          }
          .invite-count-label {
            font-size: clamp(0.5625rem, 0.12vw + 0.5rem, 0.75rem);
            letter-spacing: clamp(0.28em, 0.08em + 0.16vw, 0.4em);
          }
          .invite-count-colon {
            margin-bottom: clamp(1rem, 1.6vh, 1.35rem);
            font-size: clamp(1.25rem, 1.2vw + 0.6rem, 1.85rem);
          }
        }
        @media (min-width: 1280px) {
          .invite-desktop-shell {
            max-width: min(78vw, 58rem);
            padding-top: clamp(1.75rem, 5vh, 3.5rem);
            padding-bottom: clamp(1.5rem, 4.5vh, 3.25rem);
          }
          .invite-desktop-img-save {
            width: min(24vw, 22rem) !important;
            margin-top: clamp(2rem, 4.75vh, 3.5rem);
          }
        }
        @media (max-height: 740px) {
          .invite-desktop-header {
            margin-top: 0 !important;
            padding-top: clamp(0.35rem, 1.2vh, 0.65rem) !important;
          }
          .invite-desktop-img-save {
            width: min(62vw, 9.5rem) !important;
            margin-top: clamp(1rem, 3vh, 1.5rem) !important;
          }
          .invite-kicker {
            margin-top: clamp(0.75rem, 2.25vh, 1.15rem) !important;
            font-size: 0.5625rem !important;
          }
          .invite-count-num {
            font-size: clamp(1.1rem, 3.6vw + 0.25rem, 1.45rem) !important;
          }
          .invite-count-unit {
            min-width: 2.35rem !important;
            padding: 0.2rem 0.1rem !important;
          }
          .invite-count-colon {
            margin-bottom: 0.55rem !important;
            font-size: 0.85rem !important;
          }
          .invite-date-line {
            margin-top: 0.35rem !important;
            font-size: 0.625rem !important;
          }
          .invite-rsvp-block {
            margin-top: 0.35rem !important;
          }
        }
        @media (min-width: 768px) and (max-height: 820px) {
          .invite-desktop-shell {
            padding-top: clamp(0.5rem, 1.5vh, 1rem);
            padding-bottom: clamp(0.5rem, 1.5vh, 1rem);
            gap: clamp(0.25rem, 0.8vh, 0.65rem);
          }
          .invite-desktop-img-save {
            width: min(22vw, 16rem) !important;
          }
          .invite-count-num {
            font-size: clamp(1.75rem, 1.6vw + 0.9rem, 2.6rem);
          }
          .invite-count-unit {
            min-width: clamp(3.5rem, 4.5vw, 5rem);
            padding: 0.25rem 0.4rem;
          }
        }
        .invite-bg-video {
          object-fit: cover;
          object-position: center;
          width: 100%;
          height: 100%;
        }
      `}</style>

      <video
        ref={bgVideoRef}
        className="invite-bg-video pointer-events-none absolute inset-0 z-0 h-full w-full bg-[#030712]"
        src={INVITE_STARFIELD_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 bg-[#030712]/22" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_42%,rgba(255,215,100,0.05),transparent_58%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#030712]/55 via-[#030712]/28 to-[#030712]/62"
        aria-hidden
      />

      {sparkles.map((star, i) => (
        <SparkleStar
          key={i}
          {...star}
          variant={i % 5 === 0 ? 'spark' : i % 2 === 0 ? 'soft' : 'default'}
        />
      ))}

      <div className="invite-desktop-shell relative z-30 mx-auto flex w-full max-w-lg flex-col items-center px-3 sm:px-8 md:max-w-none md:px-16 lg:px-20 xl:px-24">
        <div className="invite-desktop-header relative flex w-full shrink-0 flex-col items-center">
          <OrnamentalStar
            gradId="inviteStarGradA"
            className="absolute -left-0.5 top-0 h-3 w-3 opacity-75 max-[height:680px]:hidden sm:-left-1 sm:h-3.5 sm:w-3.5 md:-left-10 md:-top-3 md:block md:h-7 md:w-7 lg:-left-14 lg:h-8 lg:w-8 xl:-left-16"
          />
          <OrnamentalStar
            gradId="inviteStarGradB"
            className="absolute -right-0.5 top-0 h-3 w-3 opacity-75 max-[height:680px]:hidden sm:-right-1 sm:h-3.5 sm:w-3.5 md:-right-10 md:-top-3 md:block md:h-7 md:w-7 lg:-right-14 lg:h-8 lg:w-8 xl:-right-16"
          />
          <img
            src="/image/save-the-date.png"
            alt="Save the Date"
            className="invite-desktop-img-save h-auto w-[min(68vw,10.5rem)] max-w-full object-contain drop-shadow-[0_3px_18px_rgba(0,0,0,0.7)] animate-fade-in-up sm:w-[min(52vw,14rem)] md:w-[min(28vw,18rem)]"
          />
          <p className="invite-kicker max-w-md text-center font-serif uppercase tracking-[0.26em] text-[#fff8dc] [text-shadow:0_1px_3px_rgba(0,0,0,0.85)] animate-fade-in-up sm:tracking-[0.3em]">
            With joy, we invite you
          </p>
        </div>

        <div className="invite-desktop-hero flex min-h-0 w-full flex-1 items-start justify-center overflow-hidden px-2 pt-1 sm:px-4 sm:pt-2 md:px-6 md:items-start">
          <CoupleParticleNames
            bride={details.bride}
            groom={details.groom}
            className="animate-fade-in-up h-full w-full"
            style={{ animationDelay: '0.15s' }}
          />
        </div>

        <div className="invite-desktop-footer mx-auto w-full max-w-sm shrink-0 px-1 text-center sm:max-w-xl md:max-w-3xl lg:max-w-4xl">
          <div
            className="animate-fade-in-up mx-auto w-full"
            style={{ animationDelay: '0.28s' }}
          >
            <div className="invite-count-heading">
              <img
                src="/image/beauty-and-beast.png"
                alt=""
                aria-hidden
                className="invite-beauty-beast-img block"
              />
              <p className="invite-count-eyebrow font-serif uppercase tracking-[0.38em]">
                {countdownLabel}
              </p>
            </div>
            <div
              className="relative mx-auto mt-1 flex w-full max-w-full items-center justify-center gap-0 sm:mt-1.5 md:mt-2 md:gap-1 lg:gap-2"
              role="timer"
              aria-label={liveCountdown}
            >
              <CountdownUnit value={timeLeft.days} label="Days" digits={timeLeft.days >= 100 ? 3 : 2} />
              <CountdownColon />
              <CountdownUnit value={timeLeft.hours} label="Hours" />
              <CountdownColon />
              <CountdownUnit value={timeLeft.minutes} label="Minutes" />
              <CountdownColon />
              <CountdownUnit value={timeLeft.seconds} label="Seconds" />
            </div>
            <p className="invite-date-line mt-1.5 font-serif uppercase text-[#fffef8] [text-shadow:0_1px_2px_rgba(0,0,0,0.5),0_0_14px_rgba(255,248,220,0.3)] sm:mt-2">
              {details.date} · {details.location}
            </p>
          </div>

          <div className="invite-rsvp-block animate-fade-in-up flex flex-col items-center" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={onRSVP}
              className="invite-btn-rsvp group/btn relative isolate overflow-hidden rounded-sm bg-gradient-to-br from-[#d4af37] via-[#c9a227] to-[#8b6914] uppercase text-[#1a1408] shadow-lg shadow-[#d4af37]/25 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#d4af37]/40 focus:outline-none focus:ring-2 focus:ring-[#f5e6a8] focus:ring-offset-2 focus:ring-offset-[#030712] active:translate-y-0"
              aria-label={`RSVP to ${details.bride} and ${details.groom}'s wedding`}
            >
              <span className="absolute inset-0 -z-10 bg-gradient-to-br from-[#d4af37] via-[#c9a227] to-[#8b6914] transition-colors duration-500 group-hover/btn:from-[#fff8dc] group-hover/btn:via-[#f5d76e] group-hover/btn:to-[#d4af37]" />
              <span className="relative z-10">RSVP Now</span>
              <span className="pointer-events-none absolute -inset-1 rounded-sm bg-[#d4af37]/40 opacity-0 blur-md transition-opacity duration-500 group-hover/btn:opacity-100" />
            </button>
          </div>

          {guestCount !== null && (
            <button
              type="button"
              onClick={onViewGuestBook}
              className="invite-guest-count invite-btn-guest inline-flex items-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 focus:ring-offset-[#030712] sm:gap-2.5"
              aria-label={
                guestCount === 0
                  ? 'Open guest book and be among the first to celebrate'
                  : `Open guest book. ${guestCount} ${guestCount === 1 ? 'guest has' : 'guests have'} confirmed`
              }
            >
              <Users className="h-3.5 w-3.5 text-[#d4af37] sm:h-4 sm:w-4 md:h-5 md:w-5" />
              <span>
                {guestCount === 0
                  ? 'Be among the first to celebrate'
                  : `${guestCount} ${guestCount === 1 ? 'guest has' : 'guests have'} confirmed`}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvitationCard;
