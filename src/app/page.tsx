"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Phone, Mail, MapPin, Leaf, Award, Handshake,
  ArrowRight, Menu, X, CheckCircle2, Sprout,
  MessageCircle, Star, Zap, Shield, TrendingUp, Building2,
  UtensilsCrossed, Fish, Home, Sparkles, Factory,
} from "lucide-react";

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const NAV_LINKS = [
  { label: "Accueil", href: "#accueil" },
  { label: "Produits", href: "#produits" },
  { label: "Activités", href: "#activites" },
  { label: "Partenariats", href: "#partenariats" },
  { label: "Équipe", href: "#equipe" },
  { label: "Contact", href: "#contact" },
];

const PRODUCTS = [
  { name: "Arachides Grillées", brand: "Nkalanga Yetu", desc: "Le vrai goût des arachides grillées, fraîches, croquantes et savoureuses à chaque bouchée.", img: "/images/arachides-grillees.jpg", tag: "Best-seller", gradient: "from-amber-600 to-orange-700" },
  { name: "Arachides Caramélisées", brand: "Mwaiseni", desc: "Enrobées d’un caramel doré, un plaisir gourmand et irrésistible unique en son genre.", img: "/images/arachides-caramelisees.jpg", tag: "Populaire", gradient: "from-yellow-600 to-amber-700" },
  { name: "Croquants Croq d'Or", brand: "Croq d'Or", desc: "Croustillants, savoureux, sans conservateurs. Le plaisir artisanal à chaque bouchée.", img: "/images/croquants.jpg", tag: "Artisanal", gradient: "from-orange-600 to-red-700" },
  { name: "Gaufres", brand: "Mwaiseni", desc: "Fabriquées localement avec soin pour toute la famille. Qualité garantie.", img: "/images/gaufres.jpg", tag: "Familial", gradient: "from-yellow-500 to-orange-600" },
  { name: "Feuilles de Djeka", brand: "Mwaiseni", desc: "Feuilles de jute fraîches, riches en fer et en nutriments. Un super-aliment local pour une alimentation saine.", img: "/images/feuilles-djeka.jpg", tag: "Nouveau", gradient: "from-green-600 to-emerald-700" },
];

const ACTIVITIES = [
  { icon: Building2, title: "Location d’Appartements", desc: "Des logements modernes et bien entretenus pour particuliers et professionnels.", color: "from-slate-400 to-slate-600" },
  { icon: Sprout, title: "Agriculture & Élevage", desc: "Fermes productives, cultures vivrières et élevage de qualité pour l’autosuffisance alimentaire.", color: "from-green-500 to-emerald-700" },
  { icon: Fish, title: "Pisciculture & Porcherie", desc: "Pisciculture moderne et élevage porcin pour une production protéique durable.", color: "from-cyan-500 to-blue-600" },
  { icon: Building2, title: "Tourisme & Hôtellerie", desc: "Bar, hôtel et restaurant pour un accueil de qualité et une expérience unique.", color: "from-purple-500 to-violet-600" },
  { icon: UtensilsCrossed, title: "Service Traiteur", desc: "Des mets raffinés pour vos événements : mariages, réceptions et cérémonies.", color: "from-amber-500 to-orange-600" },
  { icon: Sparkles, title: "Service de Nettoyage", desc: "Nettoyage professionnel de locaux, bureaux et espaces commerciaux.", color: "from-teal-500 to-green-600" },
  { icon: Factory, title: "Transformation Agro-alimentaire", desc: "Notre cœur de métier : transformer les produits de la ferme en produits finis artisanaux.", color: "from-orange-500 to-red-600" },
  { icon: Home, title: "Ferme Intégrée", desc: "Un écosystème complet de la production à la transformation, de la ferme à l’assiette.", color: "from-lime-500 to-green-600" },
];

const VALUES = [
  { icon: Shield, title: "Qualité", desc: "Des produits et services aux normes les plus élevées, contrôlés à chaque étape." },
  { icon: Leaf, title: "Traçabilité", desc: "De la source à la livraison, chaque produit est suivi et certifié." },
  { icon: TrendingUp, title: "Durabilité", desc: "Un engagement envers le développement durable et l’économie locale." },
];

const STATS = [
  { value: "500+", label: "Clients satisfaits" },
  { value: "5", label: "Produits artisanaux" },
  { value: "50+", label: "Points de vente" },
  { value: "100%", label: "Naturel" },
];

const PARTNER_BENEFITS = [
  "Prix spéciaux réservés aux partenaires",
  "Commandes en gros avec livraisons fiables",
  "Bénéfices attractifs et réguliers",
  "Accompagnement et support commercial",
  "Produits à forte demande locale",
  "Stock permanent disponible",
];

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */

function FadeIn({ children, className = "", delay = 0, direction = "up" }: {
  children: React.ReactNode; className?: string; delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const d = { up: { y: 60, x: 0 }, down: { y: -60, x: 0 }, left: { x: 80, y: 0 }, right: { x: -80, y: 0 } }[direction];
  return (
    <motion.div ref={ref} initial={{ opacity: 0, ...d }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function CountUp({ target }: { target: string }) {
  const [display, setDisplay] = useState("");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const num = parseInt(target.replace(/[^0-9]/g, ""));
    const suf = target.replace(/[0-9]/g, "");
    let cur = 0;
    const step = Math.max(1, Math.floor(num / 100));
    const t = setInterval(() => { cur = Math.min(cur + step, num); setDisplay(cur + suf); if (cur >= num) clearInterval(t); }, 16);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{inView ? display : "0"}</span>;
}

function SectionBadge({ children, variant = "green" }: { children: React.ReactNode; variant?: "green" | "amber" }) {
  const colors = {
    green: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${colors[variant]}`}>{children}</span>;
}

function MarqueeBand() {
  const items = ["Nkalanga Yetu", "★", "100% Naturel", "★", "Qualité Premium", "★", "De la Ferme à l’Assiette", "★", "Lubumbashi", "★", "Mwaiseni Services SARL", "★"];
  return (
    <div className="relative overflow-hidden bg-[#0B1F13] py-4 border-y border-white/5">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="mx-8 text-sm font-bold uppercase tracking-[0.3em] text-white/20">{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   NAVBAR (always dark, glass effect)
   ═══════════════════════════════════════════ */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 60); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#0B1F13]/95 backdrop-blur-2xl shadow-2xl shadow-black/30 border-b border-white/[0.06]" : "bg-[#0B1F13]/60 backdrop-blur-xl"}`}>
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-5 sm:px-8 h-20">
        <a href="#accueil" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-white/20 group-hover:ring-emerald-400/60 transition-all duration-500 shadow-lg">
            <Image src="/images/logo-mwaiseni.jpg" alt="Mwaiseni Services SARL" width={44} height={44} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base leading-tight tracking-tight text-white">MWAISENI</span>
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-emerald-400/80">Services SARL</span>
          </div>
        </a>
        <ul className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="relative px-4 py-2 rounded-full text-sm font-semibold text-white/70 hover:text-white transition-all duration-300
                after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-emerald-400 after:rounded-full after:transition-all after:duration-300 hover:after:w-6">{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="hidden lg:flex items-center gap-3">
          <a href="https://wa.me/27751492073" target="blank"><Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:border-white/30 bg-transparent font-semibold"><MessageCircle className="w-4 h-4 mr-1.5" />WhatsApp</Button></a>
          <a href="#contact"><Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold shadow-lg shadow-amber-500/20">Contact</Button></a>
        </div>
        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X className="text-white" /> : <Menu className="text-white" />}</button>
      </nav>
      <AnimatePresence>{open && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-[#0B1F13]/95 backdrop-blur-2xl border-t border-white/5 overflow-hidden">
          <div className="px-5 py-6 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (<a key={l.href} href={l.href} onClick={() => setOpen(false)} className="px-4 py-3.5 rounded-2xl text-white/80 hover:text-white hover:bg-white/5 font-semibold text-lg transition-all">{l.label}</a>))}
            <a href="https://wa.me/27751492073" target="blank" onClick={() => setOpen(false)}><Button className="w-full mt-3 bg-[#25D366] hover:bg-[#1da851] text-white font-bold text-base h-13"><MessageCircle className="w-5 h-5 mr-2" />WhatsApp</Button></a>
          </div>
        </motion.div>
      )}</AnimatePresence>
    </header>
  );
}

/* ═══════════════════════════════════════════
   HERO (parallax, logo, rotating circles, glassmorphism, scroll indicator)
   ═══════════════════════════════════════════ */

function Hero() {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], [0, 200]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const contentScale = useTransform(scrollY, [0, 500], [1, 0.95]);
  const logoScale = useTransform(scrollY, [0, 400], [1, 0.85]);
  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#060E09]">
      {/* Parallax background image */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <div className="absolute inset-0 bg-[#060E09]" />      </motion.div>
      {/* Multi-layer gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060E09] via-[#060E09]/50 to-[#060E09]" />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-transparent to-amber-900/10" />
      {/* Radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-emerald-500/[0.06] rounded-full blur-[180px]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-amber-500/[0.04] rounded-full blur-[140px]" />
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-cyan-500/[0.03] rounded-full blur-[120px]" />
      {/* Decorative rotating circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] md:w-[900px] md:h-[900px] border border-white/[0.03] rounded-full animate-rotate-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] border border-emerald-500/[0.05] rounded-full animate-rotate-slow" style={{ animationDirection: "reverse", animationDuration: "25s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] border border-amber-500/[0.04] rounded-full animate-rotate-slow" style={{ animationDuration: "35s" }} />
      {/* Dashed decorative circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] border border-dashed border-white/[0.04] rounded-full animate-rotate-slow" style={{ animationDirection: "reverse", animationDuration: "50s" }} />
      {/* Floating particles */}
      <div className="absolute top-[20%] left-[15%] w-2 h-2 bg-emerald-400/20 rounded-full animate-float" />
      <div className="absolute top-[60%] right-[20%] w-1.5 h-1.5 bg-amber-400/20 rounded-full animate-float-delay" />
      <div className="absolute top-[30%] right-[30%] w-1 h-1 bg-white/10 rounded-full animate-float-delay-2" />
      <div className="absolute bottom-[30%] left-[25%] w-2.5 h-2.5 bg-emerald-300/10 rounded-full animate-float" style={{ animationDelay: "1s" }} />

      {/* Content */}
      <motion.div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8 text-center pt-28 pb-24" style={{ opacity: contentOpacity, scale: contentScale }}>
        <FadeIn delay={0.1}>
          <motion.div className="flex justify-center mb-10" style={{ scale: logoScale }}>
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-emerald-500/20 via-amber-500/20 to-emerald-500/20 blur-xl animate-pulse" />
              {/* Ring border */}
              <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden ring-4 ring-white/10 shadow-2xl shadow-emerald-500/20">
                <Image src="/images/logo-mwaiseni.jpg" alt="Mwaiseni Services SARL" width={176} height={176} className="w-full h-full object-cover" />
              </div>
              {/* Animated orbiting dot */}
              <motion.div
                className="absolute w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ top: "50%", left: "50%", marginTop: "-6px", marginLeft: "-90px", originX: "90px", originY: "6px" }}
              />
            </div>
          </motion.div>
        </FadeIn>
        <FadeIn delay={0.25}>
          <div className="inline-flex items-center gap-2.5 glass rounded-full px-6 py-3 mb-8">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span className="text-white/70 text-sm font-semibold tracking-wide">TRANSFORMATION AGRO-ALIMENTAIRE</span>
          </div>
        </FadeIn>
        <FadeIn delay={0.4}>
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white leading-[0.88] tracking-tighter">
            Le goût<br />
            <span className="bg-gradient-to-r from-emerald-300 via-amber-300 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">authentique</span><br />
            <span className="text-white/90">du terroir</span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.55}>
          <p className="mt-8 max-w-2xl mx-auto text-lg sm:text-xl text-white/40 leading-relaxed font-light">
            Arachides grillées, croquants artisanaux, gaufres et feuilles de djeka — 100% naturels, sans conservateurs, fabriqués localement à Lubumbashi pour toute la famille.
          </p>
        </FadeIn>
        <FadeIn delay={0.7}>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#produits">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 hover:from-amber-400 hover:via-orange-400 hover:to-orange-500 text-white font-extrabold text-lg px-10 h-14 shadow-2xl shadow-amber-600/30 hover:shadow-amber-500/50 transition-all duration-500 hover:-translate-y-0.5">
                Découvrir nos produits <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <a href="#partenariats">
              <Button size="lg" variant="outline" className="border-white/15 text-white/90 hover:bg-white/10 hover:border-white/25 font-bold text-lg px-10 h-14 bg-transparent transition-all duration-500">
                <Handshake className="mr-2 w-5 h-5" />Devenir partenaire
              </Button>
            </a>
          </div>
        </FadeIn>
        <FadeIn delay={0.85}>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-white/30 text-sm font-medium">
            {["Qualité garantie", "100% naturel", "Prix accessibles", "Stock permanent"].map((t) => (
              <span key={t} className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500/60" />{t}</span>
            ))}
          </div>
        </FadeIn>
      </motion.div>

      {/* Mouse scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-semibold">Défiler</span>
        <div className="w-8 h-12 rounded-full border-2 border-white/15 flex items-start justify-center pt-2">
          <motion.div animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   ABOUT / VALUES
   ═══════════════════════════════════════════ */

function About() {
  const valueCards = [
    { icon: Leaf, title: "100% Naturel", desc: "Zéro conservateurs, zéro additifs. Des produits purs directement de la ferme à votre table.", gradient: "from-emerald-500 to-green-600" },
    { icon: Award, title: "Qualité Premium", desc: "Matières premières rigoureusement sélectionnées, préparation artisanale soignée.", gradient: "from-amber-500 to-orange-600" },
    { icon: Zap, title: "Disponibilité Immédiate", desc: "Grand stock permanent. Livraison rapide à Lubumbashi et Kasumbalesa.", gradient: "from-cyan-500 to-blue-600" },
    { icon: TrendingUp, title: "Bénéfices Attractifs", desc: "Prix gros avantageux et marges intéressantes pour nos partenaires revendeurs.", gradient: "from-purple-500 to-violet-600" },
  ];
  return (
    <section className="py-28 sm:py-36 bg-white relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[100px]" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-amber-50 rounded-full blur-[100px] opacity-60" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 relative z-10">
        <FadeIn className="text-center max-w-3xl mx-auto mb-20">
          <SectionBadge variant="green"><Sprout className="w-3 h-3" />Notre engagement</SectionBadge>
          <h2 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
            Pourquoi choisir<br /><span className="text-gradient-green">Mwaiseni Services</span> ?
          </h2>
          <p className="mt-6 text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            Depuis Lubumbashi, nous transformons les meilleures matières premières en produits artisanaux qui font la différence. Notre engagement : la qualité à chaque bouchée.
          </p>
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueCards.map((v, i) => (
            <FadeIn key={v.title} delay={i * 0.1}>
              <div className="group relative h-full bg-white rounded-3xl p-8 border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-700 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${v.gradient} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <v.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-extrabold text-xl mb-3 tracking-tight">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
        {/* Values banner bar */}
        <FadeIn delay={0.3} className="mt-16">
          <div className="bg-gradient-to-r from-[#0B1F13] to-emerald-900 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 overflow-hidden relative">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('/images/logo-mwaiseni.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-12">
              {VALUES.map((v, i) => (
                <div key={v.title} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><v.icon className="w-5 h-5 text-emerald-400" /></div>
                  <span className="text-white font-bold text-lg tracking-tight">{v.title}</span>
                  {i < VALUES.length - 1 && <span className="hidden sm:block text-white/20 text-2xl font-light">•</span>}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PRODUCTS
   ═══════════════════════════════════════════ */

function Products() {
  return (
    <section id="produits" className="py-28 sm:py-36 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-50 rounded-full blur-[120px] opacity-60" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 relative z-10">
        <FadeIn className="text-center max-w-3xl mx-auto mb-20">
          <SectionBadge variant="amber"><Star className="w-3 h-3" />Nos produits</SectionBadge>
          <h2 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
            Des produits qui<br /><span className="text-gradient-gold">font la différence</span>
          </h2>
          <p className="mt-6 text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            Fabriqués avec soin à partir d’ingrédients sélectionnés, nos produits sont le résultat d’un savoir-faire artisanal transmis avec passion.
          </p>
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {PRODUCTS.map((p, i) => (
            <FadeIn key={p.name} delay={i * 0.12}>
              <div className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-3xl hover:shadow-black/15 transition-all duration-700 border border-gray-100/80">
                <div className="relative h-64 overflow-hidden">
                  <Image src={p.img} alt={p.name} fill className="object-cover transition-all duration-700 group-hover:scale-110 brightness-95 group-hover:brightness-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${p.gradient} opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-foreground text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">{p.tag}</span>
                  </div>
                  <p className="absolute bottom-4 left-4 text-white/50 text-[10px] font-bold uppercase tracking-[0.2em]">{p.brand}</p>
                </div>
                <div className="p-6">
                  <h3 className="font-extrabold text-lg mb-2 tracking-tight group-hover:text-emerald-700 transition-colors duration-300">{p.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{p.desc}</p>
                  <a href={`https://wa.me/27751492073?text=Bonjour, je suis intéressé(e) par : ${p.name}`} target="blank">
                    <Button variant="ghost" className="mt-4 p-0 h-auto text-emerald-700 hover:text-emerald-600 font-bold text-sm group/btn">
                      <span className="flex items-center">Commander <ArrowRight className="ml-1 w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" /></span>
                    </Button>
                  </a>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   ACTIVITIES (Objet Social) — dark section
   ═══════════════════════════════════════════ */

function Activities() {
  return (
    <section id="activites" className="py-28 sm:py-36 bg-[#0B1F13] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F13] via-emerald-950/30 to-[#0B1F13]" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/[0.03] rounded-full blur-[120px]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 relative z-10">
        <FadeIn className="text-center max-w-3xl mx-auto mb-20">
          <SectionBadge variant="green"><Building2 className="w-3 h-3" />Objet Social</SectionBadge>
          <h2 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white">
            Nos domaines<br /><span className="bg-gradient-to-r from-emerald-300 to-amber-300 bg-clip-text text-transparent">d’activité</span>
          </h2>
          <p className="mt-6 text-white/40 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            Mwaiseni Services SARL est une entreprise multi-sectorielle dont les activités contribuent directement au développement économique et alimentaire de la région.
          </p>
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ACTIVITIES.map((a, i) => (
            <FadeIn key={a.title} delay={i * 0.08}>
              <div className="group relative h-full rounded-3xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-white/[0.01] group-hover:from-white/[0.08] group-hover:to-white/[0.02] transition-all duration-700" />
                <div className="relative z-10 p-7">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${a.color} flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500`}>
                    <a.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-extrabold text-white text-base mb-2.5 tracking-tight">{a.title}</h3>
                  <p className="text-white/35 text-sm leading-relaxed">{a.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   STATS
   ═══════════════════════════════════════════ */

function Stats() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {STATS.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.1} className="text-center">
              <p className="text-5xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#0B1F13] to-emerald-900/60 tracking-tighter">
                <CountUp target={s.value} />
              </p>
              <p className="mt-3 text-muted-foreground text-sm font-semibold uppercase tracking-widest">{s.label}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PARTNERSHIP
   ═══════════════════════════════════════════ */

function Partnership() {
  return (
    <section id="partenariats" className="py-28 sm:py-36 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-[100px] opacity-60" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <FadeIn direction="left">
            <SectionBadge variant="amber"><Handshake className="w-3 h-3" />Partenariats B2B</SectionBadge>
            <h2 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
              Vous avez une alimentation<br />ou un <span className="text-gradient-green">mini-market</span> ?
            </h2>
            <p className="mt-6 text-muted-foreground text-lg sm:text-xl leading-relaxed">
              Rejoignez notre réseau de partenaires et profitez de prix avantageux pour augmenter vos ventes. Commandes en gros, livraisons fiables, bénéfices garantis.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a href="https://wa.me/27751492073?text=Bonjour, je souhaite devenir partenaire revendeur." target="blank">
                <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-lg px-10 h-14 shadow-2xl shadow-emerald-600/25 hover:shadow-emerald-500/40 transition-all duration-500 hover:-translate-y-0.5">
                  Devenir partenaire <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <a href="#contact"><Button size="lg" variant="outline" className="font-bold text-lg px-10 h-14 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all">Nous contacter</Button></a>
            </div>
          </FadeIn>
          <FadeIn direction="right">
            <div className="grid sm:grid-cols-2 gap-4">
              {PARTNER_BENEFITS.map((b, i) => (
                <motion.div key={i} whileHover={{ scale: 1.04, y: -2 }} className="flex items-start gap-3.5 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-200 transition-all duration-500">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm leading-relaxed font-semibold text-foreground/80">{b}</span>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   TEAM
   ═══════════════════════════════════════════ */

const TEAM = [
  { name: "Équipe Mwaiseni", role: "Direction & Production", img: "/images/equipe1.jpg" },
  { name: "Équipe Mwaiseni", role: "Transformation & Contrôle Qualité", img: "/images/equipe2.jpg" },
  { name: "Équipe Mwaiseni", role: "Logistique & Distribution", img: "/images/equipe3.jpg" },
  { name: "Équipe Mwaiseni", role: "Administration & Commercial", img: "/images/equipe4.jpg" },
];

function Team() {
  return (
    <section id="equipe" className="py-28 sm:py-36 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-amber-50 rounded-full blur-[100px] opacity-50" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[100px] opacity-50" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 relative z-10">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <SectionBadge variant="green"><Sprout className="w-3 h-3" />Notre Équipe</SectionBadge>
          <h2 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
            Les visages derrière<br /><span className="text-gradient-green">la qualité</span>
          </h2>
          <p className="mt-6 text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            Une équipe passionnée et dévouée qui travaille chaque jour pour vous offrir le meilleur. De la production à la distribution, chaque membre contribue à l’excellence de nos produits.
          </p>
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((m, i) => (
            <FadeIn key={i} delay={i * 0.12}>
              <div className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-700 border border-gray-100/80">
                <div className="relative h-80 overflow-hidden">
                  <Image src={m.img} alt={m.name} fill className="object-cover object-top transition-all duration-700 group-hover:scale-105 brightness-95 group-hover:brightness-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-extrabold text-white text-lg tracking-tight">{m.name}</h3>
                    <p className="text-white/60 text-sm mt-1 font-medium">{m.role}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   CONTACT
   ═══════════════════════════════════════════ */

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  function handleSubmit(e: FormEvent) { e.preventDefault(); setSubmitted(true); }
  return (
    <section id="contact" className="py-28 sm:py-36 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-amber-50 rounded-full blur-[100px] opacity-50" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-50 rounded-full blur-[100px] opacity-50" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 relative z-10">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <SectionBadge variant="green"><Mail className="w-3 h-3" />Contact</SectionBadge>
          <h2 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
            Parlons de votre <span className="text-gradient-green">projet</span>
          </h2>
          <p className="mt-6 text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            Une question, une commande en gros ou un partenariat ? N’hésitez pas à nous contacter.
          </p>
        </FadeIn>
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
          {/* Form */}
          <FadeIn direction="left" className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-lg shadow-black/[0.03]">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold mb-2">Message envoyé !</h3>
                  <p className="text-muted-foreground">Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground/80">Nom complet</label>
                      <Input placeholder="Votre nom" required className="h-12 rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground/80">Téléphone</label>
                      <Input type="tel" placeholder="+243 ..." required className="h-12 rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/80">Email</label>
                    <Input type="email" placeholder="votre@email.com" required className="h-12 rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/80">Message</label>
                    <Textarea placeholder="Décrivez votre besoin..." required rows={5} className="rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400/20 resize-none" />
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-lg h-14 shadow-xl shadow-emerald-600/20 hover:shadow-emerald-500/30 transition-all duration-500">
                    Envoyer le message <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              )}
            </div>
          </FadeIn>
          {/* Contact info cards */}
          <FadeIn direction="right" className="lg:col-span-2 flex flex-col gap-5">
            {[
              { icon: Phone, label: "Téléphone & WhatsApp", value: "+27751492073", href: "https://wa.me/27751492073" },
              { icon: Mail, label: "Email", value: "info@mwaiseni.com", href: "mailto:info@mwaiseni.com" },
              { icon: MapPin, label: "Siège", value: "Lubumbashi, RDC", href: "#" },
            ].map((c, i) => (
              <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "blank" : undefined}>
                <div className="group flex items-start gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-200 transition-all duration-500">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/15 shrink-0 group-hover:scale-110 transition-all duration-300">
                    <c.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{c.label}</p>
                    <p className="font-bold text-foreground/90 group-hover:text-emerald-700 transition-colors">{c.value}</p>
                  </div>
                </div>
              </a>
            ))}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */

function Footer() {
  return (
    <footer className="bg-[#060E09] border-t border-white/[0.05]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Col 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/10 shadow-lg">
                <Image src="/images/logo-mwaiseni.jpg" alt="Mwaiseni Services SARL" width={48} height={48} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-black text-white text-lg leading-tight">MWAISENI</p>
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-emerald-400/70">Services SARL</p>
              </div>
            </div>
            <p className="text-white/35 text-sm leading-relaxed mb-6 max-w-xs">
              Transformation agro-alimentaire, location d’appartements, services multiples à Lubumbashi, RDC.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://wa.me/27751492073" target="blank" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#25D366]/20 border border-white/[0.06] hover:border-[#25D366]/30 flex items-center justify-center transition-all duration-300">
                <MessageCircle className="w-4 h-4 text-white/60 hover:text-[#25D366]" />
              </a>
              <a href="mailto:info@mwaiseni.com" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/[0.06] hover:border-emerald-500/30 flex items-center justify-center transition-all duration-300">
                <Mail className="w-4 h-4 text-white/60 hover:text-emerald-400" />
              </a>
            </div>
          </div>
          {/* Col 2: Links */}
          <div>
            <h4 className="font-extrabold text-white text-sm uppercase tracking-widest mb-6">Navigation</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}><a href={l.href} className="text-white/40 hover:text-emerald-400 text-sm font-medium transition-colors duration-300">{l.label}</a></li>
              ))}
            </ul>
          </div>
          {/* Col 3: Activités */}
          <div>
            <h4 className="font-extrabold text-white text-sm uppercase tracking-widest mb-6">Activités</h4>
            <ul className="space-y-3">
              {ACTIVITIES.slice(0, 5).map((a) => (
                <li key={a.title}><span className="text-white/40 text-sm font-medium">{a.title}</span></li>
              ))}
            </ul>
          </div>
          {/* Col 4: Contact & Legal */}
          <div>
            <h4 className="font-extrabold text-white text-sm uppercase tracking-widest mb-6">Contact & Légal</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-white/40"><Phone className="w-3.5 h-3.5 shrink-0" />+27751492073</li>
              <li className="flex items-center gap-2 text-white/40"><Mail className="w-3.5 h-3.5 shrink-0" />info@mwaiseni.com</li>
              <li className="flex items-center gap-2 text-white/40"><MapPin className="w-3.5 h-3.5 shrink-0" />Lubumbashi, RDC</li>
            </ul>
            <div className="mt-6 pt-6 border-t border-white/[0.06] space-y-1.5">
              <p className="text-white/25 text-xs">RCCM : CD/LUB/RCCM/23-B-00114</p>
              <p className="text-white/25 text-xs">NIF : 0010452767F</p>
              <p className="text-white/25 text-xs">Id.Nat : 1-98-N46054P</p>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom bar */}
      <div className="border-t border-white/[0.05]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-sm">© {new Date().getFullYear()} Mwaiseni Services SARL. Tous droits réservés.</p>
          <p className="text-white/15 text-xs">Conçu avec passion à Lubumbashi</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   WHATSAPP FLOATING BUTTON
   ═══════════════════════════════════════════ */

function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/27751492073"
      target="blank"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1da851] text-white flex items-center justify-center shadow-2xl shadow-[#25D366]/30 hover:shadow-[#25D366]/50 transition-all duration-300 hover:scale-110"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </motion.a>
  );
}

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <MarqueeBand />
      <About />
      <Products />
      <Activities />
      <Stats />
      <Partnership />
      <Team />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
