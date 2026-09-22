import React, { useEffect, useMemo } from 'react';

interface LoadingListProps {
  onComplete: () => void;
}

const LOADING_MS = 9000;

const WEDDING_DATE_DISPLAY = 'August 14, 2027';
const WEDDING_PLACE = 'Davao City';

/** Wedding day shown on the loading screen (local calendar date). */
const WEDDING_DAY = new Date(2027, 7, 14);

const INFINITY_PATH =
  'M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z';

function getDaysUntilWedding(from: Date, weddingDay: Date): number {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(weddingDay.getFullYear(), weddingDay.getMonth(), weddingDay.getDate());
  const diffMs = end.getTime() - start.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

const cornerDeco = [
  { src: '/deco/top-left.png', position: 'top-0 left-0', glow: 'drop-shadow-[0_0_22px_rgba(212,175,55,0.32)]' },
  { src: '/deco/top-right.png', position: 'top-0 right-0', glow: 'drop-shadow-[0_0_22px_rgba(212,175,55,0.32)]' },
  { src: '/deco/bottom-left.png', position: 'bottom-0 left-0', glow: 'drop-shadow-[0_0_26px_rgba(212,175,55,0.38)]' },
  { src: '/deco/bottom-right.png', position: 'bottom-0 right-0', glow: 'drop-shadow-[0_0_26px_rgba(212,175,55,0.38)]' },
] as const;

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

const goldText: React.CSSProperties = {
  background: 'linear-gradient(165deg, #fffef5 0%, #fceabb 12%, #f5d76e 28%, #c9a227 45%, #8b6914 52%, #e8c547 68%, #fff8dc 82%, #d4af37 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  filter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 14px rgba(255, 215, 100, 0.45))',
};

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
    variant === 'soft' ? 'loading-star-soft' : variant === 'spark' ? 'loading-star-spark' : 'loading-star-default';

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`loading-star pointer-events-none absolute z-[25] text-[#fceabb] ${variantClass}`}
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

function InfinityLoader() {
  return (
    <div className="relative mx-auto h-9 w-[4.5rem] sm:h-11 sm:w-24 md:h-12 md:w-28 lg:h-14 lg:w-32" aria-hidden>
      <svg
        className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 187.3 93.7"
      >
        <path
          d={INFINITY_PATH}
          fill="none"
          stroke="#d4af37"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          opacity={0.15}
        />
        <path
          className="loading-infinity-outline"
          d={INFINITY_PATH}
          fill="none"
          stroke="#f5e6a8"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
        />
      </svg>
    </div>
  );
}

function OrnamentalStar({ className, gradId = 'loadingStarGrad' }: { className?: string; gradId?: string }) {
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

const LoadingList: React.FC<LoadingListProps> = ({ onComplete }) => {
  const sparkles = useMemo(() => SPARKLE_LAYOUT, []);
  const daysUntil = useMemo(() => getDaysUntilWedding(new Date(), WEDDING_DAY), []);
  const daysLabel = daysUntil === 1 ? 'more day to go' : 'more days to go';

  useEffect(() => {
    const timer = setTimeout(onComplete, LOADING_MS);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start overflow-hidden md:justify-center">
      <style>{`
        @keyframes loading-twinkle {
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
        @keyframes loading-twinkle-spark {
          0%, 100% { opacity: 0.1; transform: scale(0.5); }
          40% { opacity: 0.35; transform: scale(0.75); }
          48% { opacity: 1; transform: scale(1.25); filter: drop-shadow(0 0 12px #fff8dc); }
          52% { opacity: 1; transform: scale(1.15); }
          60% { opacity: 0.4; transform: scale(0.8); }
        }
        @keyframes loading-deco-breathe {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.015); }
        }
        .loading-star {
          transform-origin: center center;
          will-change: transform, opacity, filter;
        }
        .loading-star-default {
          animation: loading-twinkle var(--dur, 3s) cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
          animation-delay: var(--delay, 0s);
        }
        .loading-star-soft {
          animation: loading-twinkle calc(var(--dur, 3s) * 1.35) cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: var(--delay, 0s);
        }
        .loading-star-spark {
          animation: loading-twinkle-spark calc(var(--dur, 3s) * 0.85) ease-in-out infinite;
          animation-delay: var(--delay, 0s);
        }
        .loading-deco-corner {
          animation: loading-deco-breathe 4s ease-in-out infinite;
        }
        .loading-infinity-outline {
          stroke-dasharray: 2.42777px, 242.77666px;
          stroke-dashoffset: 0;
          animation: loading-infinity-anim 1.6s linear infinite;
        }
        @keyframes loading-infinity-anim {
          12.5% {
            stroke-dasharray: 33.98873px, 242.77666px;
            stroke-dashoffset: -26.70543px;
          }
          43.75% {
            stroke-dasharray: 84.97183px, 242.77666px;
            stroke-dashoffset: -84.97183px;
          }
          100% {
            stroke-dasharray: 2.42777px, 242.77666px;
            stroke-dashoffset: -240.34889px;
          }
        }
        @media (min-width: 768px) {
          .loading-desktop-shell {
            justify-content: space-between;
            padding-top: clamp(1.5rem, 4vh, 3.5rem);
            padding-bottom: clamp(6.5rem, 12vh, 9rem);
            gap: clamp(0.75rem, 2vh, 1.75rem);
            max-width: min(92vw, 52rem);
          }
          .loading-desktop-header,
          .loading-desktop-footer {
            flex-shrink: 0;
            width: 100%;
          }
          .loading-desktop-hero {
            flex: 1 1 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 0;
            width: 100%;
          }
          .loading-desktop-days {
            font-size: clamp(1.0625rem, 0.55vw + 0.65rem, 1.625rem);
            letter-spacing: clamp(0.1em, 0.04em + 0.12vw, 0.16em);
          }
          .loading-desktop-label {
            font-size: clamp(0.625rem, 0.2vw + 0.48rem, 0.8125rem);
            letter-spacing: clamp(0.32em, 0.1em + 0.2vw, 0.44em);
          }
          .loading-desktop-date-value {
            font-size: clamp(0.9375rem, 0.45vw + 0.55rem, 1.375rem);
            letter-spacing: clamp(0.12em, 0.04em + 0.1vw, 0.28em);
          }
          .loading-desktop-tagline {
            font-size: clamp(0.8125rem, 0.35vw + 0.55rem, 1.0625rem);
            letter-spacing: clamp(0.12em, 0.04em + 0.1vw, 0.18em);
            max-width: min(36rem, 92%);
          }
          .loading-desktop-body {
            font-size: clamp(0.9375rem, 0.35vw + 0.62rem, 1.125rem);
            line-height: 1.55;
            max-width: min(36rem, 88%);
          }
          .loading-desktop-loader-label {
            font-size: clamp(0.6875rem, 0.22vw + 0.48rem, 0.875rem);
            letter-spacing: clamp(0.24em, 0.08em + 0.12vw, 0.36em);
          }
          .loading-desktop-img-save {
            width: min(36vw, 24rem) !important;
            max-width: 100%;
          }
          .loading-desktop-img-names {
            width: min(40vw, 32rem) !important;
            max-width: 100%;
          }
          .loading-desktop-img-forever {
            width: min(30vw, 19rem) !important;
            max-width: 100%;
          }
          .loading-desktop-details {
            max-width: min(34rem, 92%);
            padding: clamp(0.875rem, 1.2vw + 0.5rem, 1.375rem) clamp(1rem, 1.5vw + 0.5rem, 1.75rem);
          }
        }
        @media (min-width: 1280px) {
          .loading-desktop-shell {
            max-width: min(90vw, 56rem);
          }
          .loading-desktop-img-save {
            width: min(32vw, 26rem) !important;
          }
          .loading-desktop-img-names {
            width: min(36vw, 34rem) !important;
          }
        }
      `}</style>

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: 'url(/image/mobile.jpg)' }}
        aria-hidden
      />
      <div
        className="absolute inset-0 hidden bg-cover bg-[center_18%] bg-no-repeat md:block lg:bg-center"
        style={{ backgroundImage: 'url(/image/desktop.jpg)' }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 bg-[#030712]/22"
        aria-hidden
      />
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

      {cornerDeco.map(({ src, position, glow }, i) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden
          className={`loading-deco-corner pointer-events-none absolute ${position} z-20 h-auto w-[min(28vw,5.75rem)] max-[height:680px]:w-[5rem] object-contain sm:w-[min(28vw,10rem)] md:w-[min(20vw,15rem)] lg:w-[min(16vw,19rem)] xl:w-[min(14vw,22rem)] ${glow}`}
          style={{ animationDelay: `${i * 0.35}s` }}
        />
      ))}

      <div className="loading-desktop-shell relative z-30 grid min-h-[100dvh] w-full max-w-lg grid-rows-[auto_minmax(0,1fr)_auto] gap-y-0 px-2 pb-[calc(4.75rem+env(safe-area-inset-bottom))] pt-[max(0.625rem,env(safe-area-inset-top))] max-[height:680px]:gap-y-0 max-[height:680px]:pb-[calc(4.25rem+env(safe-area-inset-bottom))] sm:gap-y-1 sm:px-6 md:flex md:min-h-[100dvh] md:flex-col md:items-center md:px-12 lg:px-16">
        <div className="loading-desktop-header relative mt-8 flex w-full flex-col items-center max-[height:680px]:mt-6 sm:mt-10 md:mt-0">
          <OrnamentalStar
            gradId="loadingStarGradA"
            className="absolute -left-0.5 top-0 h-3 w-3 opacity-75 max-[height:680px]:hidden sm:-left-1 sm:h-3.5 sm:w-3.5 md:-left-10 md:-top-3 md:block md:h-7 md:w-7 lg:-left-12 lg:h-8 lg:w-8"
          />
          <OrnamentalStar
            gradId="loadingStarGradB"
            className="absolute -right-0.5 top-0 h-3 w-3 opacity-75 max-[height:680px]:hidden sm:-right-1 sm:h-3.5 sm:w-3.5 md:-right-10 md:-top-3 md:block md:h-7 md:w-7 lg:-right-12 lg:h-8 lg:w-8"
          />
          <img
            src="/image/save-the-date.png"
            alt="Save the Date"
            className="loading-desktop-img-save h-auto w-[min(78vw,11.5rem)] max-w-full object-contain drop-shadow-[0_3px_18px_rgba(0,0,0,0.7)] animate-fade-in-up max-[height:680px]:w-[min(72vw,10.5rem)] sm:w-[min(70vw,14rem)]"
          />
          <p
            className="loading-desktop-days mt-2 font-serif text-sm font-medium tabular-nums tracking-[0.12em] text-[#fff8dc] [text-shadow:0_2px_4px_rgba(0,0,0,1),0_0_12px_rgba(0,0,0,0.85),0_0_20px_rgba(212,175,55,0.35)] max-[height:680px]:mt-1.5 max-[height:680px]:text-xs sm:mt-2.5 sm:text-base md:mt-3"
          >
            {daysUntil} {daysLabel}
          </p>
        </div>

        <div className="loading-desktop-hero flex min-h-0 items-center justify-center px-0.5 py-1 max-[height:680px]:py-0 sm:px-2">
          <img
            src="/image/couple-name.png"
            alt="Sunshyne and Brandon"
            className="loading-desktop-img-names h-auto w-full max-h-[min(34dvh,11.5rem)] max-w-full object-contain object-center drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] animate-fade-in-up max-[height:680px]:max-h-[min(30dvh,10rem)] sm:max-h-[min(38dvh,14rem)] md:max-h-[min(42vh,22rem)]"
            style={{ animationDelay: '0.12s' }}
          />
        </div>

        <div className="loading-desktop-footer mx-auto -mt-3 w-full max-w-sm px-1 text-center max-[height:680px]:-mt-4 max-[height:680px]:max-w-[18rem] sm:-mt-5 sm:max-w-md md:mt-0">
          <img
            src="/image/a-beautiful-forever-is-about-to-begin.png"
            alt="A beautiful forever is about to begin"
            className="loading-desktop-img-forever mx-auto h-auto w-[min(92vw,15.5rem)] max-w-full object-contain drop-shadow-[0_0_12px_rgba(212,175,55,0.4)] max-[height:680px]:w-[min(88vw,13.5rem)] sm:w-[min(78vw,16rem)]"
          />

          <div className="loading-desktop-details mx-auto mt-3 grid max-w-md grid-cols-2 gap-3 rounded-sm border border-[#d4af37]/45 bg-[#050a14]/35 py-3 px-3 shadow-[0_0_28px_rgba(212,175,55,0.14)] max-[height:680px]:mt-2 max-[height:680px]:py-2 sm:mt-4 sm:px-4 md:mt-5">
            <div className="border-r border-[#d4af37]/25 px-2">
              <p className="loading-desktop-label font-serif text-[9px] uppercase tracking-[0.32em] text-[#f5e6a8] sm:text-[10px] sm:tracking-[0.38em]">
                Date
              </p>
              <p
                className="loading-desktop-date-value mt-1.5 font-serif text-xs uppercase leading-snug tracking-[0.12em] max-[height:680px]:mt-1 max-[height:680px]:text-[10px] sm:mt-2 sm:text-base sm:tracking-[0.18em] md:mt-2"
                style={goldText}
              >
                {WEDDING_DATE_DISPLAY}
              </p>
            </div>
            <div className="px-2">
              <p className="loading-desktop-label font-serif text-[9px] uppercase tracking-[0.32em] text-[#f5e6a8] sm:text-[10px] sm:tracking-[0.38em]">
                Place
              </p>
              <p
                className="loading-desktop-date-value mt-1.5 font-serif text-xs uppercase leading-snug tracking-[0.14em] max-[height:680px]:mt-1 max-[height:680px]:text-[10px] sm:mt-2 sm:text-base sm:tracking-[0.2em] md:mt-2"
                style={goldText}
              >
                {WEDDING_PLACE}
              </p>
            </div>
          </div>

          <p className="loading-desktop-tagline mx-auto mt-3 max-w-md font-serif text-[11px] font-medium uppercase leading-snug tracking-[0.12em] text-[#fff8dc] [text-shadow:0_2px_4px_rgba(0,0,0,0.9),0_0_12px_rgba(212,175,55,0.3)] max-[height:680px]:mt-2 max-[height:680px]:text-[10px] sm:mt-4 sm:text-sm sm:tracking-[0.14em] md:mt-5">
            The Date Is Set. The Celebration Awaits.
          </p>
          <p className="loading-desktop-body mx-auto mt-2 max-w-md font-body text-[11px] leading-snug text-[#f5e6a8]/90 max-[height:680px]:mt-1.5 max-[height:680px]:text-[10px] sm:mt-3 sm:text-sm sm:leading-relaxed md:mt-3">
            You&apos;re warmly invited to celebrate our wedding with us. Please RSVP to confirm your
            attendance.
          </p>
        </div>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center px-5 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 sm:px-8 md:px-12 md:pb-6 md:pt-3 lg:pb-8"
        role="progressbar"
        aria-valuetext="Loading invitation"
        aria-label="Loading invitation"
      >
        <p className="loading-desktop-loader-label mb-1 text-center font-serif text-[10px] uppercase tracking-[0.24em] text-[#f5e6a8]/80 sm:text-xs sm:tracking-[0.3em]">
          Opening your invitation
        </p>
        <InfinityLoader />
      </div>
    </div>
  );
};

export default LoadingList;
