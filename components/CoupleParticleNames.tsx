import React, { useEffect, useMemo, useState } from 'react';
import ParticleText from './ParticleText';

const NAME_FONT = '"Prata", "Cormorant Garamond", Georgia, serif';

interface Props {
  bride: string;
  groom: string;
  className?: string;
  style?: React.CSSProperties;
}

const CoupleParticleNames: React.FC<Props> = ({ bride, groom, className = '', style }) => {
  const particleText = `${bride}\nand\n${groom}`;
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const particleConfig = useMemo(
    () =>
      isMobile
        ? {
            fontSize: 'clamp(4.25rem, min(28vw, 12.5dvh), 8.5rem)',
            particleSize: 1.25,
            density: 2,
            scatter: 240,
            scatterMode: 'viewport' as const,
            gatherDuration: 3400,
            stagger: 780,
            idleDrift: 0.12,
            glow: true,
            glowBlur: 12,
            particleBudgetDivisor: 24,
            maxParticleCount: 9200,
            sampleAlphaMin: 28,
          }
        : {
            fontSize: 'clamp(5.25rem, min(11.5vw, 14dvh), 12.5rem)',
            particleSize: 2.25,
            density: 2,
            scatter: 110,
            scatterMode: 'radial' as const,
            gatherDuration: 2100,
            stagger: 480,
            idleDrift: 0.25,
            glow: true,
            glowBlur: undefined,
            particleBudgetDivisor: undefined,
            maxParticleCount: undefined,
            sampleAlphaMin: undefined,
          },
    [isMobile]
  );

  return (
    <>
      <style>{`
        .couple-particle-names {
          align-items: center;
          justify-content: center;
          margin-inline: auto;
        }
        .couple-particle-names__canvas {
          width: 100%;
          height: 100%;
          min-height: 12rem;
          max-height: min(36dvh, 100%);
          margin-inline: auto;
          transform: translateY(clamp(-1.25rem, -3.5vh, -2.75rem));
        }
        @media (min-width: 768px) {
          .couple-particle-names__canvas {
            min-height: 14rem;
            max-height: min(42dvh, 100%);
          }
        }
        @media (max-height: 740px) {
          .couple-particle-names__canvas {
            min-height: 7.5rem;
            max-height: min(28dvh, 100%);
          }
        }
        @media (max-width: 767px) {
          .couple-particle-names--fullscreen {
            position: fixed;
            inset: 0;
            z-index: 35;
            width: 100vw;
            height: 100dvh;
            max-width: none;
            pointer-events: none;
          }
          .couple-particle-names--fullscreen .couple-particle-names__canvas {
            width: 100vw;
            height: 100dvh;
            min-height: 100dvh;
            max-height: none;
            transform: translateY(clamp(-2.5rem, -10vh, -5.5rem));
          }
        }
      `}</style>
      <div
        className={`couple-particle-names flex h-full min-h-0 w-full max-w-[min(98vw,52rem)] flex-col items-center justify-center font-serif ${isMobile ? 'couple-particle-names--fullscreen' : ''} ${className}`}
        style={style}
      >
        <ParticleText
          key={isMobile ? 'mobile' : 'desktop'}
          text={particleText}
          particleSize={particleConfig.particleSize}
          density={particleConfig.density}
          color="#fffef8"
          highlightColor="#fff8dc"
          scatter={particleConfig.scatter}
          scatterMode={particleConfig.scatterMode}
          gatherDuration={particleConfig.gatherDuration}
          stagger={particleConfig.stagger}
          pointerRepel={0}
          repelRadius={0}
          idleDrift={particleConfig.idleDrift}
          trigger="mount"
          interactive={false}
          fontSize={particleConfig.fontSize}
          fontWeight={700}
          fontFamily={NAME_FONT}
          glow={particleConfig.glow}
          glowBlur={particleConfig.glowBlur}
          particleBudgetDivisor={particleConfig.particleBudgetDivisor}
          maxParticleCount={particleConfig.maxParticleCount}
          sampleAlphaMin={particleConfig.sampleAlphaMin}
          className="particle-text--compact couple-particle-names__canvas pointer-events-none"
          style={isMobile ? { width: '100vw', height: '100dvh' } : { width: '100%' }}
        />
      </div>
    </>
  );
};

export default CoupleParticleNames;
