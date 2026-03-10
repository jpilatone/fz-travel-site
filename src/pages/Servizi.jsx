import { useEffect, useRef, useState, useMemo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { COLORS, IMAGES } from '../constants';
import Contacts from '../components/Contacts';

gsap.registerPlugin(ScrollTrigger);

// ============================================================
//  HOOK — useMediaQuery
// ============================================================
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  return matches;
}

// ============================================================
//  SEZ. 1 — HERO SERVIZI
// ============================================================
function ServicesHero() {
  const { t } = useTranslation('servizi');
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
      className="relative flex items-end pb-28 md:pb-36"
      style={{ minHeight: '75dvh', backgroundColor: COLORS.deep }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${IMAGES.servizi.hero})` }}
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
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              letterSpacing: '-0.03em',
              color: COLORS.white,
            }}
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
//  SEZ. 2 — TIMELINE VERTICALE INTERATTIVA
// ============================================================
function TimelineCard({ step, index, totalSteps, isActive, isCompressed, onHover, onLeave, isMobile }) {
  return (
    <div
      className="tl-card relative flex gap-6 md:gap-10"
      onMouseEnter={isMobile ? undefined : onHover}
      onMouseLeave={isMobile ? undefined : onLeave}
      style={{ cursor: isMobile ? 'default' : 'pointer' }}
    >
      {/* Dot + vertical connector */}
      <div className="relative flex-shrink-0 flex flex-col items-center">
        <div
          className="relative z-10 w-7 h-7 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center mt-1 transition-all duration-500"
          style={{
            borderColor: isActive || isMobile ? COLORS.goldDark : COLORS.goldLight,
            backgroundColor: isActive && !isMobile ? COLORS.goldDark : COLORS.ivory,
          }}
        >
          <div
            className="w-2.5 h-2.5 rounded-full transition-colors duration-500"
            style={{ backgroundColor: isActive && !isMobile ? COLORS.white : COLORS.goldDark }}
          />
        </div>
        {index < totalSteps - 1 && (
          <div
            className="w-px flex-1 min-h-[2rem]"
            style={{ backgroundColor: COLORS.goldLight }}
          />
        )}
      </div>

      {/* Content */}
      <div
        className="flex-1 pb-8 md:pb-0 md:border-b md:py-8 transition-all duration-500"
        style={{
          borderColor: COLORS.goldLight,
          opacity: isCompressed ? 0.5 : 1,
        }}
      >
        <div className="flex items-baseline gap-4 mb-2">
          <span
            className="font-mono-data text-xs tracking-widest"
            style={{ color: COLORS.gold }}
          >
            {step.num}
          </span>
          <h3
            className="font-outfit font-bold text-lg md:text-xl transition-colors duration-300"
            style={{
              color: isActive && !isMobile ? COLORS.goldDark : COLORS.charcoal,
              letterSpacing: '-0.02em',
            }}
          >
            {step.title}
          </h3>
        </div>

        {/* Short description — hidden when compressed on desktop */}
        <div
          style={
            !isMobile
              ? {
                  maxHeight: isCompressed ? '0px' : '60px',
                  opacity: isCompressed ? 0 : 1,
                  transition: 'max-height 0.4s ease, opacity 0.3s ease',
                  overflow: 'hidden',
                }
              : {}
          }
        >
          <p
            className="font-sans text-sm leading-relaxed"
            style={{ color: COLORS.greyMid }}
          >
            {step.shortDesc}
          </p>
        </div>

        {/* Expandable content — desktop: expand on hover | mobile: always visible */}
        <div
          style={
            !isMobile
              ? {
                  maxHeight: isActive ? '500px' : '0px',
                  opacity: isActive ? 1 : 0,
                  marginTop: isActive ? '1rem' : '0',
                  transition:
                    'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, margin-top 0.3s ease',
                  overflow: 'hidden',
                }
              : { marginTop: '1rem' }
          }
        >
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <p
              className="font-sans text-sm leading-relaxed"
              style={{ color: COLORS.greyMid }}
            >
              {step.longDesc}
            </p>
            <div
              className="mt-4 md:mt-0 rounded-2xl overflow-hidden"
              style={{ height: 'clamp(160px, 20vw, 220px)' }}
            >
              <img
                src={step.img}
                alt={step.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MethodTimeline() {
  const { t } = useTranslation('servizi');
  const sectionRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const timelineSteps = useMemo(() => [
    {
      num: '01',
      title: t('method.steps.0.title'),
      shortDesc: <Trans i18nKey="method.steps.0.shortDesc" t={t} components={{ 1: <strong /> }} />,
      longDesc: t('method.steps.0.longDesc'),
      img: IMAGES.servizi.timelineAscolto,
    },
    {
      num: '02',
      title: t('method.steps.1.title'),
      shortDesc: <Trans i18nKey="method.steps.1.shortDesc" t={t} components={{ 1: <strong /> }} />,
      longDesc: t('method.steps.1.longDesc'),
      img: IMAGES.servizi.timelineProposta,
    },
    {
      num: '03',
      title: t('method.steps.2.title'),
      shortDesc: <Trans i18nKey="method.steps.2.shortDesc" t={t} components={{ 1: <strong /> }} />,
      longDesc: t('method.steps.2.longDesc'),
      img: IMAGES.servizi.timelineConfronto,
    },
    {
      num: '04',
      title: t('method.steps.3.title'),
      shortDesc: <Trans i18nKey="method.steps.3.shortDesc" t={t} components={{ 1: <strong /> }} />,
      longDesc: t('method.steps.3.longDesc'),
      img: IMAGES.servizi.timelineEsperienza,
    },
  ], [t]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.method-text'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      );
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.tl-card'),
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current.querySelector('.tl-wrap'),
            start: 'top 75%',
          },
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
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p
            className="method-text font-mono-data text-xs tracking-widest uppercase mb-4"
            style={{ color: COLORS.gold }}
          >
            {t('method.eyebrow')}
          </p>
          <h2
            className="method-text font-outfit font-bold leading-tight mb-6"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: COLORS.charcoal,
              letterSpacing: '-0.03em',
            }}
          >
            {t('method.titleBold')}
            <span
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontStyle: 'italic',
                color: COLORS.goldDark,
                fontSize: '1.15em',
              }}
            >
              {t('method.titleAccent')}
            </span>
          </h2>
          <p
            className="method-text font-sans text-base leading-relaxed"
            style={{ color: COLORS.greyMid }}
          >
            {t('method.subtitle')}
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="tl-wrap relative">
          {/* Vertical line (desktop) */}
          <div
            className="hidden md:block absolute left-[15px] top-0 bottom-0 w-px"
            style={{ backgroundColor: COLORS.goldLight }}
          />

          <div className="flex flex-col">
            {timelineSteps.map((step, i) => (
              <TimelineCard
                key={step.num}
                step={step}
                index={i}
                totalSteps={timelineSteps.length}
                isActive={activeIdx === i}
                isCompressed={activeIdx !== null && activeIdx !== i}
                onHover={() => setActiveIdx(i)}
                onLeave={() => setActiveIdx(null)}
                isMobile={!isDesktop}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
//  SEZ. 2b — PERCHÉ SCEGLIERMI (USP)
// ============================================================
function WhySection() {
  const { t } = useTranslation('servizi');
  const sectionRef = useRef(null);

  const whyData = useMemo(() => [
    { num: '01', title: t('why.items.0.title'), desc: t('why.items.0.desc') },
    { num: '02', title: t('why.items.1.title'), desc: t('why.items.1.desc') },
    { num: '03', title: t('why.items.2.title'), desc: t('why.items.2.desc') },
    { num: '04', title: t('why.items.3.title'), desc: t('why.items.3.desc') },
    { num: '05', title: t('why.items.4.title'), desc: t('why.items.4.desc') },
    { num: '06', title: t('why.items.5.title'), desc: t('why.items.5.desc') },
  ], [t]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.why-head'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      );
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.why-card'),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current.querySelector('.why-grid'),
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 md:px-16"
      style={{ backgroundColor: COLORS.deep }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p
            className="why-head font-mono-data text-xs tracking-widest uppercase mb-4"
            style={{ color: COLORS.gold }}
          >
            {t('why.eyebrow')}
          </p>
          <h2
            className="why-head font-outfit font-bold leading-tight mb-6"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: COLORS.white,
              letterSpacing: '-0.03em',
            }}
          >
            {t('why.titleBold')}
            <span
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontStyle: 'italic',
                color: COLORS.gold,
                fontSize: '1.15em',
              }}
            >
              {t('why.titleAccent')}
            </span>
          </h2>
          <p
            className="why-head font-sans text-base leading-relaxed"
            style={{ color: `${COLORS.white}80` }}
          >
            {t('why.subtitle')}
          </p>
        </div>

        {/* Grid */}
        <div className="why-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyData.map((item) => (
            <div
              key={item.num}
              className="why-card rounded-3xl p-8 border transition-colors duration-300"
              style={{
                backgroundColor: `${COLORS.charcoal}60`,
                borderColor: `${COLORS.gold}18`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${COLORS.gold}50`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${COLORS.gold}18`;
              }}
            >
              <span
                className="font-mono-data text-xs tracking-widest block mb-4"
                style={{ color: COLORS.gold }}
              >
                {item.num}
              </span>
              <h3
                className="font-outfit font-bold text-lg mb-3"
                style={{ color: COLORS.white, letterSpacing: '-0.02em' }}
              >
                {item.title}
              </h3>
              <p
                className="font-sans text-sm leading-relaxed"
                style={{ color: `${COLORS.white}70` }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
//  SEZ. 3-6 — SEZIONI SERVIZIO (componente riutilizzabile)
// ============================================================
function ServiceSection({
  num,
  eyebrow,
  title,
  introText,
  clientText,
  img,
  imgAlt,
  imagePosition,
  id,
  cta,
}) {
  const sectionRef = useRef(null);
  const imgClass = `svc-img-${num}`;
  const txtClass = `svc-text-${num}`;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelector(`.${imgClass}`),
        { x: imagePosition === 'left' ? -60 : 60, opacity: 0, scale: 0.96 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );
      gsap.fromTo(
        sectionRef.current.querySelectorAll(`.${txtClass}`),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const imgColStart = imagePosition === 'left' ? 'md:col-start-1' : 'md:col-start-2';
  const textColStart = imagePosition === 'left' ? 'md:col-start-2' : 'md:col-start-1';
  const decorativePos =
    imagePosition === 'left' ? '-top-6 -left-6' : '-top-6 -right-6';

  return (
    <section
      id={id}
      ref={sectionRef}
      className="py-24 px-6 md:px-16 overflow-hidden"
      style={{ backgroundColor: COLORS.ivory }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 md:gap-x-20 md:gap-y-6">
        {/* HEADER — eyebrow */}
        <div
          className={`flex flex-col gap-4 order-1 ${textColStart} md:row-start-1 md:self-end`}
        >
          <p
            className={`${txtClass} font-mono-data text-xs tracking-widest uppercase`}
            style={{ color: COLORS.gold }}
          >
            {eyebrow}
          </p>
        </div>

        {/* IMAGE */}
        <div
          className={`${imgClass} relative order-2 ${imgColStart} md:row-start-1 md:row-span-2 md:self-center`}
        >
          <div
            className={`absolute ${decorativePos} w-48 h-48 rounded-3xl z-0`}
            style={{ backgroundColor: COLORS.goldLight, opacity: 0.45 }}
          />
          <div
            className="relative z-10 rounded-4xl overflow-hidden shadow-xl"
            style={{ height: 'clamp(380px, 50vw, 520px)' }}
          >
            <img
              src={img}
              alt={imgAlt}
              className="w-full h-full object-cover object-center"
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{ backgroundColor: COLORS.goldDark }}
            />
          </div>
        </div>

        {/* TEXT */}
        <div
          className={`flex flex-col gap-6 order-3 ${textColStart} md:row-start-2 md:self-start`}
        >
          <h2
            className={`${txtClass} font-outfit font-bold leading-tight`}
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              color: COLORS.charcoal,
              letterSpacing: '-0.03em',
            }}
          >
            {title.bold}{' '}
            <span
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontStyle: 'italic',
                color: COLORS.goldDark,
                fontSize: '1.1em',
              }}
            >
              {title.italic}
            </span>
          </h2>

          <p
            className={`${txtClass} font-sans text-base leading-relaxed`}
            style={{ color: COLORS.greyMid }}
          >
            {introText}
          </p>

          <p
            className={`${txtClass} font-sans text-base leading-relaxed`}
            style={{ color: COLORS.greyMid }}
          >
            {clientText}
          </p>

          <div
            className={txtClass}
            style={{ width: '3rem', height: '1px', backgroundColor: COLORS.goldLight }}
          />

          <a
            href="#contatti"
            className={`${txtClass} btn-magnetic inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold self-start`}
            style={{ backgroundColor: COLORS.goldDark, color: COLORS.white }}
          >
            <span
              className="btn-bg rounded-full"
              style={{ backgroundColor: COLORS.deep }}
            />
            <span className="relative z-10">{cta}</span>
            <ArrowRight className="relative z-10 w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ============================================================
//  SEZ. 7 — SPECIALE: GRUPPI E AZIENDE (sfondo scuro)
// ============================================================
function SpecialeSection() {
  const { t } = useTranslation('servizi');
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelector('.speciale-img'),
        { x: 60, opacity: 0, scale: 0.96 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.speciale-text'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const bullets = t('speciale.bullets', { returnObjects: true });

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 md:px-16 overflow-hidden"
      style={{ backgroundColor: COLORS.deep }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 md:gap-x-20 md:gap-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 order-1 md:col-start-1 md:row-start-1 md:self-end">
          <div
            className="speciale-text inline-flex items-center gap-2 self-start px-4 py-2 rounded-full border"
            style={{ borderColor: COLORS.gold, backgroundColor: `${COLORS.gold}15` }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: COLORS.gold }} />
            <span
              className="font-mono-data text-xs tracking-widest uppercase"
              style={{ color: COLORS.gold }}
            >
              {t('speciale.badge')}
            </span>
          </div>

          <h2
            className="speciale-text font-outfit font-bold leading-tight"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              color: COLORS.white,
              letterSpacing: '-0.03em',
            }}
          >
            {t('speciale.titleBold')}
            <span
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontStyle: 'italic',
                color: COLORS.gold,
                fontSize: '1.1em',
              }}
            >
              {t('speciale.titleAccent')}
            </span>
          </h2>
        </div>

        {/* IMAGE */}
        <div className="speciale-img relative order-2 md:col-start-2 md:row-start-1 md:row-span-2 md:self-center">
          <div
            className="absolute -top-6 -right-6 w-48 h-48 rounded-3xl z-0"
            style={{ backgroundColor: COLORS.gold, opacity: 0.12 }}
          />
          <div
            className="relative z-10 rounded-4xl overflow-hidden shadow-xl"
            style={{ height: 'clamp(380px, 50vw, 520px)' }}
          >
            <img
              src={IMAGES.servizi.speciale}
              alt={t('speciale.imgAlt')}
              className="w-full h-full object-cover object-center"
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{ backgroundColor: COLORS.gold }}
            />
          </div>
          {/* Floating tag */}
          <div
            className="absolute bottom-8 -left-4 md:-left-8 z-20 px-5 py-3 rounded-2xl border shadow-xl"
            style={{ backgroundColor: COLORS.deep, borderColor: COLORS.gold }}
          >
            <p
              className="font-mono-data text-xs tracking-widest uppercase"
              style={{ color: COLORS.gold }}
            >
              {t('speciale.tagLabel')}
            </p>
            <p
              className="font-outfit font-bold text-base mt-0.5"
              style={{ color: COLORS.white }}
            >
              {t('speciale.tagValue')}
            </p>
          </div>
        </div>

        {/* TEXT */}
        <div className="flex flex-col gap-6 order-3 md:col-start-1 md:row-start-2 md:self-start">
          <p
            className="speciale-text font-sans text-base leading-relaxed"
            style={{ color: `${COLORS.white}99` }}
          >
            <Trans i18nKey="speciale.p1" t={t} components={{ 1: <strong /> }} />
          </p>

          <p
            className="speciale-text font-sans text-base leading-relaxed"
            style={{ color: `${COLORS.white}99` }}
          >
            <Trans i18nKey="speciale.p2" t={t} components={{ 1: <strong />, 2: <strong /> }} />
          </p>

          <ul className="speciale-text flex flex-col gap-3">
            {bullets.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${COLORS.gold}25` }}
                >
                  <Check className="w-3 h-3" style={{ color: COLORS.gold }} />
                </div>
                <span
                  className="font-sans text-sm"
                  style={{ color: `${COLORS.white}99` }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <div style={{ width: '3rem', height: '1px', backgroundColor: COLORS.gold }} />

          <a
            href="#contatti"
            className="speciale-text btn-magnetic inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold self-start"
            style={{ backgroundColor: COLORS.gold, color: COLORS.deep }}
          >
            <span
              className="btn-bg rounded-full"
              style={{ backgroundColor: COLORS.goldDark }}
            />
            <span className="relative z-10">{t('speciale.cta')}</span>
            <ArrowRight className="relative z-10 w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ============================================================
//  SEZ. 8 — STATEMENT / CTA
// ============================================================
function ServicesStatement() {
  const { t } = useTranslation('servizi');
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.statement-anim'),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
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
      style={{ backgroundColor: COLORS.charcoal }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${IMAGES.servizi.statement})` }}
      />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="statement-anim leading-none mb-4">
          <span
            className="block font-outfit font-bold"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              letterSpacing: '-0.02em',
              color: COLORS.white,
            }}
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
          <span
            className="btn-bg rounded-full"
            style={{ backgroundColor: COLORS.deep }}
          />
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
export default function ServiziPage() {
  const { t } = useTranslation('servizi');

  const serviceData = useMemo(() => [
    {
      num: '01',
      eyebrow: t('services.items.0.eyebrow'),
      title: { bold: t('services.items.0.titleBold'), italic: t('services.items.0.titleItalic') },
      introText: <Trans i18nKey="services.items.0.intro" t={t} components={{ 1: <strong /> }} />,
      clientText: <Trans i18nKey="services.items.0.client" t={t} components={{ 1: <strong />, 2: <strong /> }} />,
      img: IMAGES.servizi.itinerari,
      imgAlt: t('services.items.0.imgAlt'),
      cta: t('services.items.0.cta'),
    },
    {
      num: '02',
      eyebrow: t('services.items.1.eyebrow'),
      title: { bold: t('services.items.1.titleBold'), italic: t('services.items.1.titleItalic') },
      introText: <Trans i18nKey="services.items.1.intro" t={t} components={{ 1: <strong /> }} />,
      clientText: <Trans i18nKey="services.items.1.client" t={t} components={{ 1: <strong /> }} />,
      img: IMAGES.servizi.coppia,
      imgAlt: t('services.items.1.imgAlt'),
      cta: t('services.items.1.cta'),
    },
    {
      num: '03',
      eyebrow: t('services.items.2.eyebrow'),
      title: { bold: t('services.items.2.titleBold'), italic: t('services.items.2.titleItalic') },
      introText: <Trans i18nKey="services.items.2.intro" t={t} components={{ 1: <strong /> }} />,
      clientText: <Trans i18nKey="services.items.2.client" t={t} components={{ 1: <strong />, 2: <strong /> }} />,
      img: IMAGES.servizi.pet,
      imgAlt: t('services.items.2.imgAlt'),
      cta: t('services.items.2.cta'),
    },
    {
      num: '04',
      eyebrow: t('services.items.3.eyebrow'),
      title: { bold: t('services.items.3.titleBold'), italic: t('services.items.3.titleItalic') },
      introText: <Trans i18nKey="services.items.3.intro" t={t} components={{ 1: <strong /> }} />,
      clientText: <Trans i18nKey="services.items.3.client" t={t} components={{ 1: <strong />, 2: <strong /> }} />,
      img: IMAGES.servizi.strutture,
      imgAlt: t('services.items.3.imgAlt'),
      cta: t('services.items.3.cta'),
    },
  ], [t]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <ServicesHero />
      <MethodTimeline />
      <WhySection />
      <ServiceSection {...serviceData[0]} imagePosition="left" id="servizio-itinerari" />
      <ServiceSection {...serviceData[1]} imagePosition="right" id="servizio-coppia" />
      <ServiceSection {...serviceData[2]} imagePosition="left" id="servizi-pet" />
      <ServiceSection {...serviceData[3]} imagePosition="right" id="servizio-strutture" />
      <SpecialeSection />
      <ServicesStatement />
      <Contacts />
    </>
  );
}
