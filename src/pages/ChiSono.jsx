import { useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { COLORS, IMAGES } from '../constants';
import Contacts from '../components/Contacts';

gsap.registerPlugin(ScrollTrigger);

// ============================================================
//  SEZ. 1 — HERO CHI SONO
// ============================================================
function ChiSonoHero() {
  const { t } = useTranslation('chiSono');
  const heroRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current.querySelectorAll('.hero-anim'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative flex items-end pb-24 md:pb-32"
      style={{ minHeight: '70dvh', backgroundColor: COLORS.deep }}
    >
      {/* BG image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(/gallery/foto-deserto.jpg)` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${COLORS.deep} 0%, transparent 100%)`,
        }}
      />

      <div ref={textRef} className="relative z-10 px-6 md:px-16 max-w-5xl mx-auto w-full">
        <p
          className="hero-anim font-mono-data text-xs tracking-widest mb-6 uppercase"
          style={{ color: COLORS.gold }}
        >
          {t('hero.eyebrow')}
        </p>
        <h1 className="hero-anim leading-none mb-6">
          <span
            className="block font-outfit font-bold"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.03em', color: COLORS.white }}
          >
            {t('hero.title1')}
          </span>
          <span
            className="block"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              lineHeight: 0.95,
              color: COLORS.gold,
            }}
          >
            {t('hero.title2')}
          </span>
        </h1>
        <p
          className="hero-anim font-sans text-base md:text-lg max-w-lg"
          style={{ color: `${COLORS.white}99` }}
        >
          {t('hero.subtitle')}
        </p>
      </div>
    </section>
  );
}

// ============================================================
//  SEZ. 2 — LA STORIA (testo del cliente)
// ============================================================
function StorySection() {
  const { t } = useTranslation('chiSono');
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelector('.story-img'),
        { x: -60, opacity: 0, scale: 0.96 },
        {
          x: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.story-text'),
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 md:px-16 overflow-hidden"
      style={{ backgroundColor: COLORS.ivory }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 md:gap-x-20 md:gap-y-6">

        {/* HEADER — mobile: 1st, desktop: top-left */}
        <div className="flex flex-col gap-4 order-1 md:col-start-2 md:row-start-1 md:self-end">
          <p
            className="story-text font-mono-data text-xs tracking-widest uppercase"
            style={{ color: COLORS.gold }}
          >
            {t('story.eyebrow')}
          </p>
        </div>

        {/* IMAGE — mobile: 2nd, desktop: left column spanning rows */}
        <div className="story-img relative order-2 md:col-start-1 md:row-start-1 md:row-span-2 md:self-center">
          <div
            className="absolute -top-6 -left-6 w-48 h-48 rounded-3xl z-0"
            style={{ backgroundColor: COLORS.goldLight, opacity: 0.45 }}
          />
          <div
            className="relative z-10 rounded-4xl overflow-hidden shadow-xl"
            style={{ height: 'clamp(420px, 55vw, 580px)' }}
          >
            <img
              src="/foto-zac.jpg"
              alt={t('story.imgAlt')}
              className="w-full h-full object-cover object-center"
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{ backgroundColor: COLORS.goldDark }}
            />
          </div>
        </div>

        {/* TEXT — mobile: 3rd, desktop: right column row 2 */}
        <div className="flex flex-col gap-6 order-3 md:col-start-2 md:row-start-2 md:self-start">
          <h2
            className="story-text font-outfit font-bold leading-tight"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              color: COLORS.charcoal,
              letterSpacing: '-0.03em',
            }}
          >
            {t('story.titleBold')}{' '}
            <span
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontStyle: 'italic',
                color: COLORS.goldDark,
                fontSize: '1.15em',
              }}
            >
              {t('story.titleAccent')}
            </span>
          </h2>

          <p className="story-text font-sans text-base leading-relaxed" style={{ color: COLORS.greyMid }}>
            {t('story.p1')}
          </p>

          <p className="story-text font-sans text-base leading-relaxed" style={{ color: COLORS.greyMid }}>
            {t('story.p2')}
          </p>

          <p className="story-text font-sans text-base leading-relaxed" style={{ color: COLORS.greyMid }}>
            {t('story.p3')}
          </p>

          <div className="story-text w-12 h-px" style={{ backgroundColor: COLORS.goldLight }} />

          <a
            href="#contatti"
            className="story-text btn-magnetic inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold self-start"
            style={{ backgroundColor: COLORS.goldDark, color: COLORS.white }}
          >
            <span className="btn-bg rounded-full" style={{ backgroundColor: COLORS.deep }} />
            <span className="relative z-10">{t('story.cta')}</span>
            <ArrowRight className="relative z-10 w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}

// ============================================================
//  SEZ. 3 — COMPAGNI DI VIAGGIO (pet-friendly)
// ============================================================
function PetSection() {
  const { t } = useTranslation('chiSono');
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelector('.pet-about-img'),
        { x: -60, opacity: 0, scale: 0.96 },
        {
          x: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.pet-about-text'),
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 md:px-16 overflow-hidden"
      style={{ backgroundColor: COLORS.ivory }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 md:gap-x-20 md:gap-y-6">

        {/* HEADER — mobile: 1st, desktop: top-left */}
        <div className="flex flex-col gap-4 order-1 md:col-start-1 md:row-start-1 md:self-end">
          <p
            className="pet-about-text font-mono-data text-xs tracking-widest uppercase"
            style={{ color: COLORS.gold }}
          >
            {t('petSection.eyebrow')}
          </p>
          <h2
            className="pet-about-text font-outfit font-bold leading-tight"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              color: COLORS.charcoal,
              letterSpacing: '-0.03em',
            }}
          >
            {t('petSection.titleBold')}{' '}
            <span
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontStyle: 'italic',
                color: COLORS.goldDark,
                fontSize: '1.1em',
              }}
            >
              {t('petSection.titleAccent')}
            </span>
          </h2>
        </div>

        {/* IMAGE — mobile: 2nd, desktop: right column spanning rows */}
        <div className="pet-about-img relative order-2 md:col-start-2 md:row-start-1 md:row-span-2 md:self-center">
          <div
            className="absolute -top-6 -right-6 w-48 h-48 rounded-3xl z-0"
            style={{ backgroundColor: COLORS.goldLight, opacity: 0.45 }}
          />
          <div
            className="relative z-10 rounded-4xl overflow-hidden shadow-xl"
            style={{ height: 'clamp(380px, 50vw, 520px)' }}
          >
            <img
              src="/gallery/fra+tyrion.jpg"
              alt={t('petSection.imgAlt')}
              className="w-full h-full object-cover object-center"
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{ backgroundColor: COLORS.goldDark }}
            />
          </div>
        </div>

        {/* TEXT — mobile: 3rd, desktop: left column row 2 */}
        <div className="flex flex-col gap-6 order-3 md:col-start-1 md:row-start-2 md:self-start">
          <p className="pet-about-text font-sans text-base leading-relaxed" style={{ color: COLORS.greyMid }}>
            {t('petSection.desc')}
          </p>

          <div className="pet-about-text w-12 h-px" style={{ backgroundColor: COLORS.goldLight }} />

          <a
            href="/#petfriendly"
            className="pet-about-text btn-magnetic inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold self-start"
            style={{ backgroundColor: COLORS.goldDark, color: COLORS.white }}
          >
            <span className="btn-bg rounded-full" style={{ backgroundColor: COLORS.deep }} />
            <span className="relative z-10">{t('petSection.cta')}</span>
            <ArrowRight className="relative z-10 w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}

// ============================================================
//  SEZ. 4 — L'APPROCCIO + TIMELINE
// ============================================================
function ApproachSection() {
  const { t } = useTranslation('chiSono');
  const sectionRef = useRef(null);

  const timelineSteps = useMemo(() => {
    const steps = t('approach.steps', { returnObjects: true });
    return steps.map((step, i) => ({
      num: String(i + 1).padStart(2, '0'),
      title: step.title,
      desc: step.desc,
    }));
  }, [t]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.approach-text'),
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      );
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.timeline-card'),
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current.querySelector('.timeline-wrap'), start: 'top 75%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 md:px-16"
      style={{ backgroundColor: COLORS.ivory }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p
            className="approach-text font-mono-data text-xs tracking-widest uppercase mb-4"
            style={{ color: COLORS.gold }}
          >
            {t('approach.eyebrow')}
          </p>
          <h2
            className="approach-text font-outfit font-bold leading-tight mb-6"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: COLORS.charcoal,
              letterSpacing: '-0.03em',
            }}
          >
            {t('approach.titleBold')}{' '}
            <span
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontStyle: 'italic',
                color: COLORS.goldDark,
                fontSize: '1.15em',
              }}
            >
              {t('approach.titleAccent')}
            </span>
          </h2>
          <p className="approach-text font-sans text-base leading-relaxed" style={{ color: COLORS.greyMid }}>
            {t('approach.desc')}
          </p>
        </div>

        {/* Timeline — horizontal desktop, vertical mobile */}
        <div className="timeline-wrap relative">
          {/* Desktop: horizontal line */}
          <div className="hidden md:block absolute top-14 left-0 right-0 h-px" style={{ backgroundColor: COLORS.goldLight }} />

          <div className="grid md:grid-cols-4 gap-8 md:gap-6">
            {timelineSteps.map((step, i) => (
              <div key={step.num} className="timeline-card relative flex md:flex-col gap-4 md:gap-0">
                {/* Mobile: vertical line connector */}
                {i < timelineSteps.length - 1 && (
                  <div className="md:hidden absolute left-3.5 top-8 bottom-0 w-px" style={{ backgroundColor: COLORS.goldLight }} />
                )}

                {/* Dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center md:mb-8"
                    style={{ borderColor: COLORS.goldDark, backgroundColor: COLORS.ivory }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.goldDark }} />
                  </div>
                </div>

                {/* Content */}
                <div className="pb-8 md:pb-0">
                  <span className="font-mono-data text-xs tracking-widest block mb-2" style={{ color: COLORS.gold }}>
                    {step.num}
                  </span>
                  <h3 className="font-outfit font-bold text-lg mb-2" style={{ color: COLORS.charcoal, letterSpacing: '-0.02em' }}>
                    {step.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: COLORS.greyMid }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
//  SEZ. 5 — STATEMENT / CHIUSURA
// ============================================================
function StatementSection() {
  const { t } = useTranslation('chiSono');
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.statement-anim'),
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 md:px-16 overflow-hidden"
      style={{ backgroundColor: COLORS.deep }}
    >
      <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${IMAGES.philosophy})` }} />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="statement-anim leading-none mb-4">
          <span
            className="block font-outfit font-bold"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-0.02em', color: COLORS.white }}
          >
            {t('statement.title')}
          </span>
        </h2>
        <p
          className="statement-anim block mb-12"
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: 'italic',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            color: COLORS.gold,
            lineHeight: 1.3,
          }}
        >
          {t('statement.subtitle')}
        </p>
        <a
          href="#contatti"
          className="statement-anim btn-magnetic inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold"
          style={{ backgroundColor: COLORS.goldDark, color: COLORS.white }}
        >
          <span className="btn-bg rounded-full" style={{ backgroundColor: COLORS.deep }} />
          <span className="relative z-10">{t('statement.cta')}</span>
          <ArrowRight className="relative z-10 w-4 h-4" />
        </a>
      </div>
    </section>
  );
}

// ============================================================
//  PAGE ROOT
// ============================================================
export default function ChiSonoPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <ChiSonoHero />
      <StorySection />
      <PetSection />
      <ApproachSection />
      <StatementSection />
      <Contacts />
    </>
  );
}
