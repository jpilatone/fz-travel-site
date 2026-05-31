import { useEffect, useRef, useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Music2, Facebook, ChevronDown, ArrowRight, Check } from 'lucide-react';
import { COLORS, IMAGES } from './constants';
import Contacts from './components/Contacts';
import ChiSonoPage from './pages/ChiSono';
import ServiziPage from './pages/Servizi';

gsap.registerPlugin(ScrollTrigger);

// ============================================================
//  LANGUAGE SWITCHER
// ============================================================
function LanguageSwitcher({ variant = 'floating' }) {
  const { i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const current = i18n.language;

  useEffect(() => {
    if (variant !== 'floating') return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [variant]);

  const toggle = () => {
    const next = current === 'it' ? 'en' : 'it';
    i18n.changeLanguage(next);
    localStorage.setItem('fz-lang', next);
    document.documentElement.lang = next;
  };

  // Inline variant (mobile menu)
  if (variant === 'inline') {
    return (
      <button
        onClick={toggle}
        className="font-mono-data text-xs tracking-widest transition-colors duration-300"
      >
        <span style={{ opacity: current === 'it' ? 1 : 0.4 }}>IT</span>
        <span style={{ opacity: 0.3 }}>{' | '}</span>
        <span style={{ opacity: current === 'en' ? 1 : 0.4 }}>EN</span>
      </button>
    );
  }

  // Floating pill variant (desktop, outside navbar)
  const txtColor = scrolled ? COLORS.charcoal : COLORS.white;
  const bg = scrolled ? `${COLORS.ivory}f2` : 'rgba(0,0,0,0.18)';
  const border = scrolled ? COLORS.goldLight : 'rgba(255,255,255,0.18)';

  return (
    <button
      onClick={toggle}
      className="hidden md:flex fixed top-5 z-50 items-center gap-1.5 px-3 py-2 rounded-full backdrop-blur-md border shadow-sm font-mono-data text-[11px] tracking-widest transition-all duration-500"
      style={{ right: '1rem', backgroundColor: bg, borderColor: border, color: txtColor }}
    >
      <span style={{ opacity: current === 'it' ? 1 : 0.4, fontWeight: current === 'it' ? 700 : 400 }}>IT</span>
      <span style={{ opacity: 0.3 }}>|</span>
      <span style={{ opacity: current === 'en' ? 1 : 0.4, fontWeight: current === 'en' ? 700 : 400 }}>EN</span>
    </button>
  );
}

// ============================================================
//  A. NAVBAR
// ============================================================
function Navbar() {
  const { t } = useTranslation('common');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = useMemo(() => [
    { label: t('nav.chiSono'), href: '/chi-sono' },
    { label: t('nav.servizi'), href: '/servizi' },
    { label: t('nav.petFriendly'), href: '/servizi#servizi-pet' },
    { label: t('nav.faq'), href: '/#faq' },
    { label: t('nav.contatti'), href: '#contatti' },
  ], [t]);

  // Colori navbar in base allo stato scroll
  const linkColor   = scrolled ? COLORS.charcoal : COLORS.white;
  const logoColor   = scrolled ? COLORS.goldDark  : COLORS.white;
  const navBg       = scrolled ? `${COLORS.ivory}f2` : 'rgba(0,0,0,0.18)';
  const navBorder   = scrolled ? COLORS.goldLight  : 'rgba(255,255,255,0.18)';

  return (
    <nav
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 md:px-6 py-3 rounded-3xl backdrop-blur-md border shadow-sm transition-all duration-500 w-[calc(100%-2rem)] md:w-[calc(100%-9rem)] lg:w-[calc(100%-11rem)]"
      style={{
        maxWidth: '820px',
        backgroundColor: navBg,
        borderColor: navBorder,
      }}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="font-outfit text-xl shrink-0"
          style={{ fontWeight: 300, color: logoColor, letterSpacing: '0.08em' }}
        >
          FZ
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5 lg:gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans font-semibold link-lift transition-colors duration-300"
              style={{
                fontSize: '0.82rem',
                color: linkColor,
                letterSpacing: '0.01em',
                textShadow: scrolled ? 'none' : '0 1px 3px rgba(0,0,0,0.4)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = COLORS.gold; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = linkColor; }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA button */}
        <a
          href="#contatti"
          className="hidden md:inline-flex btn-magnetic items-center gap-2 px-5 py-2 rounded-full font-semibold shrink-0"
          style={{
            fontSize: '0.82rem',
            backgroundColor: COLORS.goldDark,
            color: COLORS.white,
          }}
        >
          <span className="btn-bg rounded-full" style={{ backgroundColor: COLORS.deep }} />
          <span className="relative z-10">{t('nav.consulenza')}</span>
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 shrink-0"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={t('nav.apriMenu')}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-5 h-0.5 transition-all"
              style={{ backgroundColor: linkColor }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden mt-4 flex flex-col gap-1 pb-4 border-t pt-6"
          style={{ borderColor: COLORS.goldLight }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-outfit font-bold py-3"
              style={{ fontSize: '1.5rem', color: linkColor, letterSpacing: '-0.02em' }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="py-3">
            <LanguageSwitcher variant="inline" />
          </div>
          <a
            href="#contatti"
            className="btn-magnetic mt-4 px-5 py-4 rounded-3xl font-semibold text-center"
            style={{ backgroundColor: COLORS.goldDark, color: COLORS.white, fontSize: '1rem' }}
            onClick={() => setMenuOpen(false)}
          >
            <span className="btn-bg rounded-3xl" style={{ backgroundColor: COLORS.deep }} />
            <span className="relative z-10">{t('nav.richiediConsulenza')}</span>
          </a>
        </div>
      )}
    </nav>
  );
}

// ============================================================
//  B. HERO SECTION
// ============================================================
function Hero() {
  const { t } = useTranslation('home');
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

  // Split "essere" into letters with animation delay
  const animateWord = (word) => {
    return word.split('').map((letter, i) => (
      <span
        key={i}
        className="hero-essere-letter"
        style={{ animationDelay: `${1.5 + i * 0.15}s` }}
      >
        {letter}
      </span>
    ));
  };

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: '100dvh' }}
    >
      <div
        className="absolute left-0 right-0 bottom-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${IMAGES.hero})`, top: '-5vh' }}
      />
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          top: '-5vh',
          background: `linear-gradient(to top, ${COLORS.deep} 0%, ${COLORS.charcoal}cc 45%, transparent 100%)`,
        }}
      />

      <div ref={textRef} className="relative z-10 px-6 md:px-16 max-w-5xl text-center flex flex-col items-center">
        <p
          className="hero-anim font-mono-data text-xs tracking-widest mb-4 uppercase"
          style={{ color: COLORS.gold }}
        >
          {t('hero.eyebrow')}
        </p>

        <h1 className="hero-anim leading-none mb-2">
          <span
            className="block font-outfit font-bold"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.03em', color: COLORS.white }}
          >
            {t('hero.title1')}
          </span>
          <span
            className="block"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(3.5rem, 9vw, 8rem)',
              lineHeight: 0.95,
              color: COLORS.white,
            }}
          >
            {t('hero.title2')}
            <em style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>{animateWord(t('hero.title2em'))}</em>
          </span>
        </h1>

        <p
          className="hero-anim font-sans text-base md:text-lg mt-6 mb-8 max-w-lg"
          style={{ color: `${COLORS.white}cc` }}
        >
          {t('hero.subtitle')}
        </p>

        <a
          href="#contatti"
          className="hero-anim btn-magnetic inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold"
          style={{ backgroundColor: COLORS.goldDark, color: COLORS.white }}
        >
          <span className="btn-bg rounded-full" style={{ backgroundColor: COLORS.deep }} />
          <span className="relative z-10">{t('hero.cta')}</span>
          <ArrowRight className="relative z-10 w-4 h-4" />
        </a>
      </div>

      <a
        href="#chisono"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
      >
        <ChevronDown className="w-5 h-5 animate-bounce" style={{ color: COLORS.white }} />
      </a>
    </section>
  );
}

// ============================================================
//  C. CHI SONO — Intro Francesco
// ============================================================
function ChiSonoIntro() {
  const { t } = useTranslation('home');
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelector('.chisono-img'),
        { x: -60, opacity: 0, scale: 0.96 },
        {
          x: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.chisono-text'),
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
      id="chisono"
      className="py-24 px-6 md:px-16 overflow-hidden"
      style={{ backgroundColor: COLORS.ivory }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">

        {/* IMAGE */}
        <div className="chisono-img relative">
          <div
            className="absolute -top-6 -left-6 w-48 h-48 rounded-3xl z-0"
            style={{ backgroundColor: COLORS.goldLight, opacity: 0.45 }}
          />
          <div
            className="relative z-10 rounded-4xl overflow-hidden"
            style={{ height: 'clamp(420px, 55vw, 580px)' }}
          >
            <img
              src="/foto-zac.jpg"
              alt={t('chiSonoIntro.imgAlt')}
              className="w-full h-full object-cover object-center"
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{ backgroundColor: COLORS.goldDark }}
            />
          </div>
          {/* Floating tag */}
          <div
            className="absolute bottom-8 -right-4 md:-right-8 z-20 px-5 py-3 rounded-2xl border shadow-xl"
            style={{ backgroundColor: COLORS.white, borderColor: COLORS.goldLight }}
          >
            <p className="font-mono-data text-xs tracking-widest uppercase" style={{ color: COLORS.gold }}>
              {t('chiSonoIntro.tagLabel')}
            </p>
            <p className="font-outfit font-bold text-base mt-0.5" style={{ color: COLORS.charcoal }}>
              {t('chiSonoIntro.tagName')}
            </p>
          </div>
        </div>

        {/* TEXT */}
        <div className="flex flex-col gap-6">
          <p
            className="chisono-text font-mono-data text-xs tracking-widest uppercase"
            style={{ color: COLORS.gold }}
          >
            {t('chiSonoIntro.eyebrow')}
          </p>

          <h2
            className="chisono-text leading-tight"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              letterSpacing: '-0.03em',
            }}
          >
            <span className="font-outfit font-bold" style={{ color: COLORS.charcoal }}>
              {t('chiSonoIntro.titleBold')}
            </span>
            <span
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontStyle: 'italic',
                fontWeight: 700,
                color: COLORS.goldDark,
                fontSize: '1.1em',
              }}
            >
              {t('chiSonoIntro.titleAccent')}
            </span>
          </h2>

          <p
            className="chisono-text font-sans text-base leading-relaxed"
            style={{ color: COLORS.greyMid }}
          >
            {t('chiSonoIntro.p1')}
          </p>

          <p
            className="chisono-text font-sans text-base leading-relaxed"
            style={{ color: COLORS.greyMid }}
          >
            {t('chiSonoIntro.p2')}
          </p>

          <p
            className="chisono-text font-sans text-base leading-relaxed"
            style={{ color: COLORS.greyMid }}
          >
            {t('chiSonoIntro.p3')}
          </p>

          {/* Divider */}
          <div
            className="chisono-text w-12 h-px"
            style={{ backgroundColor: COLORS.goldLight }}
          />

          <a
            href="/chi-sono"
            className="chisono-text btn-magnetic inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold self-start"
            style={{ backgroundColor: COLORS.goldDark, color: COLORS.white }}
          >
            <span className="btn-bg rounded-full" style={{ backgroundColor: COLORS.deep }} />
            <span className="relative z-10">{t('chiSonoIntro.cta')}</span>
            <ArrowRight className="relative z-10 w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}

// ============================================================
//  D. FEATURES
// ============================================================
const featureImages = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80&auto=format&fit=crop',
  '/cane-viaggio.jpg',
  'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80&auto=format&fit=crop',
];

const featureHrefs = [
  '/servizi#servizio-itinerari',
  '/servizi#servizi-pet',
  '/servizi#servizio-coppia',
  '/servizi#servizio-strutture',
];

function Features() {
  const { t } = useTranslation('home');
  const sectionRef = useRef(null);

  const serviceItems = useMemo(() => {
    const items = t('features.items', { returnObjects: true });
    return items.map((item, i) => ({
      ...item,
      img: featureImages[i],
      href: featureHrefs[i],
    }));
  }, [t]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.feature-card'),
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="servizi" ref={sectionRef} className="py-24 px-6 md:px-16" style={{ backgroundColor: COLORS.ivory }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <p className="font-mono-data text-xs tracking-widest uppercase mb-4" style={{ color: COLORS.gold }}>
            {t('features.eyebrow')}
          </p>
          <h2
            className="font-outfit font-bold leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: COLORS.charcoal, letterSpacing: '-0.03em' }}
          >
            {t('features.titleBold')}
            <span
              style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', color: COLORS.goldDark, fontSize: '1.15em' }}
            >
              {t('features.titleAccent')}
            </span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {serviceItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="feature-card flex flex-col md:flex-row md:items-center gap-4 md:gap-6 rounded-3xl p-6 border transition-all duration-300 no-underline"
              style={{ backgroundColor: COLORS.white, borderColor: COLORS.greyLight }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.goldLight; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.greyLight; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {/* Eyebrow — mobile only (above image) */}
              <p className="md:hidden font-mono-data text-xs tracking-widest uppercase" style={{ color: COLORS.gold }}>
                {item.eyebrow}
              </p>
              <div className="w-full h-48 md:w-32 md:h-32 flex-shrink-0 rounded-2xl overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                {/* Eyebrow — desktop only (inside text block) */}
                <p className="hidden md:block font-mono-data text-xs tracking-widest uppercase" style={{ color: COLORS.gold }}>
                  {item.eyebrow}
                </p>
                <h3
                  className="font-outfit font-bold text-lg"
                  style={{ color: COLORS.charcoal, letterSpacing: '-0.02em' }}
                >
                  {item.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed" style={{ color: COLORS.greyMid }}>
                  {item.desc}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
//  D. PHILOSOPHY
// ============================================================
function Philosophy() {
  const { t } = useTranslation('home');
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.word-reveal'),
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.04, ease: 'power3.out',
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
        <p className="font-sans text-base md:text-lg mb-10 leading-relaxed" style={{ color: `${COLORS.white}70` }}>
          {t('philosophy.subtitle').split(' ').map((w, i) => (
            <span key={i} className="word-reveal inline-block mr-2">{w}</span>
          ))}
        </p>
        <h2 className="leading-none">
          {t('philosophy.titleBold').split(' ').map((w, i) => (
            <span
              key={i}
              className="word-reveal inline-block mr-4 font-outfit font-bold"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-0.02em', color: COLORS.white }}
            >
              {w}
            </span>
          ))}
          <br />
          <span
            className="word-reveal block"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              fontSize: 'clamp(3.5rem, 9vw, 8rem)',
              color: COLORS.gold,
              lineHeight: 0.9,
            }}
          >
            {t('philosophy.titleAccent')}
          </span>
        </h2>
        <p className="word-reveal font-mono-data text-xs tracking-widest uppercase mt-12" style={{ color: `${COLORS.white}40` }}>
          {t('philosophy.date')}
        </p>
        <a
          href="#contatti"
          className="word-reveal btn-magnetic inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold mt-10"
          style={{ backgroundColor: COLORS.goldDark, color: COLORS.white }}
        >
          <span className="btn-bg rounded-full" style={{ backgroundColor: COLORS.deep }} />
          <span className="relative z-10">{t('philosophy.cta')}</span>
          <ArrowRight className="relative z-10 w-4 h-4" />
        </a>
      </div>
    </section>
  );
}

// ============================================================
//  E. PROTOCOL — Il Metodo
// ============================================================
function RotatingCircles() {
  return (
    <svg viewBox="0 0 120 120" className="w-28 h-28 opacity-50">
      <circle cx="60" cy="60" r="50" fill="none" stroke={COLORS.gold} strokeWidth="1" strokeDasharray="6 4">
        <animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60" dur="12s" repeatCount="indefinite" />
      </circle>
      <circle cx="60" cy="60" r="35" fill="none" stroke={COLORS.goldLight} strokeWidth="0.8" strokeDasharray="3 6">
        <animateTransform attributeName="transform" type="rotate" from="360 60 60" to="0 60 60" dur="8s" repeatCount="indefinite" />
      </circle>
      <circle cx="60" cy="60" r="18" fill="none" stroke={COLORS.goldDark} strokeWidth="1.5">
        <animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60" dur="4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function ScanningLaser() {
  return (
    <svg viewBox="0 0 120 80" className="w-28 h-20 opacity-40">
      {Array.from({ length: 6 }).map((_, row) =>
        Array.from({ length: 8 }).map((_, col) => (
          <circle key={`${row}-${col}`} cx={8 + col * 15} cy={8 + row * 12} r="1.5" fill={COLORS.goldLight} opacity="0.6" />
        ))
      )}
      <line x1="0" y1="40" x2="120" y2="40" stroke={COLORS.gold} strokeWidth="1.5" opacity="0.9">
        <animateTransform attributeName="transform" type="translate" values="0,-35; 0,35; 0,-35" dur="3s" repeatCount="indefinite" />
      </line>
    </svg>
  );
}

function PulsingWaveform() {
  return (
    <svg viewBox="0 0 120 80" className="w-28 h-20 opacity-40">
      <path d="M 0,40 Q 15,40 30,40 T 60,40 T 90,40 T 120,40" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round">
        <animate
          attributeName="d"
          values="M 0,40 Q 15,40 30,40 T 60,40 T 90,40 T 120,40; M 0,40 Q 15,10 30,40 T 60,30 T 90,50 T 120,40; M 0,40 Q 15,20 30,40 T 60,20 T 90,60 T 120,40; M 0,40 Q 15,30 30,40 T 60,40 T 90,40 T 120,40; M 0,40 Q 15,40 30,40 T 60,40 T 90,40 T 120,40"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

function FlightPath() {
  return (
    <svg viewBox="0 0 120 80" className="w-28 h-20 opacity-40">
      <path d="M 10,65 Q 60,10 110,65" fill="none" stroke={COLORS.goldLight} strokeWidth="1.5" strokeDasharray="4 3" />
      <circle r="4" fill={COLORS.gold}>
        <animateMotion path="M 10,65 Q 60,10 110,65" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

const protocolAnims = [<RotatingCircles />, <ScanningLaser />, <PulsingWaveform />, <FlightPath />];
const protocolBgs = [COLORS.deep, COLORS.charcoal, COLORS.deep, COLORS.charcoal];

function Protocol() {
  const { t } = useTranslation('home');
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  const protocolSteps = useMemo(() => {
    const steps = t('protocol.steps', { returnObjects: true });
    return steps.map((step, i) => ({
      num: String(i + 1).padStart(2, '0'),
      title: step.title,
      desc: step.desc,
      anim: protocolAnims[i],
      bg: protocolBgs[i],
    }));
  }, [t]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 80%' },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="metodo" ref={sectionRef} className="py-24 px-6 md:px-16" style={{ backgroundColor: COLORS.ivory }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <p className="font-mono-data text-xs tracking-widest uppercase mb-4" style={{ color: COLORS.gold }}>{t('protocol.eyebrow')}</p>
          <h2
            className="font-outfit font-bold leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: COLORS.charcoal, letterSpacing: '-0.03em' }}
          >
            {t('protocol.titleBold')}
            <span style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', color: COLORS.goldDark, fontSize: '1.15em' }}>
              {t('protocol.titleAccent')}
            </span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {protocolSteps.map((step, i) => (
            <div
              key={step.num}
              ref={(el) => (cardsRef.current[i] = el)}
              className="rounded-4xl p-10"
              style={{ backgroundColor: step.bg }}
            >
              <div className="flex justify-between items-start mb-6 h-28">
                <span className="font-mono-data text-xs tracking-widest" style={{ color: COLORS.gold }}>{step.num}</span>
                {step.anim}
              </div>
              <h3 className="font-outfit font-bold text-xl mb-3" style={{ color: COLORS.white, letterSpacing: '-0.02em' }}>
                {step.title}
              </h3>
              <p className="font-sans text-sm leading-relaxed" style={{ color: `${COLORS.white}70` }}>{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-12 justify-center">
          <a
            href="#contatti"
            className="btn-magnetic px-8 py-4 rounded-full font-semibold text-sm"
            style={{ backgroundColor: COLORS.goldDark, color: COLORS.white }}
          >
            <span className="btn-bg rounded-full" style={{ backgroundColor: COLORS.deep }} />
            <span className="relative z-10">{t('protocol.cta1')}</span>
          </a>
          <a
            href="mailto:hello@fztravelconsulting.com"
            className="btn-magnetic px-8 py-4 rounded-full font-semibold text-sm border"
            style={{ borderColor: COLORS.goldDark, color: COLORS.goldDark }}
          >
            <span className="btn-bg rounded-full" style={{ backgroundColor: `${COLORS.goldDark}15` }} />
            <span className="relative z-10">{t('protocol.cta2')}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ============================================================
//  F. PET-FRIENDLY HIGHLIGHT
// ============================================================
function PetFriendly() {
  const { t } = useTranslation('home');
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelector('.pet-img'),
        { x: 60, opacity: 0, scale: 0.96 },
        {
          x: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.pet-text'),
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const bullets = t('pet.bullets', { returnObjects: true });

  return (
    <section
      ref={sectionRef}
      id="petfriendly"
      className="py-24 px-6 md:px-16 overflow-hidden"
      style={{ backgroundColor: COLORS.ivory }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 md:gap-x-20 md:gap-y-6">

        {/* HEADER — eyebrow + title (mobile: 1st, desktop: top-left) */}
        <div className="flex flex-col gap-4 order-1 md:col-start-1 md:row-start-1 md:self-end">
          <p
            className="pet-text font-mono-data text-xs tracking-widest uppercase"
            style={{ color: COLORS.gold }}
          >
            {t('pet.eyebrow')}
          </p>

          <h2
            className="pet-text font-outfit font-bold leading-tight"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              color: COLORS.charcoal,
              letterSpacing: '-0.03em',
            }}
          >
            {t('pet.titleBold')}
            <span
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontStyle: 'italic',
                color: COLORS.goldDark,
                fontSize: '1.1em',
              }}
            >
              {t('pet.titleAccent')}
            </span>
          </h2>
        </div>

        {/* IMAGE (mobile: 2nd, desktop: right column spanning both rows) */}
        <div className="pet-img relative order-2 md:col-start-2 md:row-start-1 md:row-span-2 md:self-center">
          <div
            className="absolute -top-6 -right-6 w-48 h-48 rounded-3xl z-0"
            style={{ backgroundColor: COLORS.goldLight, opacity: 0.45 }}
          />
          <div
            className="relative z-10 rounded-4xl overflow-hidden"
            style={{ height: 'clamp(420px, 55vw, 580px)' }}
          >
            <img
              src={IMAGES.pet}
              alt={t('pet.imgAlt')}
              className="w-full h-full object-cover object-center"
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{ backgroundColor: COLORS.goldDark }}
            />
          </div>
          {/* Floating badge */}
          <div
            className="absolute bottom-8 -left-4 md:-left-8 z-20 px-5 py-3 rounded-2xl border shadow-xl"
            style={{ backgroundColor: COLORS.white, borderColor: COLORS.goldLight }}
          >
            <p className="font-mono-data text-xs tracking-widest uppercase" style={{ color: COLORS.gold }}>
              {t('pet.badgeLabel')}
            </p>
            <p className="font-outfit font-bold text-base mt-0.5" style={{ color: COLORS.charcoal }}>
              {t('pet.badgeValue')}
            </p>
          </div>
        </div>

        {/* BODY — description, bullets, CTA (mobile: 3rd, desktop: bottom-left) */}
        <div className="flex flex-col gap-6 order-3 md:col-start-1 md:row-start-2 md:self-start">
          <p
            className="pet-text font-sans text-base leading-relaxed"
            style={{ color: COLORS.greyMid }}
          >
            <Trans
              i18nKey="pet.desc"
              ns="home"
              components={{ 1: <strong style={{ color: COLORS.charcoal }} /> }}
            />
          </p>

          {/* Bullet list */}
          <ul className="pet-text flex flex-col gap-3">
            {bullets.map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <Check
                  className="flex-shrink-0 w-4 h-4"
                  style={{ color: COLORS.goldDark }}
                />
                <span
                  className="font-sans text-base"
                  style={{ color: COLORS.charcoal }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="pet-text w-12 h-px" style={{ backgroundColor: COLORS.goldLight }} />

          <a
            href="/servizi#servizi-pet"
            className="pet-text btn-magnetic inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold self-start"
            style={{ backgroundColor: COLORS.goldDark, color: COLORS.white }}
          >
            <span className="btn-bg rounded-full" style={{ backgroundColor: COLORS.deep }} />
            <span className="relative z-10">{t('pet.cta')}</span>
            <ArrowRight className="relative z-10 w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}

// ============================================================
//  G. SOCIAL GALLERY
// ============================================================
function Social() {
  const { t } = useTranslation('home');
  const sectionRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const images = galleryRef.current.querySelectorAll('.gallery-img');
      gsap.fromTo(
        images,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: galleryRef.current, start: 'top 70%' },
        }
      );
      images.forEach((img, i) => {
        const speed = i % 2 === 0 ? 60 : 30;
        gsap.to(img, {
          y: `-${speed}px`, ease: 'none',
          scrollTrigger: {
            trigger: galleryRef.current,
            start: 'top bottom', end: 'bottom top', scrub: true,
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const socialLinks = [
    { icon: <Instagram className="w-4 h-4" />, handle: 'Instagram', href: 'https://www.instagram.com/francesco_zaccagnino/' },
    { icon: <Music2 className="w-4 h-4" />, handle: 'TikTok', href: 'https://www.tiktok.com/@francesco_zaccagnino' },
    { icon: <Facebook className="w-4 h-4" />, handle: 'Facebook', href: '#' },
  ];

  const bentoImages = [
    '/gallery/img1-fz-gallery.jpg.JPG',
    '/gallery/img2-fz-gallery.jpg',
    '/gallery/img3-fz-gallery.jpg',
    '/gallery/img4-fz-gallery.jpg',
    '/gallery/img5-fz-gallery.jpg',
    '/gallery/img6-fz-gallery.jpg',
    '/gallery/img7-fz-gallery.jpg',
  ];

  return (
    <section ref={sectionRef} className="py-24 px-6 md:px-16 overflow-hidden" style={{ backgroundColor: COLORS.ivory }}>
      <div className="max-w-6xl mx-auto">
        {/* Header — two columns, aligned top */}
        <div className="flex flex-col md:flex-row md:justify-between gap-6 mb-16 md:items-start">
          <h2
            className="font-outfit font-bold leading-tight md:flex-1"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em', color: COLORS.charcoal }}
          >
            {t('social.titleBold')}
            <span style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', color: COLORS.goldDark, fontSize: '1.15em' }}>
              {t('social.titleAccent')}
            </span>
          </h2>
          <div className="flex flex-col gap-4 md:max-w-sm md:text-right shrink-0 md:pt-2">
            <p className="font-sans text-sm leading-relaxed" style={{ color: COLORS.greyMid }}>
              {t('social.desc')}
            </p>
            <div className="flex md:justify-end gap-4">
              {socialLinks.map((s) => (
                <a
                  key={s.handle + s.href}
                  href={s.href}
                  target={s.href !== '#' ? '_blank' : undefined}
                  rel={s.href !== '#' ? 'noopener noreferrer' : undefined}
                  className="link-lift flex items-center gap-2 group"
                  style={{ color: COLORS.charcoal }}
                >
                  <span style={{ color: COLORS.goldDark }}>{s.icon}</span>
                  <span className="font-mono-data text-xs opacity-70 group-hover:opacity-100 transition-opacity">
                    {s.handle}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bento grid — 2 columns mobile, 3 columns desktop */}
        {/* Mobile: 2 columns */}
        <div ref={galleryRef} className="md:hidden flex gap-3">
          <div className="flex-1 flex flex-col gap-3">
            <div className="gallery-img rounded-2xl overflow-hidden" style={{ aspectRatio: '4/5' }}>
              <img src={bentoImages[0]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" style={{ backgroundColor: COLORS.greyLight }} />
            </div>
            <div className="gallery-img rounded-2xl overflow-hidden" style={{ aspectRatio: '1/1' }}>
              <img src={bentoImages[1]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" style={{ backgroundColor: COLORS.greyLight }} />
            </div>
            <div className="gallery-img rounded-2xl overflow-hidden" style={{ aspectRatio: '4/5' }}>
              <img src={bentoImages[4]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" style={{ backgroundColor: COLORS.greyLight }} />
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-3">
            <div className="gallery-img rounded-2xl overflow-hidden" style={{ aspectRatio: '1/1' }}>
              <img src={bentoImages[2]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" style={{ backgroundColor: COLORS.greyLight }} />
            </div>
            <div className="gallery-img rounded-2xl overflow-hidden" style={{ aspectRatio: '4/5' }}>
              <img src={bentoImages[3]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" style={{ backgroundColor: COLORS.greyLight }} />
            </div>
            <div className="gallery-img rounded-2xl overflow-hidden" style={{ aspectRatio: '1/1' }}>
              <img src={bentoImages[5]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" style={{ backgroundColor: COLORS.greyLight }} />
            </div>
          </div>
        </div>
        {/* Desktop: 3 columns */}
        <div className="hidden md:flex gap-4">
          <div className="flex-1 flex flex-col gap-4">
            <div className="gallery-img rounded-3xl overflow-hidden" style={{ aspectRatio: '4/5' }}>
              <img src={bentoImages[0]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" style={{ backgroundColor: COLORS.greyLight }} />
            </div>
            <div className="gallery-img rounded-3xl overflow-hidden" style={{ aspectRatio: '4/5' }}>
              <img src={bentoImages[4]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" style={{ backgroundColor: COLORS.greyLight }} />
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div className="gallery-img rounded-3xl overflow-hidden" style={{ aspectRatio: '1/1' }}>
              <img src={bentoImages[1]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" style={{ backgroundColor: COLORS.greyLight }} />
            </div>
            <div className="gallery-img rounded-3xl overflow-hidden" style={{ aspectRatio: '4/5' }}>
              <img src={bentoImages[3]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" style={{ backgroundColor: COLORS.greyLight }} />
            </div>
            <div className="gallery-img rounded-3xl overflow-hidden" style={{ aspectRatio: '1/1' }}>
              <img src={bentoImages[6]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" style={{ backgroundColor: COLORS.greyLight }} />
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div className="gallery-img rounded-3xl overflow-hidden" style={{ aspectRatio: '4/5' }}>
              <img src={bentoImages[2]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" style={{ backgroundColor: COLORS.greyLight }} />
            </div>
            <div className="gallery-img rounded-3xl overflow-hidden" style={{ aspectRatio: '1/1' }}>
              <img src={bentoImages[5]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" style={{ backgroundColor: COLORS.greyLight }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
//  G. FAQ
// ============================================================
function FAQItem({ item, isOpen, onToggle }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;
    if (isOpen) {
      gsap.fromTo(contentRef.current, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.inOut' });
    } else {
      gsap.to(contentRef.current, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.inOut' });
    }
  }, [isOpen]);

  return (
    <div className="border-b last:border-b-0 py-6" style={{ borderColor: COLORS.goldLight }}>
      <button className="w-full flex items-center justify-between text-left gap-4" onClick={onToggle}>
        <span className="font-outfit font-semibold text-base md:text-lg" style={{ color: COLORS.charcoal }}>{item.q}</span>
        <span
          className="w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{
            borderColor: COLORS.goldDark,
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            backgroundColor: isOpen ? COLORS.goldDark : 'transparent',
          }}
        >
          <span style={{ color: isOpen ? COLORS.white : COLORS.goldDark, fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 1 }}>+</span>
        </span>
      </button>
      <div ref={contentRef} style={{ overflow: 'hidden', height: 0, opacity: 0 }}>
        <p className="font-sans text-sm leading-relaxed mt-4 pr-12" style={{ color: `${COLORS.charcoal}99` }}>
          {item.a}
        </p>
      </div>
    </div>
  );
}

function FAQ() {
  const { t } = useTranslation('home');
  const [openIdx, setOpenIdx] = useState(null);

  const faqItems = useMemo(() => t('faq.items', { returnObjects: true }), [t]);

  return (
    <section id="faq" className="py-24 px-6 md:px-16" style={{ backgroundColor: COLORS.ivory }}>
      <div className="max-w-3xl mx-auto">
        <p className="font-mono-data text-xs tracking-widest uppercase mb-4" style={{ color: COLORS.gold }}>{t('faq.eyebrow')}</p>
        <h2
          className="font-outfit font-bold leading-tight mb-4"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: COLORS.charcoal, letterSpacing: '-0.03em' }}
        >
          {t('faq.titleBold')}
          <span style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', color: COLORS.goldDark, fontSize: '1.1em' }}>
            {t('faq.titleAccent')}
          </span>
        </h2>
        <p className="font-sans text-sm mb-12" style={{ color: COLORS.greyMid }}>
          {t('faq.subtitle')}
        </p>
        <div>
          {faqItems.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx((prev) => (prev === i ? null : i))}
            />
          ))}
        </div>
        <div className="mt-12 text-center">
          <a
            href="#contatti"
            className="btn-magnetic inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold"
            style={{ backgroundColor: COLORS.charcoal, color: COLORS.white, fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}
          >
            <span className="btn-bg rounded-full" style={{ backgroundColor: COLORS.deep }} />
            <span className="relative z-10">{t('faq.cta')}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ============================================================
//  H. FOOTER
// ============================================================
function Footer() {
  const { t } = useTranslation('common');
  const year = new Date().getFullYear();

  const footerNav = useMemo(() => [
    { label: t('nav.chiSono'), href: '/chi-sono' },
    { label: t('nav.servizi'), href: '/servizi' },
    { label: t('nav.petFriendly'), href: '/servizi#servizi-pet' },
    { label: t('nav.faq'), href: '/#faq' },
    { label: t('nav.contatti'), href: '#contatti' },
  ], [t]);

  return (
    <footer className="relative z-10 -mt-10 px-6 md:px-16 pt-16 pb-10 rounded-t-5xl" style={{ backgroundColor: COLORS.deep }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-16">
          <div className="md:col-span-2">
            <div className="mb-3" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'stretch' }}>
              <p className="font-outfit text-4xl mb-0 leading-none" style={{ fontWeight: 300, letterSpacing: '0.08em', color: COLORS.white }}>FZ</p>
              <span className="font-outfit" style={{ fontWeight: 300, fontSize: '4.5px', color: COLORS.white, textTransform: 'uppercase', marginTop: '2px', display: 'flex', justifyContent: 'space-between', width: '100%' }}>{'TRAVEL CONSULTING'.split('').map((ch, i) => <span key={i} style={{ display: 'inline-block', minWidth: ch === ' ' ? '2px' : 0 }}>{ch}</span>)}</span>
            </div>
            <p className="font-sans text-sm max-w-xs leading-relaxed" style={{ color: COLORS.greyMid }}>
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-2 mt-8">
              <span className="w-2 h-2 rounded-full dot-pulse" style={{ backgroundColor: '#4ade80' }} />
              <span className="font-mono-data text-xs" style={{ color: `${COLORS.white}40` }}>{t('footer.available')}</span>
            </div>
          </div>
          <div>
            <p className="font-mono-data text-xs tracking-widest uppercase mb-5" style={{ color: `${COLORS.white}40` }}>{t('footer.navigazione')}</p>
            <ul className="flex flex-col gap-3">
              {footerNav.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="font-sans text-sm link-lift transition-colors" style={{ color: COLORS.greyMid }}
                    onMouseEnter={e => e.target.style.color = COLORS.white}
                    onMouseLeave={e => e.target.style.color = COLORS.greyMid}
                  >{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono-data text-xs tracking-widest uppercase mb-5" style={{ color: `${COLORS.white}40` }}>{t('footer.social')}</p>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'Instagram', href: 'https://www.instagram.com/francesco_zaccagnino/' },
                { label: 'TikTok', href: 'https://www.tiktok.com/@francesco_zaccagnino' },
                { label: 'Facebook', href: '#' },
              ].map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href !== '#' ? '_blank' : undefined}
                    rel={s.href !== '#' ? 'noopener noreferrer' : undefined}
                    className="font-mono-data text-sm link-lift transition-colors"
                    style={{ color: COLORS.greyMid }}
                    onMouseEnter={e => e.target.style.color = COLORS.gold}
                    onMouseLeave={e => e.target.style.color = COLORS.greyMid}
                  >{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t mb-8" style={{ borderColor: `${COLORS.white}12` }} />
        <div className="flex flex-wrap justify-between items-center gap-4 font-mono-data" style={{ color: `${COLORS.white}30` }}>
          <p style={{ fontSize: '12px', margin: 0 }}>&copy; {year} {t('footer.copyright')}</p>
          <div className="flex gap-6" style={{ fontSize: '12px' }}>
            <a href="#" className="hover:opacity-70 transition-opacity">{t('footer.privacy')}</a>
            <a href="#" className="hover:opacity-70 transition-opacity">{t('footer.cookie')}</a>
          </div>
        </div>
        <p className="text-center text-xs font-mono-data mt-6" style={{ color: `${COLORS.white}20` }}>
          Designed by Junior
        </p>
      </div>
    </footer>
  );
}

// ============================================================
//  HOME PAGE
// ============================================================
function HomePage() {
  return (
    <>
      <Hero />
      <ChiSonoIntro />
      <Features />
      <Philosophy />
      <Protocol />
      <PetFriendly />
      <FAQ />
      <Social />
      <Contacts />
    </>
  );
}

// ============================================================
//  SCROLL TO HASH — gestisce navigazione con #anchor
// ============================================================
function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) return;
    // piccolo delay per aspettare il render della pagina
    const timer = setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [hash, pathname]);

  return null;
}

// ============================================================
//  APP ROOT
// ============================================================
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ backgroundColor: COLORS.ivory }}>
        <ScrollToHash />
        <Navbar />
        <LanguageSwitcher variant="floating" />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chi-sono" element={<ChiSonoPage />} />
          <Route path="/servizi" element={<ServiziPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
