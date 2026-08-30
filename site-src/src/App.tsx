import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowDown, ArrowRight, CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Flame, Instagram, MapPin, Menu, MessageCircle, Minus, Phone, Plus, Send, Sparkles, Star, Utensils, X } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import './index.css';

const asset = (name: string) => `/assets/${name}`;

const menuItems = [
  { id: 'mutton', category: 'Mandi', name: 'Mutton Yemeni Mandi', description: 'Slow-cooked mutton, fragrant basmati, toasted almonds and raisins.', price: 395, image: 'mutton-mandi-plate.jpg', note: 'House favourite' },
  { id: 'alfaham', category: 'Mandi', name: 'Chicken Alfaham Mandi', description: 'Charcoal-kissed chicken over long-grain mandi rice and a cool laban dip.', price: 270, image: 'chicken-alfaham-mandi.jpg', note: 'Smoky & tender' },
  { id: 'moroccan', category: 'Mandi', name: 'Moroccan Chicken Mandi', description: 'A bright North African spice rub, roasted chicken and saffron rice.', price: 290, image: 'moroccan-chicken-mandi.jpg', note: 'New on the table' },
  { id: 'nalli', category: 'Mandi', name: 'Mutton Nalli Party', description: 'The generous cut. Rich marrow, soft mutton, enough for the whole table.', price: 1699, image: 'mutton-nalli-platter.jpg', note: 'For sharing' },
  { id: 'bbq-quarter', category: 'Charcoal', name: 'BBQ Chicken 1/4', description: 'Marinated overnight, finished over live coals until the edges sing.', price: 160, image: 'bbq-chicken-quarter.jpg', note: 'From the grill' },
  { id: 'chicken-tikka', category: 'Charcoal', name: 'Chicken Tikka', description: 'Yogurt, black lime and fire. Served with mint chutney.', price: 240, image: 'chicken-tikka-plate.jpg', note: 'Charcoal cooked' },
  { id: 'hummus', category: 'To begin', name: 'Silky Hummus', description: 'Warm chickpeas, tahini, lemon and a slow pour of olive oil.', price: 150, image: 'silky-hummus-bowl.jpg', note: 'To share' },
  { id: 'kunafa', category: 'Sweet', name: 'Kunafa Nabulsiya', description: 'Crisp golden threads, soft cheese and a rose-scented syrup.', price: 220, image: 'kunafa-nabulsiya.jpg', note: 'End slowly' },
];

const gallery = [
  { image: 'gallery-coal-pit-lift.jpg', label: 'Mandi, lifted from the coal pit', size: 'large' },
  { image: 'gallery-table-spread.jpg', label: 'The table comes together', size: 'tall' },
  { image: 'gallery-smoke-flavour.jpg', label: 'A little smoke, a lot of flavour', size: 'small' },
  { image: 'gallery-passing-around.jpg', label: 'Made for passing around', size: 'small' },
  { image: 'gallery-charcoal-grill.jpg', label: 'Charcoal does the talking', size: 'wide' },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useReveal();
  return <div ref={ref} className={`${visible ? 'reveal' : 'opacity-0'} ${className}`} style={{ animationDelay: `${delay}ms` }}>{children}</div>;
}

function Logo({ light = false }: { light?: boolean }) {
  return <img src={asset(light ? 'logo-white.png' : 'logo.png')} alt="Al Yazi Mandi" className="h-10 w-auto object-contain" />;
}

const WHATSAPP_NUMBER = { intl: '917010254253', display: '+91 70102 54253' };
const CALL_NUMBERS = [
  { intl: '917010254253', display: '+91 70102 54253' },
  { intl: '918148227336', display: '+91 81482 27336' },
];

const waHref = (intl: string, message?: string) => `https://wa.me/${intl}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
const telHref = (intl: string) => `tel:+${intl}`;

function useClickOutside(open: boolean, onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) onOutside(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onOutside]);
  return ref;
}

function CallChoiceMenu({ position = 'down' }: { position?: 'down' | 'up' }) {
  return <div role="menu" aria-label="Choose a number to call" className={`absolute left-0 z-40 w-56 overflow-hidden rounded-xl border border-[#d8c7b2] bg-[#fbf7f0] text-[#36231a] shadow-xl ${position === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
    <span className="block px-4 pt-3 text-[9px] font-bold uppercase tracking-[.15em] text-[#80675a]">Choose a number</span>
    {CALL_NUMBERS.map((n) => <a key={n.intl} data-testid={`link-call-${n.intl}`} href={telHref(n.intl)} className="block px-4 py-3 text-sm font-semibold hover:bg-[#eee3d2]">{n.display}</a>)}
  </div>;
}

function WhatsAppButton({ label = 'Order on WhatsApp', compact = false, message = "Hello Al Yazi Mandi, I'd like to place an order." }: { label?: string; compact?: boolean; message?: string }) {
  return <a data-testid="link-whatsapp-order" href={waHref(WHATSAPP_NUMBER.intl, message)} target="_blank" rel="noreferrer" className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#c9da9b] px-5 py-3 text-sm font-bold text-[#26341e] transition-transform hover:-translate-y-1 hover:bg-[#d9e8b1] ${compact ? 'px-4 py-2.5' : ''}`}><MessageCircle size={17} />{label}</a>;
}

function CallButton({ label, className }: { label: ReactNode; className: string }) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(open, () => setOpen(false));
  return <div ref={ref} className="relative inline-block">
    <button type="button" onClick={() => setOpen((v) => !v)} aria-haspopup="true" aria-expanded={open} className={className}>{label}</button>
    {open && <CallChoiceMenu />}
  </div>;
}

function Navigation({ onReserve }: { onReserve: () => void }) {
  const [open, setOpen] = useState(false);
  const links = [['Story', '#story'], ['Menu', '#menu'], ['The ritual', '#ritual'], ['Gatherings', '#catering']];
  return <header className="absolute inset-x-0 top-0 z-30 text-[#f9f3e9]">
    <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-5 md:px-10">
      <a data-testid="link-logo-home" href="#top" className="shrink-0"><Logo light /></a>
      <nav className="hidden items-center gap-8 lg:flex">
        {links.map(([label, href]) => <a data-testid={`link-nav-${label.toLowerCase()}`} key={label} href={href} className="text-[11px] font-bold uppercase tracking-[.2em] text-[#eee2d1]/80 transition-colors hover:text-[#d7df9e]">{label}</a>)}
      </nav>
      <div className="hidden items-center gap-3 md:flex">
        <CallButton label={<><Phone size={14} /> Call us</>} className="flex items-center gap-2 text-xs text-[#eee2d1]/75 hover:text-white" />
        <button data-testid="button-reserve-top" onClick={onReserve} className="rounded-full border border-[#ead8bf]/40 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[.16em] transition-colors hover:bg-[#ead8bf] hover:text-[#322116]">Reserve a cabin</button>
      </div>
      <button data-testid="button-mobile-menu" onClick={() => setOpen((v) => !v)} className="rounded-full border border-[#ead8bf]/40 p-2 lg:hidden">{open ? <X size={20} /> : <Menu size={20} />}</button>
    </div>
    {open && <div className="mx-4 rounded-2xl border border-[#ead8bf]/20 bg-[#291a15]/95 p-5 backdrop-blur-md lg:hidden">
      <div className="flex flex-col gap-4">{links.map(([label, href]) => <a data-testid={`link-mobile-${label.toLowerCase()}`} key={label} href={href} onClick={() => setOpen(false)} className="border-b border-[#ead8bf]/15 pb-3 text-sm uppercase tracking-[.15em]">{label}</a>)}</div>
      <button data-testid="button-mobile-reserve" onClick={() => { setOpen(false); onReserve(); }} className="mt-5 w-full rounded-full bg-[#d7df9e] px-4 py-3 text-xs font-bold uppercase tracking-[.15em] text-[#34261c]">Reserve a cabin</button>
    </div>}
  </header>;
}

function HeroVisual() {
  const [index, setIndex] = useState(0);
  const sequence = [
    { src: 'charcoal-ignites.jpg', alt: 'Charcoal ignites', scaleStart: 1.1, scaleEnd: 1.25, origin: 'center', yStart: 10, yEnd: -5 },
    { src: 'smoke-billows.jpg', alt: 'Smoke billows', scaleStart: 1.2, scaleEnd: 1.05, origin: 'center top', yStart: 5, yEnd: -10 },
    { src: 'chicken-roasts.jpg', alt: 'Chicken roasting over coals', scaleStart: 1.05, scaleEnd: 1.2, origin: 'center bottom', yStart: 15, yEnd: 0 },
    { src: 'rice-layered.jpg', alt: 'Rice layered into the pot', scaleStart: 1.2, scaleEnd: 1.05, origin: 'right center', yStart: -5, yEnd: 5 },
    { src: 'hero-mandi-lift.jpg', alt: 'Finished mandi plate', scaleStart: 1.0, scaleEnd: 1.15, origin: 'center', yStart: 10, yEnd: -5 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % sequence.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [sequence.length]);

  return (
    <div className="absolute inset-0 bg-[#291612]">
      <AnimatePresence initial={false}>
        <motion.img
          key={index}
          src={asset(sequence[index].src)}
          alt={sequence[index].alt}
          initial={{ opacity: 0, scale: sequence[index].scaleStart, y: sequence[index].yStart, filter: 'blur(6px)' }}
          animate={{ opacity: 0.9, scale: sequence[index].scaleEnd, y: sequence[index].yEnd, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: sequence[index].scaleEnd + (sequence[index].scaleEnd > sequence[index].scaleStart ? 0.05 : -0.05), y: sequence[index].yEnd - 10, filter: 'blur(6px)' }}
          transition={{
            opacity: { duration: 2.2, ease: 'easeInOut' },
            filter: { duration: 2.2, ease: 'easeInOut' },
            scale: { duration: 6.5, ease: 'linear' },
            y: { duration: 6.5, ease: 'linear' }
          }}
          style={{ transformOrigin: sequence[index].origin }}
          className="absolute inset-0 h-full w-full object-cover mix-blend-luminosity"
        />
      </AnimatePresence>
      <motion.div
        animate={{ opacity: [0.1, 0.4, 0.1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(226,135,67,0.3),transparent_70%)] pointer-events-none mix-blend-screen"
      />
    </div>
  );
}

function FoodCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [cursorState, setCursorState] = useState<'idle' | 'interactive' | 'food'>('idle');
  const frame = useRef<number | null>(null);
  const pendingPosition = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reducedMotion.matches) return;

    document.documentElement.classList.add('food-cursor-active');
    const updateCursor = (event: PointerEvent) => {
      pendingPosition.current = { x: event.clientX, y: event.clientY };
      if (frame.current === null) {
        frame.current = window.requestAnimationFrame(() => {
          setPosition(pendingPosition.current);
          frame.current = null;
        });
      }

      const target = document.elementFromPoint(event.clientX, event.clientY);
      if (target?.closest('[data-food-area]')) {
        setCursorState('food');
      } else if (target?.closest('a, button, input, textarea, select, [role="button"]')) {
        setCursorState('interactive');
      } else {
        setCursorState('idle');
      }
    };
    const hideCursor = () => setCursorState('idle');

    window.addEventListener('pointermove', updateCursor, { passive: true });
    window.addEventListener('blur', hideCursor);
    return () => {
      window.removeEventListener('pointermove', updateCursor);
      window.removeEventListener('blur', hideCursor);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
      document.documentElement.classList.remove('food-cursor-active');
    };
  }, []);

  return <div
    aria-hidden="true"
    className={`food-cursor food-cursor--${cursorState}`}
    style={{ left: position.x, top: position.y }}
  >
    <span className="food-cursor__glow" />
    <span className="food-cursor__core"><Flame size={21} strokeWidth={2.2} /></span>
  </div>;
}

function Hero({ onReserve }: { onReserve: () => void }) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 550], [0.95, 0]);
  const photoY = useTransform(scrollY, [0, 550], [0, 280]);
  const bgLayerY = useTransform(scrollY, [0, 550], [0, 90]);
  const textY = useTransform(scrollY, [0, 550], [0, -55]);

  return <section id="top" className="relative min-h-[740px] overflow-hidden bg-[#311d18] text-[#f9f3e9]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_56%,rgba(170,79,37,.3),transparent_28%),linear-gradient(110deg,#281816_5%,#3a211a_54%,#6d3924_100%)]" />
    <motion.div style={{ y: bgLayerY }} className="absolute inset-0">
      <div className="absolute -right-20 top-24 h-[650px] w-[650px] rounded-full border border-[#e8c68c]/10 md:right-[-10px] lg:right-[6%]" />
      <div className="absolute -right-8 top-40 h-[475px] w-[475px] rounded-full border border-[#e8c68c]/10" />
      <div className="absolute right-[14%] top-[27%] h-2 w-2 rounded-full bg-[#eab66d] ember" />
      <div className="absolute right-[24%] top-[35%] h-1.5 w-1.5 rounded-full bg-[#eab66d] ember" style={{ animationDelay: '1.2s' }} />
    </motion.div>
    <motion.div style={{ opacity, y: photoY }} className="absolute bottom-0 right-[6%] hidden h-[85%] w-[55%] max-w-[780px] overflow-hidden rounded-t-[50%] mix-blend-screen md:block">
      <HeroVisual />
      <div className="absolute inset-0 bg-gradient-to-r from-[#311d18] via-transparent to-transparent pointer-events-none" />
    </motion.div>
    <motion.div style={{ y: textY }} className="relative mx-auto flex min-h-[740px] max-w-[1280px] items-end px-5 pb-20 pt-36 md:px-10 md:pb-28">
      <div className="max-w-[720px]">
        <div className="mb-7 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.32em] text-[#d7df9e]"><span className="h-px w-9 bg-[#d7df9e]" /> Thanjavur · Tamil Nadu</div>
        <h1 className="display max-w-[720px] text-[clamp(4rem,9vw,8.8rem)] leading-[.88] tracking-[-.055em]">Good food<br /><span className="text-[#e3b56d]">takes its time.</span></h1>
        <p className="mt-8 max-w-[450px] text-base leading-7 text-[#f1e4d4]/75 md:text-lg">Authentic Yemeni mandi, slow smoke and a table big enough for everyone you brought along.</p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <button data-testid="button-hero-reserve" onClick={onReserve} className="group inline-flex items-center gap-3 rounded-full bg-[#e8d7bd] px-6 py-3.5 text-sm font-bold text-[#35231b] transition-transform hover:-translate-y-1">Save your cabin <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></button>
          <a data-testid="link-hero-menu" href="#menu" className="inline-flex items-center gap-2 rounded-full border border-[#ead8bf]/35 px-6 py-3.5 text-sm font-semibold text-[#f5e8d8] transition-colors hover:border-[#ead8bf]">See the menu</a>
        </div>
        <div data-testid="badge-google-rating" className="mt-8 inline-flex flex-wrap items-center gap-4 rounded-2xl bg-[#f9f3e9] px-5 py-4 text-[#36231a] shadow-[0_20px_50px_rgba(20,12,8,.35)]">
          <div className="flex items-center gap-2.5">
            <span className="display text-3xl leading-none">4.8</span>
            <span className="flex gap-0.5 text-[#e3b56d]" aria-label="4.8 out of 5 stars">
              <Star size={13} fill="currentColor" strokeWidth={0} />
              <Star size={13} fill="currentColor" strokeWidth={0} />
              <Star size={13} fill="currentColor" strokeWidth={0} />
              <Star size={13} fill="currentColor" strokeWidth={0} />
              <Star size={13} fill="currentColor" strokeWidth={0} />
            </span>
          </div>
          <div className="hidden h-9 w-px bg-[#d8c7b2] sm:block" />
          <p className="max-w-[200px] text-xs font-semibold leading-snug text-[#36231a]">Loved by everyone who's <span className="text-[#ad542f]">tasted</span> our mandi.</p>
          <div className="hidden h-9 w-px bg-[#d8c7b2] sm:block" />
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold" style={{ fontFamily: 'arial, sans-serif' }}>
              <span style={{ color: '#4285F4' }}>G</span><span style={{ color: '#EA4335' }}>o</span><span style={{ color: '#FBBC05' }}>o</span><span style={{ color: '#4285F4' }}>g</span><span style={{ color: '#34A853' }}>l</span><span style={{ color: '#EA4335' }}>e</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[.1em] text-[#705346]">Reviews</span>
          </div>
        </div>
        <div className="mt-8 flex items-center gap-7 text-[10px] uppercase tracking-[.18em] text-[#f1e4d4]/55">
          <span className="flex items-center gap-2"><Flame size={14} className="text-[#df9f56]" /> Live charcoal</span>
          <span className="flex items-center gap-2"><Utensils size={14} className="text-[#df9f56]" /> Family dining</span>
        </div>
      </div>
      <div className="absolute bottom-8 right-6 hidden flex-col items-center gap-3 text-[#eee2d1]/50 md:flex"><span className="h-12 w-px bg-[#eee2d1]/25" /><span className="mono text-[9px] tracking-[.2em] [writing-mode:vertical-rl]">SCROLL TO GATHER</span></div>
    </motion.div>
  </section>;
}

function StoryNumeral() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['18%', '-18%']);
  return <div ref={ref} className="mt-10 flex items-center gap-3">
    <motion.span style={{ y }} className="display text-5xl text-[#b85e36]">07</motion.span>
    <span className="max-w-[120px] text-[10px] font-bold uppercase leading-4 tracking-[.14em] text-[#705346]">years of gathering people</span>
  </div>;
}

function Story() {
  return <section id="story" className="bg-[#eee3d2] py-24 text-[#36231a] md:py-36">
    <div className="mx-auto grid max-w-[1280px] gap-16 px-5 md:grid-cols-[.72fr_1.28fr] md:px-10 lg:gap-28">
      <Reveal><div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.28em] text-[#ad542f]"><span className="h-px w-8 bg-[#ad542f]" /> Our table</div><p className="display mt-10 max-w-[280px] text-4xl leading-[1.05] md:text-5xl">From one family kitchen to your favourite table.</p><StoryNumeral /></Reveal>
      <Reveal delay={120}><p className="max-w-[650px] text-2xl leading-[1.35] tracking-[-.02em] md:text-4xl">Mandi is not a dish you rush. It is a little ceremony: the lift of a lid, the first curl of steam, the quiet pause before everyone reaches in.</p><p className="mt-10 max-w-[525px] text-base leading-7 text-[#705346]">At Al Yazi, we keep that ceremony alive. Rice is perfumed with whole spices. Meat is rested, never hurried. The fire stays low and patient until the charcoal leaves its signature.</p><a data-testid="link-story-ritual" href="#ritual" className="mt-9 inline-flex items-center gap-3 border-b border-[#ad542f] pb-2 text-xs font-bold uppercase tracking-[.18em] text-[#ad542f]">See how it comes together <ArrowDown size={14} /></a></Reveal>
    </div>
  </section>;
}

const partySizes = [
  { name: 'Mutton Yemeni Mandi', sizes: [{ label: '1 pax', price: 395 }, { label: '2 pax', price: 790 }, { label: '3 pax', price: 1299 }, { label: '4 pax', price: 1599 }] },
  { name: 'Chicken Alfaham Mandi', sizes: [{ label: '1 pax', price: 270 }, { label: '2 pax', price: 540 }, { label: '3 pax', price: 810 }, { label: '4 pax', price: 1000 }] },
  { name: 'Moroccan Chicken Mandi', sizes: [{ label: '1 pax', price: 290 }, { label: '2 pax', price: 580 }, { label: '3 pax', price: 870 }, { label: '4 pax', price: 1100 }] },
];

function MenuCardImage({ item }: { item: typeof menuItems[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  return <div ref={ref} className="relative aspect-[1.05] overflow-hidden">
    <motion.img src={asset(item.image)} alt={item.name} style={{ y }} whileHover={{ scale: 1.05 }} transition={{ duration: .7 }} className="absolute left-0 top-[-6%] h-[112%] w-full object-cover" />
    <span className="absolute left-3 top-3 rounded-full bg-[#f5eee3]/90 px-3 py-1 text-[9px] font-bold uppercase tracking-[.15em] text-[#ad542f]">{item.note}</span>
  </div>;
}

function MenuSection({ onOrder }: { onOrder: (name: string) => void }) {
  const [filter, setFilter] = useState('Mandi');
  const categories = ['Mandi', 'Charcoal', 'To begin', 'Sweet'];
  const filtered = useMemo(() => menuItems.filter((item) => item.category === filter), [filter]);
  return <section id="menu" className="bg-[#f5eee3] py-24 text-[#36231a] md:py-32">
    <div className="mx-auto max-w-[1280px] px-5 md:px-10">
      <Reveal><div className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.28em] text-[#ad542f]"><span className="h-px w-8 bg-[#ad542f]" /> What we make</div><h2 className="display mt-4 text-6xl leading-[.95] tracking-[-.045em] md:text-8xl">The menu,<br /><span className="text-[#b85e36]">unhurried.</span></h2></div><p className="max-w-[300px] text-sm leading-6 text-[#705346]">A short menu, made properly. Order for one or bring a crowd. There is always room for one more plate.</p></div></Reveal>
      <div className="mt-12 flex gap-2 overflow-x-auto border-b border-[#d8c7b2] pb-3 no-scrollbar">
        {categories.map((category) => <button data-testid={`button-menu-filter-${category.toLowerCase().replace(' ', '-')}`} key={category} onClick={() => setFilter(category)} className={`shrink-0 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[.15em] transition-colors ${filter === category ? 'bg-[#3a241a] text-[#f7eddf]' : 'text-[#80675a] hover:bg-[#e8d9c8]'}`}>{category}</button>)}
        <a data-testid="link-full-menu-image" href="#full-menu" className="ml-auto flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[.15em] text-[#ad542f]">Full menu <ArrowRight size={14} /></a>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((item, index) => <Reveal key={item.id} delay={index * 80}><article data-testid={`card-menu-item-${item.id}`} data-food-area className="group overflow-hidden rounded-[1.15rem] border border-[#ddcbb8] bg-[#eee3d2] transition-transform hover:-translate-y-1">
          <MenuCardImage item={item} />
          <div className="p-5"><div className="flex items-start justify-between gap-3"><h3 className="display text-2xl leading-none">{item.name}</h3><span className="mono shrink-0 text-sm font-bold text-[#ad542f]">₹{item.price}</span></div><p className="mt-3 text-sm leading-5 text-[#80675a]">{item.description}</p><button data-testid={`button-order-${item.id}`} onClick={() => onOrder(item.name)} className="mt-5 inline-flex items-center gap-2 border-b border-[#ad542f]/50 pb-1 text-[10px] font-bold uppercase tracking-[.17em] text-[#ad542f] transition-colors hover:border-[#ad542f]">Add to WhatsApp <Plus size={13} /></button></div>
        </article></Reveal>)}
      </div>
      <div id="full-menu" className="mt-16 grid gap-4 md:grid-cols-2"><div className="relative overflow-hidden rounded-2xl bg-[#241714] p-7 text-[#f6eddf] md:p-10"><div className="absolute -right-4 -top-8 h-40 w-40 rounded-full border border-[#e7b36c]/25" /><span className="mono text-[9px] uppercase tracking-[.24em] text-[#e2b26b]">A proper spread</span><h3 className="display mt-5 max-w-[370px] text-4xl leading-[1.04]">One tray. Four hungry people. Zero small talk.</h3><p className="mt-5 max-w-[400px] text-sm leading-6 text-[#ddcbb8]/70">Ask about today's family platter — chicken or mutton, with all the sides for passing around.</p><WhatsAppButton compact label="Ask about the family platter" /></div><div className="relative overflow-hidden rounded-2xl border border-[#d8c7b2] bg-[#e7dac9] p-7 md:p-10"><span className="mono text-[9px] uppercase tracking-[.24em] text-[#ad542f]">Built for the table</span><h3 className="display mt-4 text-3xl leading-[1.05]">Party sizes,<br />priced simply.</h3><div className="mt-7 space-y-5">{partySizes.map((dish) => <div key={dish.name} data-testid={`row-party-size-${dish.name.toLowerCase().replace(/\s+/g, '-')}`}><p className="text-[11px] font-bold uppercase tracking-[.15em] text-[#80675a]">{dish.name}</p><div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">{dish.sizes.map((s) => <span key={s.label} className="flex items-baseline gap-1.5 text-sm"><span className="text-[#36231a]/70">{s.label}</span><span className="mono font-bold text-[#ad542f]">₹{s.price}</span></span>)}</div></div>)}</div></div></div>
    </div>
  </section>;
}

function Ritual() {
  const [step, setStep] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: ritualProgress } = useScroll({ target: imageRef, offset: ['start end', 'end start'] });
  const ritualImageY = useTransform(ritualProgress, [0, 1], ['-10%', '10%']);
  const steps = [
    { number: '01', title: 'The overnight spice', copy: 'Every cut gets its own rub: black lime, cumin, cardamom and a little patience. We let the flavour travel all the way in.', image: 'mutton-spice-rub.jpg' },
    { number: '02', title: 'A low, steady fire', copy: 'The mandi pit is not a shortcut. Gentle heat seals in the tenderness and leaves the rice with a beautiful, smoky perfume.', image: 'photos-1787821057941-j4z5.jpeg' },
    { number: '03', title: 'The lift of the lid', copy: 'This is the moment. Steam, toasted nuts, saffron rice and the table leaning closer. Some things are worth waiting for.', image: 'photos-1787821057993-s1hz.jpeg' },
    { number: '04', title: 'Pass it around', copy: 'Mandi belongs in the middle. Take what you like, make room for another hand and stay for one more story.', image: 'photos-1787821057825-tggp.png' },
  ];
  return <section id="ritual" className="relative overflow-hidden bg-[#36211a] py-24 text-[#f8efe4] md:py-32"><div className="absolute inset-0 opacity-35" style={{ backgroundImage: `radial-gradient(circle at 30% 20%, rgba(194,90,44,.35), transparent 35%), radial-gradient(circle at 80% 80%, rgba(226,174,88,.18), transparent 28%)` }} /><div className="relative mx-auto max-w-[1280px] px-5 md:px-10"><Reveal><div className="flex items-end justify-between"><div><div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.28em] text-[#d7df9e]"><span className="h-px w-8 bg-[#d7df9e]" /> The ritual</div><h2 className="display mt-4 max-w-[660px] text-6xl leading-[.94] tracking-[-.045em] md:text-8xl">Fire makes<br /><span className="text-[#e4b76f]">the memory.</span></h2></div><div className="hidden h-16 w-16 items-center justify-center rounded-full border border-[#ead8bf]/25 md:flex"><Flame className="text-[#e4b76f]" size={24} /></div></div></Reveal>
      <div className="mt-16 grid gap-10 lg:grid-cols-[.74fr_1.26fr] lg:gap-20"><div>{steps.map((item, index) => <button data-testid={`button-ritual-step-${index + 1}`} key={item.number} onClick={() => setStep(index)} className={`group flex w-full gap-5 border-t border-[#ead8bf]/20 py-6 text-left transition-colors ${step === index ? 'text-[#f8efe4]' : 'text-[#ead8bf]/45 hover:text-[#ead8bf]/80'}`}><span className={`mono pt-1 text-[11px] ${step === index ? 'text-[#e4b76f]' : ''}`}>{item.number}</span><span><strong className="display block text-2xl font-medium">{item.title}</strong><span className={`mt-2 block max-w-[380px] text-sm leading-6 ${step === index ? 'text-[#ead8bf]/72' : 'hidden'}`}>{item.copy}</span></span><ArrowRight size={18} className={`ml-auto mt-1 transition-transform ${step === index ? 'translate-x-0 text-[#e4b76f]' : '-translate-x-2 opacity-0'}`} /></button>)}</div><div ref={imageRef} className="relative min-h-[420px] overflow-hidden rounded-[1.2rem]"><motion.img key={steps[step].image} src={asset(steps[step].image)} alt={steps[step].title} style={{ y: ritualImageY }} className="absolute left-0 top-[-10%] h-[120%] w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#291916]/80 via-transparent to-transparent" /><div className="steam absolute bottom-8 left-[38%] h-20 w-12 rounded-full border-l-2 border-[#f8efe4]/25" /><div className="absolute bottom-7 left-7"><span className="mono text-[9px] uppercase tracking-[.2em] text-[#d7df9e]">Step {steps[step].number}</span><p className="display mt-2 text-3xl">{steps[step].title}</p></div></div></div>
    </div></section>;
}

function GalleryTile({ item, index, onOpen }: { item: typeof gallery[number]; index: number; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-9%', '9%']);
  return <button data-testid={`button-gallery-${index + 1}`} ref={ref} onClick={onOpen} className={`group relative overflow-hidden rounded-xl text-left ${item.size === 'large' ? 'col-span-2 row-span-2 aspect-[1.2] md:aspect-auto' : item.size === 'tall' ? 'row-span-2 aspect-[.78] md:aspect-auto' : item.size === 'wide' ? 'col-span-2 aspect-[2.1]' : 'aspect-square'}`}>
    <motion.img src={asset(item.image)} alt={item.label} style={{ y }} whileHover={{ scale: 1.05 }} transition={{ duration: .7 }} className="absolute left-0 top-[-10%] h-[120%] w-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#241714]/75 via-transparent to-transparent opacity-80" />
    <span className="absolute bottom-4 left-4 right-4 text-sm font-semibold text-[#f8efe4]">{item.label}</span>
  </button>;
}

function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  return <section id="gallery" className="bg-[#e7d9c8] py-24 text-[#36231a] md:py-32"><div className="mx-auto max-w-[1280px] px-5 md:px-10"><Reveal><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.28em] text-[#ad542f]"><span className="h-px w-8 bg-[#ad542f]" /> Around our table</div><h2 className="display mt-4 text-6xl leading-[.92] tracking-[-.05em] md:text-8xl">Come hungry.<br /><span className="text-[#b85e36]">Leave lighter.</span></h2></div><p className="max-w-[250px] text-sm leading-6 text-[#705346]">A few frames from the room, the fire and the plates that keep disappearing.</p></div></Reveal><div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-5">{gallery.map((item, index) => <GalleryTile key={item.image} item={item} index={index} onOpen={() => setSelected(index)} />)}</div></div>
    {selected !== null && <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c1210]/90 p-5 backdrop-blur-sm" onClick={() => setSelected(null)}><button data-testid="button-gallery-close" className="absolute right-5 top-5 rounded-full border border-[#f8efe4]/30 p-2 text-[#f8efe4]" onClick={() => setSelected(null)}><X size={21} /></button><button data-testid="button-gallery-prev" className="absolute left-4 rounded-full border border-[#f8efe4]/30 p-2 text-[#f8efe4] md:left-8" onClick={(e) => { e.stopPropagation(); setSelected((selected - 1 + gallery.length) % gallery.length); }}><ChevronLeft size={22} /></button><img src={asset(gallery[selected].image)} alt={gallery[selected].label} className="max-h-[82vh] max-w-[min(90vw,1000px)] rounded-lg object-contain" onClick={(e) => e.stopPropagation()} /><button data-testid="button-gallery-next" className="absolute right-4 rounded-full border border-[#f8efe4]/30 p-2 text-[#f8efe4] md:right-8" onClick={(e) => { e.stopPropagation(); setSelected((selected + 1) % gallery.length); }}><ChevronRight size={22} /></button></div>}
  </section>;
}

function Catering({ onReserve }: { onReserve: () => void }) {
  const [sent, setSent] = useState(false);
  const [guests, setGuests] = useState('30–50 guests');
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  const cateringImageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: cateringProgress } = useScroll({ target: cateringImageRef, offset: ['start end', 'end start'] });
  const cateringImageY = useTransform(cateringProgress, [0, 1], ['-10%', '10%']);
  return <section id="catering" className="bg-[#f5eee3] py-24 text-[#36231a] md:py-32"><div className="mx-auto grid max-w-[1280px] gap-12 px-5 md:px-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-24"><Reveal><div ref={cateringImageRef} className="relative min-h-[560px] overflow-hidden rounded-[1.25rem] bg-[#2e1b16]"><motion.img src={asset('catering-family-platter.jpg')} alt="Mandi family platter in copper servingware" style={{ y: cateringImageY }} className="absolute left-0 top-[-10%] h-[120%] w-full object-cover opacity-80 mix-blend-screen" /><div className="absolute inset-0 bg-gradient-to-t from-[#261613] via-transparent to-[#261613]/15" /><div className="absolute bottom-7 left-7 right-7 text-[#f8efe4]"><span className="mono text-[9px] uppercase tracking-[.2em] text-[#d7df9e]">For the big days</span><p className="display mt-3 max-w-[450px] text-4xl leading-[1.02]">Let us bring the whole table to you.</p></div><div className="absolute right-6 top-6 rounded-full border border-[#f8efe4]/25 px-3 py-2 text-[9px] font-bold uppercase tracking-[.15em] text-[#f8efe4]">Catering · 15 to 300</div></div></Reveal><Reveal delay={100}><div className="pt-2 lg:pt-12"><div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.28em] text-[#ad542f]"><span className="h-px w-8 bg-[#ad542f]" /> Bring us along</div><h2 className="display mt-5 text-5xl leading-[.97] tracking-[-.04em] md:text-7xl">Some occasions<br />need <span className="text-[#b85e36]">more rice.</span></h2><p className="mt-7 max-w-[470px] text-base leading-7 text-[#705346]">Weddings, office lunches, naming ceremonies or a Sunday that got wonderfully out of hand. We bring the fire, the trays and the good part of the evening.</p><form onSubmit={submit} className="mt-9 space-y-3">{sent ? <div className="flex items-start gap-3 rounded-xl border border-[#adc37f] bg-[#e4edcc] p-5 text-[#40522c]"><Check className="mt-0.5 shrink-0" size={18} /><div><strong className="block">We have your note.</strong><span className="mt-1 block text-sm">Our catering table will call you shortly to talk portions and timing.</span></div></div> : <><div className="grid gap-3 sm:grid-cols-2"><input data-testid="input-catering-name" required placeholder="Your name" className="rounded-lg border border-[#d8c7b2] bg-[#eee3d2] px-4 py-3 text-sm outline-none placeholder:text-[#9b8170] focus:border-[#ad542f]" /><input data-testid="input-catering-phone" required type="tel" placeholder="Phone number" className="rounded-lg border border-[#d8c7b2] bg-[#eee3d2] px-4 py-3 text-sm outline-none placeholder:text-[#9b8170] focus:border-[#ad542f]" /></div><div className="grid gap-3 sm:grid-cols-2"><select data-testid="select-catering-guests" value={guests} onChange={(e) => setGuests(e.target.value)} className="rounded-lg border border-[#d8c7b2] bg-[#eee3d2] px-4 py-3 text-sm outline-none focus:border-[#ad542f]"><option>15–30 guests</option><option>30–50 guests</option><option>50–100 guests</option><option>100+ guests</option></select><input data-testid="input-catering-date" type="date" className="rounded-lg border border-[#d8c7b2] bg-[#eee3d2] px-4 py-3 text-sm outline-none focus:border-[#ad542f]" /></div><textarea data-testid="input-catering-note" rows={3} placeholder="Tell us a little about the day" className="w-full rounded-lg border border-[#d8c7b2] bg-[#eee3d2] px-4 py-3 text-sm outline-none placeholder:text-[#9b8170] focus:border-[#ad542f]" /><button data-testid="button-submit-catering" className="inline-flex items-center gap-2 rounded-full bg-[#ad542f] px-6 py-3.5 text-sm font-bold text-[#f9f3e9] transition-transform hover:-translate-y-1">Start a catering conversation <Send size={16} /></button></>}</form><button data-testid="button-catering-reserve" onClick={onReserve} className="mt-5 text-xs font-bold uppercase tracking-[.15em] text-[#ad542f] hover:underline">Just dining in? Reserve a cabin</button></div></Reveal></div></section>;
}

// ---------------------------------------------------------------------------
// Cabin reservation
// ---------------------------------------------------------------------------

const CABIN_COUNT = 5;
const MAX_GUESTS = 10;
const SLOT_MINUTES = 60;
const SLOT_STEP_MINUTES = 30;
const BUSINESS_START = '11:30';
const BUSINESS_END = '22:00';

type BookedRange = { start: string; end: string };
type CabinAvailability = { id: number; name: string; bookedRanges: BookedRange[] };

function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}
function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}
function formatTimeLabel(hhmm: string): string {
  const mins = timeToMinutes(hhmm);
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}
function todayIsoDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
}
function slotStartTimes(): string[] {
  const times: string[] = [];
  const lastStart = timeToMinutes(BUSINESS_END) - SLOT_MINUTES;
  for (let t = timeToMinutes(BUSINESS_START); t <= lastStart; t += SLOT_STEP_MINUTES) {
    times.push(minutesToTime(t));
  }
  return times;
}
function isSlotFree(range: BookedRange[], start: string, end: string): boolean {
  const s = timeToMinutes(start);
  const e = timeToMinutes(end);
  return !range.some((r) => timeToMinutes(r.start) < e && timeToMinutes(r.end) > s);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const BOOKING_ERROR_MESSAGES: Record<string, string> = {
  invalid_email: "That email address doesn't look right — please check it.",
  disposable_email: "Please use a real, regularly-checked email address (temporary/throwaway addresses aren't accepted).",
  undeliverable_email: "We couldn't verify that email domain can receive mail — please double-check it.",
  cabin_unavailable: 'That slot was just taken by another guest — pick a different one.',
  outside_hours: 'That time is outside our booking hours (11:30 AM – 10:00 PM).',
  invalid_input: "Please fill in every field before requesting a cabin.",
};

function ReservationModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(todayIsoDate());
  const [guests, setGuests] = useState(4);
  const [cabins, setCabins] = useState<CabinAvailability[] | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selection, setSelection] = useState<{ cabinId: number; start: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [done, setDone] = useState<{ cabinName: string; start: string; end: string; emailSent: boolean } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingSlots(true);
    setSelection(null);
    setErrorMsg('');
    fetch(`/api/bookings/availability?date=${encodeURIComponent(date)}`)
      .then((r) => r.json())
      .then((result) => {
        if (cancelled) return;
        if (result?.ok) setCabins(result.cabins);
        else setCabins(null);
      })
      .catch(() => { if (!cancelled) setCabins(null); })
      .finally(() => { if (!cancelled) setLoadingSlots(false); });
    return () => { cancelled = true; };
  }, [date]);

  const times = useMemo(() => slotStartTimes(), []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg('');
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setErrorMsg(BOOKING_ERROR_MESSAGES.invalid_input);
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setErrorMsg(BOOKING_ERROR_MESSAGES.invalid_email);
      return;
    }
    if (!selection) {
      setErrorMsg('Pick an available cabin and time slot.');
      return;
    }
    const startDatetime = `${date}T${selection.start}`;
    const endDatetime = `${date}T${minutesToTime(timeToMinutes(selection.start) + SLOT_MINUTES)}`;
    setSubmitting(true);
    try {
      const resp = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ cabinId: selection.cabinId, name: name.trim(), phone: phone.trim(), email: email.trim(), startDatetime, endDatetime, guests }),
      });
      const result = await resp.json();
      if (!resp.ok || !result.ok) {
        setErrorMsg(BOOKING_ERROR_MESSAGES[result.error] || 'Something went wrong — please try again.');
        if (result.error === 'cabin_unavailable') {
          // Refresh the grid so the guest sees the slot is gone.
          setSelection(null);
          fetch(`/api/bookings/availability?date=${encodeURIComponent(date)}`)
            .then((r) => r.json())
            .then((r) => { if (r?.ok) setCabins(r.cabins); });
        }
        return;
      }
      const cabinName = cabins?.find((c) => c.id === selection.cabinId)?.name || `Cabin ${selection.cabinId}`;
      setDone({ cabinName, start: selection.start, end: minutesToTime(timeToMinutes(selection.start) + SLOT_MINUTES), emailSent: !!result.emailSent });
    } catch {
      setErrorMsg('Could not reach the server — please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-end justify-center bg-[#1c1210]/70 p-0 backdrop-blur-sm md:items-center md:p-5" onClick={onClose}>
    <div className="max-h-[92vh] w-full max-w-[620px] overflow-y-auto rounded-t-[1.5rem] bg-[#f5eee3] p-6 text-[#36231a] md:rounded-[1.5rem] md:p-9" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-start justify-between">
        <div><span className="mono text-[9px] uppercase tracking-[.2em] text-[#ad542f]">Your place in the cabin</span><h2 className="display mt-2 text-4xl">Reserve a cabin</h2></div>
        <button data-testid="button-reservation-close" onClick={onClose} className="rounded-full border border-[#d8c7b2] p-2"><X size={18} /></button>
      </div>

      {done ? (
        <div className="my-12 rounded-xl bg-[#e4edcc] p-6 text-center text-[#40522c]">
          <Check className="mx-auto mb-3" />
          <h3 className="display text-3xl">Your cabin is reserved.</h3>
          <p className="mt-2 text-sm">{done.cabinName} · {formatTimeLabel(done.start)} – {formatTimeLabel(done.end)}</p>
          <p className="mt-3 text-sm">{done.emailSent ? `We've sent a confirmation to ${email}.` : "We couldn't send a confirmation email — please save your details, your cabin is still reserved."}</p>
          <button data-testid="button-reservation-done" onClick={onClose} className="mt-6 rounded-full bg-[#3a241a] px-5 py-2.5 text-xs font-bold uppercase tracking-[.15em] text-[#f9f3e9]">Done</button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-7 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#705346]">Name
              <input data-testid="input-reservation-name" required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 w-full rounded-lg border border-[#d8c7b2] bg-[#eee3d2] px-4 py-3 text-sm outline-none focus:border-[#ad542f]" />
            </label>
            <label className="text-xs font-semibold text-[#705346]">Phone
              <input data-testid="input-reservation-phone" required type="tel" placeholder="+91" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5 w-full rounded-lg border border-[#d8c7b2] bg-[#eee3d2] px-4 py-3 text-sm outline-none focus:border-[#ad542f]" />
            </label>
          </div>
          <label className="block text-xs font-semibold text-[#705346]">Email
            <input data-testid="input-reservation-email" required type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-lg border border-[#d8c7b2] bg-[#eee3d2] px-4 py-3 text-sm outline-none focus:border-[#ad542f]" />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#705346]">Date
              <input data-testid="input-reservation-date" required type="date" min={todayIsoDate()} value={date} onChange={(e) => setDate(e.target.value)} onClick={(e) => e.currentTarget.showPicker?.()} className="mt-1.5 w-full rounded-lg border border-[#d8c7b2] bg-[#eee3d2] px-4 py-3 text-sm outline-none focus:border-[#ad542f] cursor-pointer" />
            </label>
            <div>
              <span className="text-xs font-semibold text-[#705346]">Guests (max {MAX_GUESTS})</span>
              <div className="mt-1.5 flex items-center gap-3">
                <button type="button" data-testid="button-reservation-minus" onClick={() => setGuests((n) => Math.max(1, n - 1))} className="rounded-full border border-[#d8c7b2] p-2 hover:bg-[#e8d9c8]"><Minus size={16} /></button>
                <span data-testid="text-reservation-guests" className="mono w-8 text-center">{guests}</span>
                <button type="button" data-testid="button-reservation-plus" onClick={() => setGuests((n) => Math.min(MAX_GUESTS, n + 1))} className="rounded-full border border-[#d8c7b2] p-2 hover:bg-[#e8d9c8]"><Plus size={16} /></button>
              </div>
            </div>
          </div>

          <p className="text-[10px] uppercase tracking-[.12em] text-[#9b8170]">Bookings allowed {formatTimeLabel(BUSINESS_START)} – {formatTimeLabel(BUSINESS_END)} · each slot is up to 1 hour</p>

          <div>
            <span className="text-xs font-semibold text-[#705346]">Cabin</span>
            {loadingSlots ? (
              <p className="mt-2 text-sm text-[#9b8170]">Checking availability…</p>
            ) : !cabins ? (
              <p className="mt-2 text-sm text-[#9b8170]">Choose a date to see available cabins.</p>
            ) : (
              <div className="mt-2 space-y-2.5 overflow-x-auto">
                {cabins.map((cabin) => (
                  <div key={cabin.id} className="flex items-center gap-3">
                    <span className="mono w-16 shrink-0 text-[11px] font-bold text-[#705346]">{cabin.name}</span>
                    <div className="grid flex-1 grid-cols-4 gap-1.5 sm:grid-cols-6">
                      {times.map((start) => {
                        const end = minutesToTime(timeToMinutes(start) + SLOT_MINUTES);
                        const free = isSlotFree(cabin.bookedRanges, start, end);
                        const isSelected = selection?.cabinId === cabin.id && selection.start === start;
                        return (
                          <button
                            key={start}
                            type="button"
                            data-testid={`slot-cabin-${cabin.id}-${start}`}
                            disabled={!free}
                            data-selected={isSelected}
                            className="reservation-slot"
                            onClick={() => setSelection({ cabinId: cabin.id, start })}
                          >
                            {formatTimeLabel(start).replace(' ', '')}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {selection && <p className="mt-3 text-sm font-semibold text-[#3a241a]">Selected: {cabins?.find((c) => c.id === selection.cabinId)?.name} · {formatTimeLabel(selection.start)} – {formatTimeLabel(minutesToTime(timeToMinutes(selection.start) + SLOT_MINUTES))}</p>}
          </div>

          {errorMsg && <p role="alert" className="rounded-lg border border-[#d99a7a] bg-[#f6ddd0] px-4 py-3 text-sm text-[#7a2f14]">{errorMsg}</p>}

          <button data-testid="button-submit-reservation" disabled={submitting || !selection} className="mt-2 w-full rounded-full bg-[#ad542f] px-5 py-3.5 text-sm font-bold text-[#f9f3e9] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0">{submitting ? 'Requesting…' : 'Request this cabin'}</button>
          <p className="text-center text-[10px] uppercase tracking-[.12em] text-[#9b8170]">We hold cabins for a maximum of 10 minutes</p>
        </form>
      )}
    </div>
  </div>;
}

function Footer({ onReserve }: { onReserve: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress: footerProgress } = useScroll({ target: headingRef, offset: ['start end', 'end start'] });
  const headingY = useTransform(footerProgress, [0, 1], ['16%', '-16%']);
  return <footer id="visit" className="bg-[#271714] text-[#f8efe4]"><div className="mx-auto grid max-w-[1280px] gap-14 px-5 py-20 md:px-10 lg:grid-cols-[1.2fr_.8fr_.8fr] lg:py-28"><div><Logo light /><motion.h2 ref={headingRef} style={{ y: headingY }} className="display mt-8 max-w-[400px] text-5xl leading-[.98] md:text-6xl">Come for the mandi.<br /><span className="text-[#e4b76f]">Stay for the stories.</span></motion.h2><div className="mt-9 flex flex-wrap gap-3"><WhatsAppButton /><button data-testid="button-footer-reserve" onClick={onReserve} className="rounded-full border border-[#ead8bf]/35 px-5 py-3 text-sm font-bold text-[#f8efe4] hover:border-[#ead8bf]">Reserve a cabin</button></div></div><div><span className="mono text-[9px] uppercase tracking-[.2em] text-[#d7df9e]">Find us</span><p className="mt-5 text-sm leading-6 text-[#ddcbb8]/70">AP Complex, opposite SIDCO Industrial Estate,<br />Nanjikottai Road, Thanjavur, Tamil Nadu 613006</p><a data-testid="link-footer-map" href="https://maps.google.com/?q=Al+Yazi+Mandi+Restaurant+Nanjikottai+Thanjavur" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.13em] text-[#e4b76f]">Get directions <ArrowRight size={14} /></a></div><div><span className="mono text-[9px] uppercase tracking-[.2em] text-[#d7df9e]">Hours</span><div className="mt-5 space-y-3 text-sm text-[#ddcbb8]/70"><p><strong className="block text-[#f8efe4]">Every day</strong>12:00 noon – 10:00 PM</p></div><a data-testid="link-footer-instagram" href="https://instagram.com/alyazi_mandi" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.13em] text-[#e4b76f]"><Instagram size={15} /> @alyazi_mandi</a></div></div><div className="border-t border-[#ead8bf]/15"><div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-5 py-6 text-[10px] uppercase tracking-[.15em] text-[#ddcbb8]/40 md:flex-row md:justify-between md:px-10"><div className="flex flex-wrap items-center gap-x-5 gap-y-2"><span>© 2024 Al Yazi Mandi</span><a data-testid="link-staff-access" href="/staff/billing/" className="text-[#ddcbb8]/40 transition-colors hover:text-[#e4b76f]">Staff access</a></div><span>Made for the middle of the table</span></div></div></footer>;
}

function FloatingWhatsApp() {
  return <a data-testid="link-floating-whatsapp" href={waHref(WHATSAPP_NUMBER.intl, 'Hello Al Yazi Mandi')} target="_blank" rel="noreferrer" className="fixed bottom-5 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-[#c9da9b] text-[#26341e] shadow-lg transition-transform hover:scale-105 md:bottom-7 md:right-7"><MessageCircle size={20} /></a>;
}

function OrderToast({ text }: { text: string }) {
  return <div data-testid="status-order-toast" className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 flex-wrap items-center gap-3 rounded-full bg-[#2d1b17] px-5 py-3 text-sm text-[#f8efe4] shadow-xl">
    <Check size={16} className="text-[#d7df9e]" /> {text}
    <span className="flex items-center gap-2 text-xs font-bold text-[#d7df9e]">
      WhatsApp:
      <a data-testid={`link-toast-whatsapp-${WHATSAPP_NUMBER.intl}`} href={waHref(WHATSAPP_NUMBER.intl)} target="_blank" rel="noreferrer" className="hover:underline">{WHATSAPP_NUMBER.display}</a>
    </span>
  </div>;
}

function Home() {
  const [reservationOpen, setReservationOpen] = useState(false);
  const [orderToast, setOrderToast] = useState('');
  const onOrder = (name: string) => { setOrderToast(`${name} is ready to order`); window.setTimeout(() => setOrderToast(''), 3500); };
  return <div className="noise min-h-[100dvh] bg-[#f5eee3]"><FoodCursor /><Navigation onReserve={() => setReservationOpen(true)} /><main><Hero onReserve={() => setReservationOpen(true)} /><Story /><MenuSection onOrder={onOrder} /><Ritual /><Gallery /><Catering onReserve={() => setReservationOpen(true)} /><section className="bg-[#e7d9c8] px-5 pb-24 md:px-10 md:pb-32"><div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-8 rounded-[1.25rem] bg-[#d7df9e] p-8 text-[#34261c] md:flex-row md:items-center md:p-12"><div><span className="mono text-[9px] uppercase tracking-[.2em] text-[#59633b]">No waiting by the phone</span><h2 className="display mt-3 text-4xl leading-none md:text-5xl">Hungry now? We get it.</h2><p className="mt-3 text-sm text-[#59633b]">Call ahead or send us a WhatsApp. We will have the coals going.</p></div><div className="flex flex-wrap gap-3"><WhatsAppButton label="Order your mandi" /><CallButton label={<><Phone size={16} /> Call us</>} className="inline-flex items-center gap-2 rounded-full border border-[#59633b]/35 px-5 py-3 text-sm font-bold text-[#34261c]" /></div></div></section></main><Footer onReserve={() => setReservationOpen(true)} />{reservationOpen && <ReservationModal onClose={() => setReservationOpen(false)} />}{orderToast && <OrderToast text={orderToast} />}<FloatingWhatsApp /></div>;
}

function StaffBillingEntry() {
  useEffect(() => {
    window.location.replace('/staff/billing/index.html');
  }, []);
  return <div className="min-h-screen bg-[#f5eee3]" aria-label="Opening staff sign in" />;
}

function Router() {
  return <ErrorBoundary resetKey={useLocation()[0]}><Switch><Route path="/" component={Home} /><Route path="/staff/billing" component={StaffBillingEntry} /><Route path="/staff/billing/" component={StaffBillingEntry} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter>;
}

export default App;
