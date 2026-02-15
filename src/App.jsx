import React, { useState, useEffect, useRef, useCallback, memo, useMemo, useReducer, useLayoutEffect } from 'react';
import { 
  Rocket, Users, Target, Mail, Gamepad2, Zap, ArrowRight,
  Search, Share2, MessageCircle, Cpu, Layers, 
  Sparkles, Award, X, Send, CheckCircle, 
  ChevronRight, ShieldCheck, Globe2, Lock, 
  ExternalLink, Wand2, Star, Trophy, GraduationCap, 
  School, Coins, Activity, Flame, Crown, 
  Download, User, ZapOff, 
  MapPin, ChevronDown, Brain, Workflow,
  Linkedin, Github, Briefcase as Job, Megaphone, Compass, Menu, Hash, Clock,
  Volume2, VolumeX, Copy, Bell, Gift, PieChart, Sliders,
  HelpCircle, Check, Unlock, MousePointer2, Keyboard, Fingerprint, FileText, Crosshair, ListTodo, Info, XCircle
} from 'lucide-react';

// --- DEBUG PERFORMANCE ---
const usePerformanceLogger = (componentName) => {
  const renderCount = useRef(0);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.__DEBUG_PERF__) {
      renderCount.current++;
      console.log(`[Render] ${componentName}: ${renderCount.current}`);
    }
  });
};

// --- CONFIGURATION SYSTÈME SONORE ---
const audioSystem = {
  ctx: null,
  get() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    return this.ctx;
  }
};

// --- HOOK OPTIMISATION: VISIBILITY CONTROL FOR ANIMATIONS ---
const useVisibilityControl = (ref, threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting !== isVisibleRef.current) {
        isVisibleRef.current = entry.isIntersecting;
        setIsVisible(entry.isIntersecting);
      }
    }, { threshold });
     
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]); // Fix: ref added to deps
   
  return isVisible;
};

// --- HOOK: STABLE INTERSECTION OBSERVER (TRUE ONCE) ---
const useInViewOnce = (ref, { threshold = 0.1, rootMargin = '0px' } = {}) => {
  const [hasAppeared, setHasAppeared] = useState(false);
  const hasTriggered = useRef(false);
   
  useEffect(() => {
    const el = ref.current;
    if (!el || hasTriggered.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasAppeared(true);
        hasTriggered.current = true;
        observer.disconnect();
      }
    }, { threshold, rootMargin });
     
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin]);
   
  return hasAppeared;
};

// --- STYLES GLOBAUX OPTIMISÉS ---
const GLOBAL_STYLES_STRING = `
  :root { 
    /* scroll-behavior: smooth; REMOVED FOR PERF */ 
  }
  body { font-family: 'Inter', sans-serif; background: #020202; overflow-x: hidden; touch-action: pan-y; margin: 0; padding: 0; }
    
  /* Performance Utilities */
  .gpu-accel { transform: translate3d(0,0,0); backface-visibility: hidden; perspective: 1000px; }
  
  /* Content Visibility: rendu paresseux pour les grosses sections */
  .cv-section {
    content-visibility: auto;
    contain-intrinsic-size: 1px 800px;
  }

  /* Animation Control */
  .paused { animation-play-state: paused !important; }
  .paused * { animation-play-state: paused !important; }

  /* Will Change Strategy */
  .hover-gpu:hover { will-change: transform; }
  
  @media (prefers-reduced-motion: no-preference) {
    .animate-pulse, .animate-bounce, .animate-spin-slow {
      animation-play-state: running;
    }
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #dc2626; }

  @keyframes float { 
    0%, 100% { transform: translate3d(0, 0, 0); } 
    50% { transform: translate3d(0, -10px, 0); } 
  }
    
  /* Animations */
  .animate-reveal { animation: reveal 0.6s cubic-bezier(0.19, 1, 0.22, 1) both; }
  .animate-reveal-bottom { animation: reveal-bottom 0.6s cubic-bezier(0.19, 1, 0.22, 1) both; }
  .animate-slide-in-right { animation: slide-in-right 1s cubic-bezier(0.19, 1, 0.22, 1) both; }
  .animate-stress { animation: stress 0.3s infinite ease-in-out; }
  .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
  .animate-float-out { animation: float-out 0.8s ease-out forwards; }
  .animate-spin-slow { animation: spin 8s linear infinite; }
  .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
  .animate-lumos-text { animation: lumos-text 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
  .animate-shimmer-fast { animation: shimmer-fast 1.5s infinite; }
  .animate-scroll-normal { animation: scroll-normal 20s linear infinite; }
  .animate-wave { animation: wave 2s infinite; }
  .animate-quick-pop { animation: quick-pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
  .animate-bounce-in { animation: bounce-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
  
  .will-change-pos { will-change: transform; }

  @media (min-width: 768px) {
    .animate-float { animation: float 6s ease-in-out infinite; }
  }
    
  @media (prefers-reduced-motion: reduce) {
    .animate-spin-slow, .animate-float, .animate-pulse, .animate-bounce, .animate-wave, .animate-shimmer-fast, .animate-scroll-normal, .animate-stress, .animate-shake, .animate-reveal, .animate-fade-in-up {
      animation: none !important;
      transition: none !important;
      transform: none !important;
      opacity: 1 !important;
    }
  }

  /* --- MODE PERFORMANCE (FORMULAIRE OUVERT) --- */
  /* Ciblage spécifique via une classe utilitaire */
  body.form-open .paused-when-modal {
    animation-play-state: paused !important;
    pointer-events: none;
    /* REMPLACÉ : le blur sur une grande surface cause des lags */
    opacity: 0.3; 
    transition: opacity 0.3s ease;
  }
  
  /* On s'assure que les enfants directs respectent aussi la pause */
  body.form-open .paused-when-modal * {
    animation-play-state: paused !important;
  }
  
  .modal-container {
    pointer-events: auto !important;
  }
  
  /* Optimisation des inputs */
  .optimized-input {
    transition-property: border-color, background-color, box-shadow;
    transition-duration: 150ms;
    transition-timing-function: ease-out;
    will-change: auto; 
  }

  @keyframes reveal { from { opacity: 0; transform: translate3d(0, 15px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
  @keyframes reveal-bottom { from { opacity: 0; transform: translate3d(0, 50px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
  @keyframes slide-in-right { from { opacity: 0; transform: translate3d(30px, 0, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
  @keyframes stress { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.01); border-color: #dc2626; } }
  @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
  @keyframes float-out { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(-100px) scale(1.2); } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes fade-in-up { from { opacity: 0; transform: translate3d(0, 30px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
  @keyframes lumos-text { 0% { opacity: 0; letter-spacing: 1em; filter: blur(10px); } 100% { opacity: 1; letter-spacing: 0; filter: blur(0); } }
  @keyframes shimmer-fast { from { transform: translate3d(-100%, 0, 0); } to { transform: translate3d(100%, 0, 0); } }
  @keyframes scroll-normal { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(-50%, 0, 0); } }
  @keyframes wave { 0% { transform: rotate(0deg); } 10% { transform: rotate(14deg); } 20% { transform: rotate(-8deg); } 30% { transform: rotate(14deg); } 40% { transform: rotate(-4deg); } 50% { transform: rotate(10deg); } 60% { transform: rotate(0deg); } 100% { transform: rotate(0deg); } }
  @keyframes quick-pop { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  @keyframes bounce-in { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); } }

  .digital-grid { background-image: linear-gradient(rgba(220, 38, 38, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 38, 38, 0.03) 1px, transparent 1px); background-size: 50px 50px; }
  .shadow-glow-red { box-shadow: 0 0 30px rgba(220, 38, 38, 0.3); }
  .shadow-glow-emerald { box-shadow: 0 0 25px rgba(16, 185, 129, 0.3); }
  .shadow-glow-white { box-shadow: 0 0 25px rgba(255, 255, 255, 0.4); }
  .shadow-glow-yellow { box-shadow: 0 0 25px rgba(234, 179, 8, 0.3); }
  .shadow-glow-purple { box-shadow: 0 0 25px rgba(168, 85, 247, 0.3); }
    
  .delay-100 { animation-delay: 100ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }
  .animation-delay-2000 { animation-delay: 2s; }
`;

// Hook pour injecter les styles (Idempotent + SSR Safe)
const useGlobalStyles = () => {
  useLayoutEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById('global-styles')) return;
    const style = document.createElement('style');
    style.id = 'global-styles';
    style.innerHTML = GLOBAL_STYLES_STRING;
    document.head.appendChild(style);
  }, []);
};

// --- GAME ASSETS (MEMOIZED) ---
const GameAssets = {
  Lead: memo(() => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_5px_rgba(56,189,248,0.5)]">
      <circle cx="50" cy="50" r="45" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="2" />
      <circle cx="50" cy="50" r="25" fill="#06b6d4" className="animate-pulse" />
      <path d="M25,80 Q50,50 75,80" fill="#fff" />
    </svg>
  )),
  GoldenRocket: memo(() => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]">
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
      <path d="M50,10 L70,30 L70,70 L50,90 L30,70 L30,30 Z" fill="url(#goldGrad)" stroke="#fff" strokeWidth="2" />
      <path d="M30,70 Q10,90 30,95" stroke="#ca8a04" strokeWidth="3" fill="none" />
      <path d="M70,70 Q90,90 70,95" stroke="#ca8a04" strokeWidth="3" fill="none" />
    </svg>
  )),
  Partner: memo(() => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">
      <defs>
        <linearGradient id="purpGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d8b4fe" />
          <stop offset="100%" stopColor="#7e22ce" />
        </linearGradient>
      </defs>
      <path d="M20,70 L20,40 L40,60 L50,20 L60,60 L80,40 L80,70 Z" fill="url(#purpGrad)" stroke="#fff" strokeWidth="2" />
      <circle cx="50" cy="15" r="5" fill="#fff" className="animate-ping" style={{animationDelay: '0.2s'}} />
    </svg>
  )),
  Bot: memo(() => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">
      <rect x="25" y="25" width="50" height="50" rx="10" fill="#7f1d1d" stroke="#ef4444" strokeWidth="3" />
      <circle cx="40" cy="45" r="5" fill="#000" />
      <circle cx="60" cy="45" r="5" fill="#000" />
      <rect x="35" y="60" width="30" height="5" fill="#000" />
    </svg>
  )),
  BadBuzz: memo(() => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]">
      <path d="M50,15 Q70,40 80,60 Q90,90 50,90 Q10,90 20,60 Q30,40 50,15" fill="#c2410c" stroke="#f97316" strokeWidth="2" />
      <path d="M50,25 Q60,45 65,60 Q70,80 50,80 Q30,80 35,60 Q40,45 50,25" fill="#fb923c" />
    </svg>
  )),
  Streak: memo(() => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">
      <circle cx="50" cy="50" r="40" fill="rgba(29,78,216,0.2)" stroke="#3b82f6" strokeWidth="3" strokeDasharray="10 5" />
      <path d="M40,10 L50,0 L60,10" fill="none" stroke="#3b82f6" strokeWidth="2" className="animate-bounce" />
    </svg>
  ))
};

const formatScore = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num;
};

// --- TRADUCTIONS & DONNÉES ---
const TEXTS = {
  fr: {
    nav: { expertise: "Expertise", bio: "Bio", lab: "Growth Lab", collab: "Collaborer" },
    hero: {
      badge: "Expert Marketing & Projets Digitaux",
      title1: "Pilote",
      title2: "Croissance.",
      sub: "Un projet en tête ? Besoin de visibilité, d’utilisateurs ou de croissance ? Je t’accompagne de la stratégie à l’exécution.",
      btn_work: "Travailler ensemble",
      btn_cv: "Mon CV PDF",
      exp: "Expérience",
      proj: "Projets",
      success: "100% Succès",
      avail: "Disponible",
      loc: "Montpellier / Remote"
    },
    trust: { sat: "100% Satisfaction", proj: "+50 Projets", int: "International", conf: "Confidentialité" },
    stack: {
      title_sub: "Methodology",
      title: "Playbook.",
      desc: "Consultant marketing à Montpellier - Stratégies d'acquisition 360°.",
      top: "Top Demande",
      new: "NEW"
    },
    exp: {
      roadmap: "Roadmap",
      title: "Expériences Pro.",
      impact: "Impact Direct",
      details_prefix: "Détails"
    },
    cursus: {
      sub: "Academic Foundation",
      title: "Foundations.",
      dc: { title: "Digital Campus", sub: "Master Expert Stratégie Digitale" },
      iscom: { title: "ISCOM", sub: "Bachelor Communication & Pub" }
    },
    testi: { sub: "Confiance", title: "Parole de Pro." },
    footer: { btn: "Collaborer maintenant", copyright: "Développé par Lucien LUKES" },
    bio: {
      sub: "À Propos",
      title: "Bio.",
      dl: "Télécharger CV",
      intro_1: "Moi c'est",
      intro_2: "Lucien.",
      job: "Growth Architect & Consultant Influence",
      p1_bold: "Je ne fais pas “juste” du digital.",
      p1: "J’aide des projets à se structurer, trouver leur public et prendre de l’ampleur.",
      p2_bold: "gaming, tech, plateformes sociales",
      p2: "Je viens d’un univers où tout va vite : ",
      p2_end: ". Des environnements exigeants, avec de vraies audiences et des enjeux concrets. C’est là que j’ai appris à faire grandir des projets, pas en théorie, mais en testant, en ajustant, en itérant.",
      p3: "J’ai travaillé sur des produits et des initiatives capables de toucher des centaines de milliers, parfois des millions d’utilisateurs, en mêlant stratégie, contenu et pilotage d’équipes.",
      adn: "ADN Digital",
      sectors: "Secteurs",
      method: "Méthode",
      target: "Poste Ciblé",
      env: "Environnement",
      back: "Retour à l'expertise",
      avail: "Disponible",
      loc: "Montpellier / Remote",
      hello: "Salut toi ! 👋",
      radar_title: "PROFIL HYBRIDE",
      stack_title: "Marketing Stack"
    },
    game: {
      title: "Influence",
      title_sub: "Rush.",
      timer: "Timer",
      eng: "ENGAGEMENT",
      brief: "Mission Briefing",
      brief_client: "Clients",
      brief_viral: "Viralité",
      brief_partner: "Partenaire",
      brief_bots: "Bots",
      brief_bad: "Bad Buzz",
      brief_streak: "Streak",
      btn_start: "Commencer",
      score_title: "Scoreboard.",
      record: "Engagement Record",
      you: "Toi (Visiteur)",
      score: "Score actuel",
      taunt: "Tu vois, je suis meilleur... Alors contacte-moi ! 😉",
      retry: "Relancer",
      contact: "Contact",
      back: "Retour",
      logic_title: "LA LOGIQUE DERRIÈRE CE JEU",
      logic_intro: "Ce mini-jeu n'est pas qu'un simple divertissement, c'est une métaphore de mon métier.",
      logic_p1_title: "Le Timer (Stress)",
      logic_p1_desc: "En start-up ou lancement de produit, le temps est l'ennemi. Il faut exécuter vite.",
      logic_p2_title: "Les Cibles (Opportunités)",
      logic_p2_desc: "Elles bougent vite. Il faut savoir différencier un Lead Qualifié (Bleu) d'un Bad Buzz (Feu) ou d'un Bot (Rouge).",
      logic_p3_title: "Le Multiplicateur (Hype)",
      logic_p3_desc: "C'est la viralité. Quand on touche le bon levier (Golden Rocket), les résultats ne sont pas linéaires, ils sont exponentiels.",
      logic_conc_title: "Mon rôle :",
      logic_conc_desc: "Je suis celui qui vous aide à viser juste, éviter les pièges et déclencher ce fameux multiplicateur de croissance."
    },
    form: {
      title: "Collaborer.",
      step1: "01. Type de Contrat",
      free: "Freelance / Mission",
      cdi: "Full-time / Long Term",
      step2_title: "02. Domaines d'intervention",
      mc: "Projet Minecraft ?",
      btn_cont: "Continuer",
      duration: "Durée estimée",
      loc: "Localisation",
      sel_duration: "Sélectionner une durée...",
      d_one: "Ponctuelle (One-shot)",
      d_short: "1 - 3 Mois",
      d_mid: "3 - 6 Mois",
      d_long: "Longue durée (+6 mois)",
      l_rem: "Remote",
      l_site: "Sur Site",
      l_hyb: "Hybride",
      proj_label: "Votre Projet / Ambition",
      proj_placeholder: "Décrivez votre besoin, vos enjeux actuels...",
      email_label: "Votre Email Pro",
      btn_back: "Retour",
      btn_send: "Envoyer la demande",
      success_title: "Bien reçu !",
      success_msg: "Je viens de recevoir votre brief. Je l'analyse et je reviens vers vous sous 24h à l'adresse",
      close: "Fermer",
      quest_bonus: "Mission Accomplie : -5% sur votre devis !",
      certified_badge: "Expert Certifié"
    },
    modal: {
      strat: "Concept stratégique",
      ops: "Opérations clés",
      btn: "Propulser ce levier"
    },
    toast: {
      email_copied: "Email copié dans le presse-papier !",
      discord_copied: "Discord copié !"
    },
    quest: {
      title: "Quêtes secondaires",
      instruction: "Complétez les objectifs ci-dessous pour débloquer -5% de réduction sur votre prochaine mission freelance.",
      tip: "Indice : Cherchez des mots cachés dans le texte (cliquez dessus) et prouvez votre valeur au jeu.",
      progress: "Avancement",
      locked: "En cours...",
      unlocked: "Badge Expert Débloqué",
      congrats: "Mission Accomplie !",
      benefit: "Récompense : -5% sur le devis",
      task_words: "Trouver les 3 mots cachés",
      task_score: "Faire +150k pts au Growth Lab"
    }
  }
};

const getTestimonials = (lang) => [
  { id: 1, name: "Thomas", role: "Fondateur Serveur SkyBlock (FR)", text: "On stagnait à 50 joueurs simultanés. Après l'audit de Lucien et la refonte de l'acquisition, on a tapé les 500 en un mois. Il connait les codes par coeur." },
  { id: 2, name: "Sarah L.", role: "CMO - SaaS B2B", text: "J'avais peur de l'approche 'gaming' pour notre boîte très corporate. Finalement, c'est cette créativité qui nous a permis de débloquer notre coût par lead. Bluffant." },
  { id: 3, name: "M. Gauthier", role: "Directeur E-commerce", text: "Pas de blabla, que des résultats. Il a géré notre campagne d'influence de A à Z avec une rigueur militaire. ROI x4." }
];

const getExperiences = (lang) => [
  { company: 'RIVRS', link: 'https://www.rivrs.io/', role: 'Directeur Marketing & Influence', period: '2023 - Présent', desc: 'Pilotage global des campagnes d\'influence sur Minecraft (FR & International).', impact: '5M VISITEURS MENSUELS', details: ["Gestion et structuration des campagnes d'influence sur l'ensemble des serveurs Rivrs.", "Pilotage de stratégies massives sur les marchés France, US, DE et IT.", "Management de l'équipe marketing (8 personnes) et créative.", "Optimisation du CAC et de la LTV via des dashboards Data avancés."] },
  { company: 'OUTLIER', link: 'https://outlier.ai/', role: 'AI Marketing Architect', period: '2023 - 2024', desc: 'Entraînement de modèles IA via le marketing de contenu stratégique.', impact: '100+ CAMPAGNES IA', details: ["Collaboration étroite avec des ingénieurs IA pour affiner la pertinence et performance des modèles.", "Optimisation de modèles LLM pour la conversion marketing et psychologie client.", "Rédaction de scripts de vente haute-performance assistés par IA."] },
  { 
    company: 'POUDLARD RP', 
    link: 'https://discord.gg/poudlardrp', 
    role: 'Fondateur & Growth Director', 
    period: '2018 - 2022', 
    desc: 'Création et pilotage intégral du serveur Minecraft RPG Harry Potter n°1 en France.', 
    featured: true, 
    isPoudlard: true, 
    impact: '300 000 JOUEURS UNIQUES', 
    details: [
      'Acquisition de 300 000 joueurs uniques via une stratégie 100% organique.',
      'Management intégral de 100 membres (Développeurs, Game Artist et Graphiste, CM).', 
      'Architecture des boucles de viralité TikTok & monétisation in-game.', 
      'Développement d\'une économie virtuelle complexe et stable.'
    ]
  },
  { company: 'UNREAL ENGINE', link: 'https://www.unrealengine.com/fr', role: 'Chargé de communauté & Événementiel (Stage)', period: '2020 - 2022', desc: 'Community Manager pour l\'écosystème Unreal Engine, focalisé sur l\'engagement Discord.', impact: 'GESTION DISCORD INTÉGRALE', details: ["Gestion intégrale et animation du serveur Discord communautaire.", "Organisation d'événements en ligne et coordination des modérateurs.", "Mise en place de bots et de structures de salons pour optimiser l'UX communautaire.", "Relais d'information technique et support de premier niveau pour les créateurs."] }
];

const getStack = (lang) => [
  { name: "Influence Marketing", icon: Share2, category: "Social", simple: "Connecter votre marque aux bonnes personnes pour créer de la confiance.", definition: "Partenariats avec des créateurs de contenu.", popular: true, extraInfo: "Carnet d'adresses : 300+ Créateurs Internationaux (FR/US/DE/IT).", actions: ["Sourcing via Data Scraping", "Contrats Performance (CPA)", "Tunnels de Conversion Dédiés"] },
  { name: "SEO / SEM", icon: Search, category: "Acquisition", simple: "Être trouvé immédiatement par ceux qui veulent acheter votre produit.", definition: "Optimisation Google & Publicité ciblée.", actions: ["Topic Clusters & Content Silos", "Audit Core Web Vitals", "Google Ads ROI-Driven"] },
  { name: "Développeur React", icon: Trophy, category: "Tech", simple: "Développer des applications web ultra-performantes comme celle-ci.", definition: "Création de sites & apps modernes.", isNew: true, actions: ["React & Tailwind", "Animations Framer Motion", "Expérience Utilisateur (UX)"] },
  { name: "ADS (Tiktok, FB, Google)", icon: Megaphone, category: "Paid Media", simple: "Campagnes publicitaires ultra-ciblées pour un ROI immédiat.", definition: "Acquisition payante multicanale.", actions: ["A/B Testing Massif", "Ciblage Comportemental", "Analytics Cohortes"] },
  { name: "CRM Automation", icon: Layers, category: "Retention", simple: "Prendre soin de vos clients automatiquement pour qu'ils achètent plus souvent.", definition: "Gestion automatisée de la base client.", actions: ["Segmentation Comportementale", "Lead Nurturing", "Emailing Haute-Performance"] },
  { name: "Plan de Com' 360°", icon: Compass, category: "Stratégie", simple: "Une feuille de route claire pour dominer votre marché et engager votre audience.", definition: "Vision globale et calendrier éditorial.", actions: ["Brand Voice", "Content Pillars", "Planification Stratégique"] }
];

const Toast = memo(({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[2000] bg-white text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-black text-xs uppercase tracking-wider animate-fade-in-up will-change-transform">
            <CheckCircle size={16} className="text-emerald-500" />
            {message}
        </div>
    );
});

// --- (3) OPTIMIZED VICTORY CELEBRATION (CANVAS) ---
const VictoryCelebration = memo(() => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Respect prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        let animationFrameId;
        let particles = [];
        const particleCount = 50; // Limité pour la perf

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Init particles
        const colors = ['#fbbf24', '#ef4444', '#ffffff'];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: Math.random() * 3 + 2,
                size: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                wobble: Math.random() * Math.PI * 2
            });
        }

        // Limiter le framerate à ~30fps pour économiser le GPU
        let lastTime = 0;
        const fpsInterval = 1000 / 30;
         
        const loop = (timestamp) => {
            animationFrameId = requestAnimationFrame(loop);
            const elapsed = timestamp - lastTime;
            if (elapsed > fpsInterval) {
                lastTime = timestamp - (elapsed % fpsInterval);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => {
                    p.y += p.vy;
                    p.x += Math.sin(p.wobble) * 1;
                    p.wobble += 0.05;
                    if (p.y > canvas.height) {
                        p.y = -10;
                        p.x = Math.random() * canvas.width;
                    }
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                });
            }
        };

        loop(0);

        // Arrêt automatique après 6 secondes
        const timeout = setTimeout(() => {
            cancelAnimationFrame(animationFrameId);
            if(canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 6000);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
            clearTimeout(timeout);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-black/80 animate-fade-in-up" />
             <canvas ref={canvasRef} className="absolute inset-0" />
             <div className="relative z-10 flex flex-col items-center animate-bounce-in will-change-transform">
                 <Trophy size={100} className="text-yellow-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.6)]" />
                 <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter mt-6 drop-shadow-2xl">Expert <span className="text-yellow-400">Unlock</span></h2>
             </div>
        </div>
    )
});

const QuestTracker = memo(({ found, t }) => {
  const total = 4;
  const isComplete = found.length >= total;
  const [isOpen, setIsOpen] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const hasWord1 = found.includes('lumos');
  const hasWord2 = found.includes('alohomora');
  const hasWord3 = found.includes('wingardium');
  const hasHighScore = found.includes('highscore');
         
  const wordCount = [hasWord1, hasWord2, hasWord3].filter(Boolean).length;

  useEffect(() => {
      if (isComplete) {
          setShowVictory(true);
          const timer = setTimeout(() => {
              setShowVictory(false);
              setIsOpen(false);
          }, 6000);
          return () => clearTimeout(timer);
      }
  }, [isComplete]);

  if (!isVisible) return null;

  return (
    <>
    {showVictory && <VictoryCelebration />}
    <div className="fixed bottom-6 left-6 z-[100] hidden md:flex flex-col items-start gap-4">
        {showVictory && (
            <div className="absolute bottom-20 left-0 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-6 py-4 rounded-2xl shadow-glow-yellow animate-fade-in-up flex items-center gap-4 font-black uppercase text-sm tracking-wider min-w-[280px]">
                <Trophy size={24} className="animate-bounce" />
                <div>
                    <p className="leading-none mb-1">{t.congrats}</p>
                    <p className="text-[10px] opacity-80 font-bold">{t.benefit}</p>
                </div>
            </div>
        )}

        <div 
            className={`group flex flex-col bg-[#0a0a0a] shadow-2xl border ${isComplete ? 'border-yellow-500/50 shadow-glow-yellow' : 'border-white/10'} rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden relative w-auto min-w-[300px] will-change-transform`}
            onClick={() => !isComplete && setIsOpen(!isOpen)}
        >
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${isComplete ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                          {isComplete ? <Trophy size={20} /> : <ListTodo size={20} />}
                      </div>
                      <div>
                          <p className={`text-xs font-black uppercase tracking-wider ${isComplete ? 'text-yellow-500' : 'text-white'}`}>{isComplete ? t.congrats : t.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                              <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                  <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${(found.length / total) * 100}%` }} />
                              </div>
                              <p className="text-[10px] font-bold text-slate-500">{found.length}/{total}</p>
                          </div>
                      </div>
                </div>
                <div className="flex items-center gap-2">
                    {!isComplete && <ChevronDown size={16} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
                    <button 
                        onClick={(e) => { e.stopPropagation(); setIsVisible(false); }} 
                        className="text-slate-600 hover:text-red-500 transition-colors p-1"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {isOpen && !isComplete && (
                <div className="px-4 pb-4 animate-reveal border-t border-white/5 pt-4">
                      <p className="text-[10px] text-slate-400 font-medium italic mb-4 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                          <Info size={12} className="inline mr-2 text-red-500 relative -top-[1px]" />
                          {t.instruction}
                      </p>
                      <div className="space-y-3">
                          <div className={`flex items-center justify-between p-2 rounded-lg border ${wordCount === 3 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-transparent border-transparent'}`}>
                              <div className="flex items-center gap-3">
                                  <MousePointer2 size={14} className={wordCount === 3 ? 'text-emerald-500' : 'text-slate-500'} />
                                  <span className={`text-[10px] font-bold uppercase tracking-wide ${wordCount === 3 ? 'text-white' : 'text-slate-500'}`}>{t.task_words}</span>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-slate-600">{wordCount}/3</span>
                          </div>
                          <div className={`flex items-center justify-between p-2 rounded-lg border ${hasHighScore ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-transparent border-transparent'}`}>
                              <div className="flex items-center gap-3">
                                  <Crosshair size={14} className={hasHighScore ? 'text-emerald-500' : 'text-slate-500'} />
                                  <span className={`text-[10px] font-bold uppercase tracking-wide ${hasHighScore ? 'text-white' : 'text-slate-500'}`}>{t.task_score}</span>
                              </div>
                              {hasHighScore ? <Check size={12} className="text-emerald-500" /> : <div className="w-3 h-3 rounded-full border border-slate-700" />}
                          </div>
                      </div>
                </div>
            )}
        </div>
    </div>
    </>
  );
});

// --- NAVBAR ISOLATED SCROLL ---
const Navbar = memo(({ view, navigateTo, openChat, t, isMuted, toggleMute }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
      const handleScroll = () => {
          const isScrolled = window.scrollY > 20;
          setScrolled(prev => prev !== isScrolled ? isScrolled : prev);
      };
      // Passive listener for performance
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = useCallback((target) => {
      navigateTo(target);
      setIsMobileMenuOpen(false);
  }, [navigateTo]);

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 font-black will-change-transform ${(scrolled || view === 'play') ? 'bg-[#050505] border-b border-white/10 py-4 shadow-2xl' : 'bg-transparent py-6 md:py-10'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center relative">
        <div onClick={() => { navigateTo('home'); }} className="group cursor-pointer flex items-center gap-4 md:gap-6 active:scale-90 transition-all duration-500 z-50">
          <div className="relative">
            <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-40 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.8)] transition-opacity" />
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-tr from-red-600 via-red-500 to-orange-500 rounded-2xl md:rounded-3xl flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform duration-500 text-xl md:text-2xl font-black relative z-10 will-change-transform">LL</div>
            <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-emerald-500 border-[3px] border-black rounded-full shadow-glow-emerald z-20"></div>
          </div>
          <div className="flex flex-col leading-tight font-black pt-1">
            <span className="text-white font-black text-xl md:text-2xl uppercase tracking-tighter group-hover:text-red-500 transition-colors duration-500 text-left">Lucien Lukes</span>
            <span className="text-[9px] md:text-[10px] text-slate-500 font-black tracking-[0.4em] md:tracking-[0.6em] uppercase italic group-hover:text-white transition-colors duration-700">Growth Architect</span>
          </div>
        </div>

        <button className="md:hidden text-white z-50 p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center space-y-12 animate-reveal">
              <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 right-8 text-white/50 hover:text-white p-4"><X size={32} /></button>
              
              <div className="flex flex-col items-center gap-10">
                <button onClick={() => handleNav('home')} className={`text-4xl font-black uppercase tracking-[0.2em] ${view === 'home' ? 'text-red-500' : 'text-white'}`}>{t.expertise}</button>
                <button onClick={() => handleNav('bio')} className={`text-4xl font-black uppercase tracking-[0.2em] ${view === 'bio' ? 'text-red-500' : 'text-white'}`}>{t.bio}</button>
                <button onClick={() => handleNav('play')} className={`text-4xl font-black uppercase tracking-[0.2em] ${view === 'play' ? 'text-red-500' : 'text-white'}`}>{t.lab}</button>
              </div>

              <div className="flex flex-col items-center gap-8 mt-8 border-t border-white/10 pt-12 w-2/3">
                <button onClick={() => { openChat(); setIsMobileMenuOpen(false); }} className="w-full bg-white text-black px-10 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl">{t.collab}</button>
                <div className="flex items-center gap-6">
                    <button onClick={toggleMute} className="text-slate-500 hover:text-white transition-colors p-3 border-2 border-white/10 rounded-2xl">
                        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                </div>
              </div>
          </div>
        )}

        <div className="hidden md:flex items-center gap-16 text-[12px] font-black uppercase tracking-[0.4em]">
          <button onClick={() => navigateTo('home')} className={`transition-all duration-500 hover:text-white relative group ${view === 'home' ? 'text-white' : 'text-slate-500'}`}>{t.expertise}</button>
          <button onClick={() => navigateTo('bio')} className={`transition-all duration-500 hover:text-white relative group ${view === 'bio' ? 'text-white' : 'text-slate-500'}`}>{t.bio}</button>
          <button onClick={() => navigateTo('play')} className={`flex items-center gap-3 transition-all duration-500 hover:text-red-500 group ${view === 'play' ? 'text-red-500' : 'text-slate-500'}`}><Gamepad2 size={18} /> {t.lab}</button>
          <button onClick={openChat} className="bg-white text-black px-12 py-5 rounded-[2rem] font-black hover:bg-red-600 hover:text-white transition-all shadow-2xl active:scale-95 tracking-[0.2em] font-black uppercase border-2 border-transparent">{t.collab}</button>
          
          <div className="flex items-center gap-4 ml-[-20px]">
              <button onClick={toggleMute} className="text-slate-500 hover:text-white transition-colors">
                 {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
          </div>
        </div>
      </div>
    </nav>
  );
});

const SkillRadar = memo(({t}) => {
    return (
        <div className="relative w-full aspect-square max-w-[280px] mx-auto group">
            <svg viewBox="-30 -30 260 260" className="w-full h-full drop-shadow-2xl">
                <polygon points="100,20 180,100 100,180 20,100" fill="none" stroke="#333" strokeWidth="1" />
                <polygon points="100,40 160,100 100,160 40,100" fill="none" stroke="#222" strokeWidth="1" />
                <polygon points="100,60 140,100 100,140 60,100" fill="none" stroke="#222" strokeWidth="1" />
                
                <text x="100" y="10" textAnchor="middle" fill="#dc2626" fontSize="10" fontWeight="900" letterSpacing="1">STRATEGY</text>
                <text x="200" y="103" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900" letterSpacing="1">TECH</text>
                <text x="100" y="200" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900" letterSpacing="1">DATA</text>
                <text x="0" y="103" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900" letterSpacing="1">CREATIVE</text>

                <polygon points="100,25 170,100 100,170 35,100" fill="rgba(220, 38, 38, 0.2)" stroke="#dc2626" strokeWidth="2" className="animate-pulse" />
                
                <circle cx="100" cy="25" r="3" fill="#fff" />
                <circle cx="170" cy="100" r="3" fill="#fff" />
                <circle cx="100" cy="170" r="3" fill="#fff" />
                <circle cx="35" cy="100" r="3" fill="#fff" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black border border-white/10 rounded-full px-3 py-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">{t.radar_title}</span>
                </div>
            </div>
        </div>
    )
});

// --- (1) OPTIMIZED TECH STACK TICKER ---
const TechStackTicker = memo(({t}) => {
    const containerRef = useRef(null);
    const isVisible = useVisibilityControl(containerRef);
    const stack = useMemo(() => ["Meta Ads", "Google Ads", "GA4", "SEO Technical", "TikTok Ads", "HubSpot", "Zapier", "Copywriting", "Viral Loops", "Looker Studio", "Notion", "LinkedIn Growth"], []);
    
    return (
        <div ref={containerRef} className={`w-full overflow-hidden border-y border-white/5 bg-[#020202] py-4 relative ${!isVisible ? 'paused' : ''} paused-when-modal`} style={{ contain: 'content' }}>
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
            
            {/* Duplication réduite : seulement 2 copies nécessaires pour une boucle fluide si transform -50% */}
            <div className="flex whitespace-nowrap animate-scroll-normal will-change-transform">
                {[...stack, ...stack].map((item, i) => (
                    <span key={i} className="mx-6 text-slate-500 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transform-gpu">
                        <div className="w-1 h-1 bg-red-600 rounded-full" /> {item}
                    </span>
                ))}
            </div>
        </div>
    );
});

const TrustStrip = memo(({ lang, t }) => (
  <div className="paused-when-modal">
    <div className="py-6 md:py-10 border-y border-white/5 bg-[#0a0a0a] overflow-hidden relative z-30">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center lg:justify-between gap-4 md:gap-8 items-center text-slate-500 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.2em]">
        <div className="flex items-center gap-2 md:gap-3"><ShieldCheck size={16} className="text-emerald-500" /> {t.sat}</div>
        <div className="flex items-center gap-2 md:gap-3"><Activity size={16} className="text-red-500" /> {t.proj}</div>
        <div className="flex items-center gap-2 md:gap-3"><Globe2 size={16} className="text-blue-500" /> {t.int}</div>
        <div className="flex items-center gap-2 md:gap-3"><Lock size={16} className="text-yellow-500" /> {t.conf}</div>
        </div>
    </div>
    <div className="flex justify-center py-8 animate-bounce w-full relative z-20">
        <ChevronDown className="text-white/40 w-8 h-8 md:w-10 md:h-10" />
    </div>
  </div>
));

const TestimonialsSection = memo(({ testimonials, t }) => {
  const containerRef = useRef(null);
  const isVisible = useVisibilityControl(containerRef);
  usePerformanceLogger("TestimonialsSection");

  return (
    <section ref={containerRef} className={`cv-section py-16 md:py-40 px-6 relative font-black border-t border-white/5 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 paused'} paused-when-modal`}>
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-24">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-black uppercase text-[10px] md:text-[11px] tracking-[0.8em]">{t.sub}</p>
          <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic">{t.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[2rem] flex flex-col gap-6 hover:border-red-600/50 transition-colors">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />)}
              </div>
              <p className="text-slate-300 font-medium italic text-sm md:text-base leading-relaxed">"{t.text}"</p>
              <div className="mt-auto flex items-center gap-4 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-black border border-white/10 flex items-center justify-center font-bold text-xs text-white">{t.name.charAt(0)}</div>
                <div>
                  <p className="text-white font-black uppercase text-xs tracking-wider">{t.name}</p>
                  <p className="text-red-500 text-[9px] font-bold uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

const MemoizedMissionButton = memo(({ stack, isSelected, onClick }) => {
    return (
        <button onClick={onClick} className={`relative px-6 py-5 rounded-2xl border text-left flex items-start justify-between gap-4 group active:scale-95 transition-colors duration-200 ${isSelected ? 'bg-red-600 border-red-600 text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}>
            {stack.popular && (
            <div className="absolute -top-3 -right-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-lg z-10 border border-black flex items-center gap-1">
                <Flame size={10} fill="white" /> Top
            </div>
            )}
            {stack.isNew && (
            <div className="absolute -top-3 -right-2 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-lg z-10 border border-black flex items-center gap-1">
                <Sparkles size={10} fill="white" /> NEW
            </div>
            )}
            <div className="space-y-1">
            <span className="font-black uppercase text-xs tracking-wider block">{stack.name}</span>
            <span className={`text-[10px] font-medium block leading-tight ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>{stack.definition}</span>
            </div>
            {isSelected && <CheckCircle size={18} className="flex-shrink-0 mt-1" />}
        </button>
    );
});

const CollaborationForm = memo(({ onClose, playSound, t, stackData, questCompleted }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: 'freelance',
    isMinecraft: false,
    missions: [],
    duration: '',
    location: 'remote',
    project: '',
    email: ''
  });

  const toggleMission = useCallback((missionName) => {
    setFormData(prev => {
      const exists = prev.missions.includes(missionName);
      if (exists) return { ...prev, missions: prev.missions.filter(m => m !== missionName) };
      return { ...prev, missions: [...prev.missions, missionName] };
    });
    playSound(800, 'sine', 0.05);
  }, [playSound]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    playSound(600, 'triangle', 0.3);

    const scriptURL = "https://script.google.com/macros/s/AKfycbwhOLmm_yUrbGkdW-Px7vFxHul1yWYBAQYaehtsCJh7W29kVHJYa9tEgUN0mJzE-FwQ8w/exec";
    
    const payload = {
        type: formData.type,
        missions: formData.missions.join(', '),
        isMinecraft: formData.isMinecraft ? "Oui" : "Non",
        duration: formData.duration,
        location: formData.location,
        project: formData.project,
        email: formData.email,
        discount: questCompleted ? "Oui (-5%)" : "Non"
    };

    try {
      await fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("Erreur d'envoi formulaire", err);
    }

    setStep(3); // écran succès
  };

  const handleContainerClick = (e) => {
     // Empêche le clic de remonter et de déclencher des listeners globaux s'il y en a
     e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-6 animate-quick-pop modal-container" onClick={handleContainerClick}>
      <div className="absolute inset-0 bg-black/95" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[2rem] md:rounded-[3rem] shadow-3xl border-b-4 border-b-red-600 overflow-hidden flex flex-col max-h-[90vh] will-change-transform">
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 bg-black sticky top-0 z-10">
          <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic">{t.title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition bg-white/5 p-3 rounded-full hover:rotate-90 duration-300"><X size={20} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
          {step === 1 && (
            <div className="space-y-8 md:space-y-12 animate-reveal">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-red-500 font-black uppercase text-[10px] tracking-[0.2em]">{t.step1}</p>
                    {questCompleted && (
                        <div className="flex items-center gap-3 animate-fade-in-up">
                            <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-glow-yellow">
                                <Award size={12} className="fill-black" />
                                <span className="text-[10px] font-black uppercase tracking-wider">{t.certified_badge}</span>
                            </div>
                            <div className="text-[10px] font-bold text-yellow-500 uppercase tracking-wide">
                                {t.quest_bonus}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <button onClick={() => setFormData({...formData, type: 'freelance'})} className={`flex-1 p-6 rounded-3xl border-2 transition-colors duration-200 flex flex-col items-center gap-3 ${formData.type === 'freelance' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}>
                    <Zap size={24} className={formData.type === 'freelance' ? 'text-red-600' : ''} />
                    <span className="font-black uppercase tracking-wider text-sm">{t.free}</span>
                  </button>
                  <button onClick={() => setFormData({...formData, type: 'cdi'})} className={`flex-1 p-6 rounded-3xl border-2 transition-colors duration-200 flex flex-col items-center gap-3 ${formData.type === 'cdi' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}>
                    <Job size={24} className={formData.type === 'cdi' ? 'text-red-600' : ''} />
                    <span className="font-black uppercase tracking-wider text-sm">{t.cdi}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-red-500 font-black uppercase text-[10px] tracking-[0.2em]">{t.step2_title}</p>
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setFormData(p => ({...p, isMinecraft: !p.isMinecraft}))}>
                      <span className={`text-[10px] font-black uppercase tracking-wider transition-colors ${formData.isMinecraft ? 'text-emerald-500' : 'text-slate-500 group-hover:text-white'}`}>{t.mc}</span>
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${formData.isMinecraft ? 'bg-emerald-500' : 'bg-white/10'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${formData.isMinecraft ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stackData.map(stack => (
                    <MemoizedMissionButton 
                        key={stack.name}
                        stack={stack}
                        isSelected={formData.missions.includes(stack.name)}
                        onClick={() => toggleMission(stack.name)}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button onClick={() => { setStep(2); playSound(400); }} className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all shadow-xl active:scale-95">{t.btn_cont} <ArrowRight size={18} className="inline ml-2" /></button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-8 animate-reveal">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.type === 'freelance' && (
                  <div className="space-y-2">
                    <label className="text-red-500 font-black uppercase text-[10px] tracking-[0.2em]">{t.duration}</label>
                    <select required className="optimized-input w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:border-red-600 outline-none appearance-none font-bold cursor-pointer hover:bg-white/10" onChange={(e) => setFormData({...formData, duration: e.target.value})}>
                      <option value="" className="bg-black text-slate-500">{t.sel_duration}</option>
                      <option value="ponctuel" className="bg-black">{t.d_one}</option>
                      <option value="1-3mois" className="bg-black">{t.d_short}</option>
                      <option value="3-6mois" className="bg-black">{t.d_mid}</option>
                      <option value="longue" className="bg-black">{t.d_long}</option>
                    </select>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-red-500 font-black uppercase text-[10px] tracking-[0.2em]">{t.loc}</label>
                  <div className="flex gap-2">
                    {['remote', 'presential', 'hybrid'].map(loc => (
                      <button key={loc} type="button" onClick={() => setFormData({...formData, location: loc})} className={`flex-1 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-wider transition-colors duration-200 ${formData.location === loc ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}>
                        {loc === 'remote' ? t.l_rem : loc === 'presential' ? t.l_site : t.l_hyb}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-red-500 font-black uppercase text-[10px] tracking-[0.2em]">{t.proj_label}</label>
                <textarea required placeholder={t.proj_placeholder} className="optimized-input w-full h-32 bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-white text-sm focus:border-red-600 outline-none resize-none font-medium placeholder:text-slate-600 focus:bg-white/10" onChange={(e) => setFormData({...formData, project: e.target.value})}></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-red-500 font-black uppercase text-[10px] tracking-[0.2em]">{t.email_label}</label>
                <input required type="email" placeholder="contact@entreprise.com" className="optimized-input w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-sm focus:border-red-600 outline-none font-bold placeholder:text-slate-600 focus:bg-white/10" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>

              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="px-8 py-6 rounded-2xl border border-white/10 text-white font-black uppercase hover:bg-white/5 transition-colors duration-200 text-xs tracking-widest">{t.btn_back}</button>
                <button type="submit" className="flex-1 bg-red-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors duration-200 shadow-glow-red active:scale-95 flex items-center justify-center gap-3">{t.btn_send} <Send size={18} /></button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-8 animate-reveal">
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-glow-emerald">
                <CheckCircle size={40} className="text-black" />
              </div>
              <div className="space-y-4">
                <h4 className="text-3xl font-black text-white uppercase tracking-tighter">{t.success_title}</h4>
                <p className="text-slate-400 font-medium max-w-md mx-auto">{t.success_msg} <span className="text-white">{formData.email}</span>.</p>
              </div>
              <button onClick={onClose} className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-500 hover:text-black transition-colors duration-200 mt-8">{t.close}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

const Modal = memo(({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-6 animate-quick-pop modal-container" onClick={(e) => e.stopPropagation()}>
      <div className="absolute inset-0 bg-black/90" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-[#0d0d0d] border border-white/10 rounded-[2rem] md:rounded-[3rem] shadow-3xl border-b-4 border-b-red-600 overflow-hidden transform transition-all will-change-transform">
        <button onClick={onClose} className="absolute top-6 right-6 md:top-8 md:right-8 text-slate-500 hover:text-white transition bg-white/5 p-3 rounded-full z-20 hover:rotate-90 duration-300"><X size={20} /></button>
        <div className="max-h-[85vh] overflow-y-auto custom-scrollbar p-8 md:p-14">
          {children}
        </div>
      </div>
    </div>
  );
});

const HeroSection = memo(({ openChat, playSound, profileImageUrl, t, handleDownload, triggerLongPress }) => {
    const pressTimer = useRef(null);
    usePerformanceLogger("HeroSection");

    const handlePointerDown = () => {
        pressTimer.current = setTimeout(() => {
            triggerLongPress();
        }, 2000);
    };

    const handlePointerUp = () => {
        if (pressTimer.current) clearTimeout(pressTimer.current);
    };

    return (
      <section id="hero" className="relative pt-40 md:pt-72 pb-24 md:pb-48 px-6 font-black cv-section paused-when-modal">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-900/10 via-transparent to-[#020202] -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] md:h-[1200px] bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.15)_0%,transparent_70%)] -z-10" />
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#020202] to-transparent -z-10" />
        <div className="digital-grid absolute inset-0 opacity-10 -z-20" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-8 space-y-8 md:space-y-12 animate-reveal overflow-visible">
            <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-black text-red-500 uppercase tracking-[0.6em] shadow-2xl animate-fade-in-up">
              <Sparkles size={16} className="animate-pulse text-yellow-500" /> {t.badge}
            </div>
            <h1 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] lg:leading-[0.8] uppercase italic animate-fade-in-up delay-100 select-none cursor-pointer active:scale-[0.98] transition-transform w-full break-words whitespace-normal hover-gpu"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
              {t.title1} <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-400 to-orange-500 drop-shadow-2xl inline-block pr-12 pb-4">{t.title2}</span>
            </h1>
            <p className="text-lg md:text-3xl text-slate-400 max-w-2xl leading-relaxed font-light border-l-4 border-red-600 pl-6 md:pl-10 italic transition-all hover:text-white duration-500 animate-fade-in-up delay-200">
              "{t.sub}"
            </p>
            <div className="flex flex-col md:flex-row flex-wrap gap-4 md:gap-8 pt-6 animate-fade-in-up delay-300">
              <button onClick={openChat} className="w-full md:w-auto relative group bg-red-600 text-white px-8 py-4 md:px-12 md:py-6 rounded-2xl font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm shadow-glow-red transition-transform hover:-translate-y-2 active:scale-95 overflow-hidden">
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 flex items-center justify-center gap-3 font-black">{t.btn_work} <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" /></span>
              </button>
              <button onClick={handleDownload} className="w-full md:w-auto flex items-center justify-center gap-4 md:gap-6 bg-white/5 border border-white/10 px-8 py-4 md:px-10 md:py-6 rounded-2xl hover:bg-white/10 hover:-translate-y-2 transition-all group border-b-4 border-b-red-500/20 shadow-2xl font-black uppercase text-[10px] md:text-[11px] tracking-widest">{t.btn_cv} <Download size={20} className="text-red-500 ml-2" /></button>
            </div>
          </div>
          <div className="lg:col-span-4 relative group animate-reveal delay-500 hidden lg:block pr-12" style={{ contain: 'none' }}>
            <div className="relative aspect-[3.8/5] rounded-[5rem] overflow-hidden border-2 border-white/10 shadow-3xl z-10">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-40" />
              <img 
                  src={profileImageUrl} 
                  srcSet={`${profileImageUrl}?w=400 400w, ${profileImageUrl}?w=800 800w, ${profileImageUrl}?w=1200 1200w`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt="Lucien Lukes Freelance Marketing Montpellier France" 
                  className="w-full h-full object-cover object-top brightness-110 contrast-105 hover-gpu transition-transform duration-500 group-hover:scale-105" 
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
              />
            </div>
            
            {/* BULLE EXPÉRIENCE */}
            <div className="absolute -top-12 right-8 z-50 animate-float bg-[#0a0a0a] border border-white/10 p-3 pr-5 rounded-full flex items-center gap-3 shadow-xl will-change-transform">
                  <div className="bg-red-600/20 p-2 rounded-full text-red-500"><Trophy size={16} /></div>
                  <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{t.exp}</p>
                      <p className="text-white font-black text-sm leading-none">5+ Ans</p>
                  </div>
            </div>

            {/* BULLE SUCCÈS */}
            <div className="absolute -bottom-12 left-8 z-50 animate-float animation-delay-2000 bg-[#0a0a0a] border border-white/10 p-3 pr-5 rounded-full flex items-center gap-3 shadow-xl will-change-transform">
                  <div className="bg-emerald-500/20 p-2 rounded-full text-emerald-500"><CheckCircle size={16} /></div>
                  <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{t.proj}</p>
                      <p className="text-white font-black text-sm leading-none">{t.success}</p>
                  </div>
            </div>

          </div>
        </div>
      </section>
    );
});

const Experiences = memo(({ experiences, onSpell, t }) => {
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const isVisible = useVisibilityControl(containerRef);
  // Pour l'apparition initiale (reveal)
  const hasAppeared = useInViewOnce(containerRef);
  usePerformanceLogger("Experiences");

  useEffect(() => {
    let ticking = false;
    let containerRect = { top: 0, height: 0 };
    let resizeTimer; // For debounce
     
    // Initial measure
    const updateMetrics = () => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        containerRect = { top: r.top + scrollTop, height: r.height };
      }
    };
     
    // Optimized scroll handler (ticking)
    const onScroll = () => {
      // Guard: si le composant n'est pas visible, on ne fait rien
      if (!isVisible && containerRef.current) {
          // Fallback check in case isVisible state hasn't updated yet but we are scrolling fast
          const rect = containerRef.current.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      }

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!progressRef.current || containerRect.height === 0) {
            ticking = false;
            return;
          }
           
          const scrollY = window.scrollY;
          const startOffset = window.innerHeight / 2;
          const triggerPoint = containerRect.top - startOffset;
           
          let progress = (scrollY - triggerPoint) / containerRect.height;
          progress = Math.max(0, Math.min(progress, 1));
           
          // GPU Optimization with translateZ
          progressRef.current.style.transform = `scaleY(${progress}) translateZ(0)`;
           
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial setup sequence
    requestAnimationFrame(() => {
        updateMetrics();
        onScroll();
    });

    const onResizeOrOrientation = () => {
       clearTimeout(resizeTimer);
       resizeTimer = setTimeout(() => {
           requestAnimationFrame(() => {
               updateMetrics();
               onScroll();
           });
       }, 200); // 200ms debounce
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResizeOrOrientation, { passive: true });
    window.addEventListener('orientationchange', onResizeOrOrientation, { passive: true });
     
    return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResizeOrOrientation);
        window.removeEventListener('orientationchange', onResizeOrOrientation);
        clearTimeout(resizeTimer);
    }
  }, [isVisible]);

  return (
    <section id="missions" ref={containerRef} className={`py-16 md:py-32 px-6 relative font-black cv-section ${hasAppeared ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 ${!isVisible ? 'paused' : ''} paused-when-modal`}>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-red-600/5 to-transparent -z-10" />
      <div className="max-w-6xl mx-auto space-y-12 md:space-y-32">
        <div className="text-center space-y-6">
            <p className="text-red-500 font-black uppercase text-[11px] tracking-[1em] animate-pulse">{t.roadmap}</p>
            <h2 className="text-4xl md:text-7xl lg:text-[100px] font-black text-white tracking-tighter uppercase relative z-10 leading-[0.9] md:leading-[0.8] italic font-black">{t.title}</h2>
        </div>
        <div className="relative space-y-12 md:space-y-32 text-left">
          <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-[4px] bg-white/5 hidden md:block overflow-hidden rounded-full shadow-inner font-black">
              <div ref={progressRef} className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-600 via-orange-500 to-red-400 origin-top font-black gpu-accel will-change-transform" style={{ transform: 'scaleY(0) translateZ(0)' }} />
          </div>

          {experiences.map((exp, i) => (
            <div key={i} className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-20 group ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} animate-reveal font-black`}>
              <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-black border-4 border-red-600 z-20 hover-gpu group-hover:scale-150 transition-all duration-500 hidden md:block shadow-glow-red font-black" />
              <div className={`w-full md:w-[45%] p-6 md:p-16 rounded-[2rem] md:rounded-[5rem] transition-all duration-1000 relative overflow-hidden font-black ${exp.isPoudlard ? 'bg-[#0a0a0a] border-amber-500/40 shadow-2xl ring-1 ring-amber-500/20' : 'bg-slate-900 border-white/10 hover:bg-slate-900 group-hover:border-red-500/40 shadow-3xl'}`}>
                {exp.isPoudlard && <div className="absolute top-0 right-0 bg-amber-500 px-6 py-3 md:px-10 md:py-4 rounded-bl-[2rem] md:rounded-bl-[2.5rem] font-black text-[9px] md:text-[11px] text-black tracking-widest uppercase flex items-center gap-2 md:gap-3 shadow-2xl font-black"><span className="animate-spin-slow"><Sparkles size={14} fill="black" /></span> Projet Pilier</div>}
                <div className="space-y-6 md:space-y-12 font-black">
                  <div className="space-y-4 font-black">
                    <span className={`${exp.isPoudlard ? 'text-amber-500' : 'text-red-600'} font-black text-[10px] md:text-[11px] tracking-[0.4em] md:tracking-[0.6em] uppercase`}>{exp.period}</span>
                    {exp.link ? (
                        <a href={exp.link} target="_blank" rel="noopener noreferrer" className="block w-fit group/link">
                            <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none group-hover/link:text-red-500 group-hover/link:underline transition-all duration-300 decoration-4 underline-offset-8 decoration-red-600 flex items-center gap-4">
                                {exp.company} <ExternalLink size={20} className="opacity-0 group-hover/link:opacity-100 transition-opacity -translate-y-2" />
                            </h3>
                        </a>
                    ) : (
                        <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none hover-gpu group-hover:translate-x-2 transition-transform duration-500">{exp.company}</h3>
                    )}
                    <p className="text-slate-500 font-bold uppercase text-[9px] md:text-[11px] tracking-[0.3em] md:tracking-[0.4em] italic">{exp.role}</p>
                  </div>
                  <div className={`p-6 md:p-8 border rounded-[2rem] md:rounded-[2.5rem] transition-all duration-700 ${exp.isPoudlard ? 'bg-amber-500/5 border-amber-500/20 group-hover:bg-amber-500/10' : 'bg-white/5 border-white/5 group-hover:bg-white/10'}`}>
                      <p className={`${exp.isPoudlard ? 'text-amber-500' : 'text-red-600'} font-black text-[9px] md:text-[10px] tracking-[0.3em] uppercase mb-2 md:mb-3`}>{t.impact}</p>
                      <p className="text-white text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none">{exp.impact}</p>
                  </div>
                  <p className="text-slate-400 font-light leading-relaxed italic border-l-4 border-red-600/50 pl-6 md:pl-10 text-xl md:text-2xl max-w-md font-black">
                    {exp.isPoudlard ? (
                      <>
                        "Création et pilotage intégral du serveur Minecraft RPG <span className="text-amber-500 cursor-pointer hover:underline" onClick={() => onSpell('lumos')}>Harry Potter</span> n°1 en France."
                      </>
                    ) : `"${exp.desc}"`}
                  </p>
                  <div className="grid grid-cols-1 gap-4 md:gap-6 pt-8 md:pt-12 border-t border-white/10 font-black">
                      {exp.details.map((d, idx) => (
                        <div key={idx} className="flex items-start gap-4 md:gap-6 text-base md:text-lg font-medium text-slate-300 hover:text-white transition-all group/item duration-300">
                          <ChevronRight className={`mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6 ${exp.isPoudlard ? 'text-amber-500' : 'text-red-600'} hover-gpu group-hover/item:translate-x-2 transition-transform`} />
                          {d}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="hidden md:block w-[45%]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

const CursusSectionComp = memo(({ t }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-left font-black paused-when-modal">
    <div className="group relative p-8 md:p-12 bg-slate-900/40 border border-emerald-500/20 rounded-[3rem] md:rounded-[4rem] transition-all hover:bg-slate-900 shadow-2xl overflow-hidden font-black">
      <GraduationCap size={40} className="text-emerald-500 mb-6 md:mb-8 relative z-10" />
      <h4 className="text-white font-black text-2xl md:text-3xl uppercase tracking-tighter leading-none relative z-10">{t.dc.title}</h4>
      <p className="text-slate-400 font-bold uppercase text-xs mt-3 mb-6 md:mb-8 tracking-widest italic font-black relative z-10">{t.dc.sub}</p>
      <div className="space-y-4 md:space-y-5 pt-6 md:pt-8 border-t border-white/5 relative z-10">
         <div className="flex items-start gap-4 text-xs font-black uppercase text-white/70"><CheckCircle size={16} className="text-emerald-500 mt-0.5" /> Pilotage de la Performance & ROI 360°</div>
         <div className="flex items-start gap-4 text-xs font-black uppercase text-white/70"><CheckCircle size={16} className="text-emerald-500 mt-0.5" /> Data Visualisation & Analytics (GA4, BigQuery)</div>
         <div className="flex items-start gap-4 text-xs font-black uppercase text-white/70"><CheckCircle size={16} className="text-emerald-500 mt-0.5" /> Management de l'Innovation & IA appliquée</div>
      </div>
    </div>
    <div className="group relative p-8 md:p-12 bg-slate-900/40 border border-red-500/20 rounded-[3rem] md:rounded-[4rem] transition-all hover:bg-slate-900 shadow-2xl overflow-hidden font-black">
      <School size={40} className="text-red-500 mb-6 md:mb-8 relative z-10" />
      <h4 className="text-white font-black text-2xl md:text-3xl uppercase tracking-tighter leading-none relative z-10">{t.iscom.title}</h4>
      <p className="text-slate-400 font-bold uppercase text-xs mt-3 mb-6 md:mb-8 tracking-widest italic font-black relative z-10">{t.iscom.sub}</p>
      <div className="space-y-4 md:space-y-5 pt-6 md:pt-8 border-t border-white/5 relative z-10">
         <div className="flex items-start gap-4 text-xs font-black uppercase text-white/70"><CheckCircle size={16} className="text-red-500 mt-0.5" /> Psychologie cognitive & Étude de Marché</div>
         <div className="flex items-start gap-4 text-xs font-black uppercase text-white/70"><CheckCircle size={16} className="text-red-500 mt-0.5" /> Direction Artistique & Creative Strategy</div>
         <div className="flex items-start gap-4 text-xs font-black uppercase text-white/70"><CheckCircle size={16} className="text-red-500 mt-0.5" /> Médias traditionnels & Publicité massive</div>
      </div>
    </div>
  </div>
));

const SectionBio = memo(({ profileImageUrl, navigateTo, copyDiscord, copyFeedback, playSound, onSpell, t, handleDownload, sayHello }) => {
  const containerRef = useRef(null);
  const isVisible = useVisibilityControl(containerRef);
  usePerformanceLogger("SectionBio");

  return (
  <div ref={containerRef} className={`pt-24 md:pt-40 pb-16 md:pb-24 px-6 animate-reveal font-black ${!isVisible ? 'paused' : ''} paused-when-modal`}>
    <div className="max-w-7xl mx-auto">
      <div className="mb-12 md:mb-20 space-y-6">
        <p className="text-red-500 font-black uppercase text-[11px] tracking-[1em] animate-fade-in-up">{t.sub}</p>
        <h2 className="text-5xl md:text-7xl lg:text-9xl font-black text-white uppercase tracking-tighter italic leading-none animate-fade-in-up delay-100">{t.title}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up delay-200">
        <div className="lg:col-span-4 space-y-8">
          <div className="relative rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border border-white/10 aspect-[3/4] group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer-fast z-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 via-transparent to-transparent z-10 opacity-60"></div>
            <img 
                src={profileImageUrl} 
                srcSet={`${profileImageUrl}?w=400 400w, ${profileImageUrl}?w=800 800w, ${profileImageUrl}?w=1200 1200w`}
                sizes="(max-width: 768px) 100vw, 50vw"
                alt="Consultant influence marketing & Freelance marketing France" 
                className="w-full h-full object-cover object-top hover-gpu transition-transform duration-700 group-hover:scale-105" 
                loading="lazy"
                decoding="async"
            />
            
            <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8 z-20 space-y-2">
              <div className="flex items-center gap-2 text-white font-black uppercase text-xs tracking-wider mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                {t.avail}
              </div>
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest border-t border-white/20 pt-2">{t.loc}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a href="https://www.linkedin.com/in/lucien-lukes-1b1a84193/" target="_blank" rel="noopener noreferrer" className="bg-[#0077B5]/10 border border-[#0077B5]/30 hover:bg-[#0077B5] hover:text-white text-[#0077B5] p-5 md:p-6 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all group shadow-xl">
              <Linkedin size={24} />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Linkedin</span>
            </a>
            <button onClick={copyDiscord} className="bg-[#5865F2]/10 border border-[#5865F2]/30 hover:bg-[#5865F2] hover:text-white text-[#5865F2] p-5 md:p-6 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all group shadow-xl">
              <Hash size={24} />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{copyFeedback ? "Copié !" : "Discord"}</span>
            </button>
          </div>
          <button onClick={handleDownload} className="w-full bg-red-600 hover:bg-white hover:text-black text-white p-5 md:p-6 rounded-3xl flex items-center justify-center gap-4 transition-all font-black uppercase text-xs tracking-widest shadow-glow-red">
            <Download size={18} /> {t.dl}
          </button>
          
          <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-[2rem] shadow-xl">
             <SkillRadar t={t} />
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 space-y-8 md:space-y-12 relative overflow-hidden shadow-3xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(closest-side,rgba(220,38,38,0.1),transparent)] pointer-events-none"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9] italic mb-4 flex items-center gap-3 md:gap-4 flex-wrap">
                {t.intro_1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white">
                  <span onClick={() => onSpell('alohomora')} className="cursor-pointer hover:text-red-400 transition-colors">{t.intro_2}</span>
                </span>
                <span onClick={sayHello} className="animate-wave inline-block origin-[70%_70%] cursor-pointer hover:scale-125 transition-transform duration-200">👋</span>
              </h3>
              <div className="flex items-center gap-4">
                 <div className="h-[2px] w-12 bg-red-600"></div>
                 <p className="text-slate-400 font-bold uppercase text-[10px] md:text-xs tracking-[0.3em]">{t.job}</p>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8 text-base md:text-lg text-slate-300 leading-relaxed font-medium relative z-10">
              <p><span className="text-white font-bold bg-red-600/10 px-2 py-1 rounded-lg">{t.p1_bold}</span> {t.p1}</p>
              <p>{t.p2} <span className="text-white border-b-2 border-red-600 pb-0.5">{t.p2_bold}</span>{t.p2_end}</p>
              <p>{t.p3}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pt-8 md:pt-10 border-t border-white/5 relative z-10">
               <div className="space-y-4 group">
                  <div className="flex items-center gap-3 text-white font-black uppercase text-xs tracking-widest group-hover:text-red-500 transition-colors"><Brain size={18} /> {t.adn}</div>
                  <ul className="space-y-2 text-sm text-slate-500 font-bold group-hover:text-slate-300 transition-colors">
                    <li>• Obsession ROI</li>
                    <li>• Viral Loops</li>
                    <li>• AI Native</li>
                  </ul>
               </div>
               <div className="space-y-4 group">
                  <div className="flex items-center gap-3 text-white font-black uppercase text-xs tracking-widest group-hover:text-red-500 transition-colors"><Target size={18} /> {t.sectors}</div>
                  <ul className="space-y-2 text-sm text-slate-500 font-bold group-hover:text-slate-300 transition-colors">
                    <li>• Gaming / E-sport</li>
                    <li>• SaaS & Tech</li>
                    <li>• Digital Products</li>
                  </ul>
               </div>
               <div className="space-y-4 group">
                  <div className="flex items-center gap-3 text-white font-black uppercase text-xs tracking-widest group-hover:text-red-500 transition-colors"><Workflow size={18} /> {t.method}</div>
                  <ul className="space-y-2 text-sm text-slate-500 font-bold group-hover:text-slate-300 transition-colors">
                    <li>• Data-Driven</li>
                    <li>• Fast-Execution</li>
                    <li>• Scale First</li>
                  </ul>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between h-32 md:h-40 group hover:border-red-600 transition-all duration-500 hover:bg-red-600/5">
                <Target className="text-slate-400 group-hover:text-red-500 transition-colors" size={28} />
                <div>
                  <p className="text-[9px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 group-hover:text-red-400">{t.target}</p>
                  <p className="text-white font-bold text-base md:text-lg leading-none">Growth / Marketing Ops</p>
                </div>
             </div>
             <div className="bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between h-32 md:h-40 group hover:border-red-600 transition-all duration-500 hover:bg-red-600/5">
                <Cpu className="text-slate-400 group-hover:text-red-500 transition-colors" size={28} />
                <div>
                  <p className="text-[9px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 group-hover:text-red-400">{t.env}</p>
                  <p className="text-white font-bold text-base md:text-lg leading-none">Scale-up / Tech</p>
                </div>
             </div>
          </div>
          
          <div className="overflow-hidden rounded-[2rem]">
             <TechStackTicker t={t} />
          </div>
        </div>
      </div>

      <div className="mt-20 flex justify-center border-t border-white/5 pt-10">
        <button onClick={() => navigateTo('home')} className="flex items-center gap-6 text-slate-500 hover:text-white font-black uppercase text-[10px] tracking-[0.8em] transition-all group active:scale-95">
          <ArrowRight className="rotate-180 group-hover:-translate-x-4 transition-transform duration-500" size={20} /> {t.back}
        </button>
      </div>
    </div>
  </div>
  );
});

// --- GAME STATE REDUCER ---
const initialGameState = {
  gameActive: false,
  showBriefing: true,
  score: 0,
  timeLeft: 15,
  targets: [],
  clickFeedbacks: [],
  multiplier: 1,
  combo: 0,
  panicMode: false,
  visualEvent: null,
  visualEventUntil: 0, // NEW: timestamp end
  multiplierExpiresAt: 0 // NEW: timestamp end
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'START_GAME':
      return { ...initialGameState, gameActive: true, showBriefing: false, timeLeft: 15 };
    case 'END_GAME':
      return { ...state, gameActive: false, panicMode: false, targets: [] };
    case 'UPDATE_TIME':
      return { ...state, timeLeft: typeof action.payload === 'function' ? action.payload(state.timeLeft) : action.payload };
    case 'SET_PANIC':
      return { ...state, panicMode: action.payload };
    case 'ADD_TARGET':
       return { ...state, targets: [...state.targets, action.payload] };
    case 'REMOVE_TARGET':
       return { ...state, targets: state.targets.filter(t => t.id !== action.payload) };
    
    // Updated Actions for No-Timeout Logic
    case 'SET_VISUAL_EVENT':
        // payload can be null OR object { type, until }
        if (!action.payload) return { ...state, visualEvent: null, visualEventUntil: 0 };
        return { ...state, visualEvent: action.payload.type, visualEventUntil: action.payload.until };
    
    case 'EXTEND_MULTIPLIER':
        // payload is new expiration timestamp
        return { ...state, multiplier: state.multiplier + 1, multiplierExpiresAt: action.payload };

    case 'RESET_MULTIPLIER':
        // Reset triggered by loop when time is up
        return { ...state, multiplier: Math.max(1, state.multiplier - 1), multiplierExpiresAt: 0 };

    case 'ADD_FEEDBACK':
        return { ...state, clickFeedbacks: [...state.clickFeedbacks, action.payload] };
    case 'REMOVE_FEEDBACK_BY_ID':
        return { ...state, clickFeedbacks: state.clickFeedbacks.filter(f => f.id !== action.payload) };
    case 'RETRY':
        return { ...initialGameState, showBriefing: true, score: 0 };
     
    // --- ATOMIC SCORE LOGIC ---
    case 'TARGET_HIT': {
        const { targetType, id, x, y, feedbackId } = action.payload;
        let newScore = state.score;
        let newTime = state.timeLeft;
        let newCombo = state.combo;
        let msg = "";
        let color = "text-emerald-400";

        // Logic based on state NOT closure
        switch(targetType) {
            case 'lead': 
                newScore += 500 * state.multiplier;
                msg = "+500 LEADS";
                newCombo += 1;
                break;
            case 'golden_rocket': 
                newScore += 15000 * state.multiplier;
                msg = "VIRALITÈ MAX!";
                color = "text-yellow-400";
                // Multiplier handled via EXTEND_MULTIPLIER action dispatched separately or here if merged
                break;
            case 'spam': 
                newScore -= 5000;
                msg = "BOTS DETECTED!";
                color = "text-red-500";
                newCombo = 0;
                break;
            case 'vip': 
                newScore += 30000 * state.multiplier;
                msg = "PARTENARIAT 👑";
                color = "text-purple-400";
                break;
            case 'bad_buzz': 
                newTime = Math.max(0, newTime - 3);
                msg = "BAD BUZZ!";
                color = "text-orange-600";
                newCombo = 0;
                break;
            case 'clock': 
                newTime += 1;
                msg = "CONTENT STREAK! +1s";
                color = "text-blue-400";
                break;
        }
        
        return {
            ...state,
            score: newScore,
            timeLeft: newTime,
            combo: newCombo,
            targets: state.targets.filter(t => t.id !== id),
            clickFeedbacks: [...state.clickFeedbacks, { id: feedbackId, x, y, msg, color }]
        };
    }

    default:
      return state;
  }
};

const GrowthLabGameComp = memo(({ navigateTo, playSound, profileImageUrl, openChat, onSpell, t }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const { gameActive, showBriefing, score, timeLeft, targets, clickFeedbacks, multiplier, combo, panicMode, visualEvent } = state;
    
  const lastFrameTime = useRef(0);
  const accumulator = useRef(0);
  const gameAreaRef = useRef(null);
  const visualUpdateRef = useRef(null);
  const isVisibleRef = useRef(false);
  
  // State Ref for Loop Access without re-creating loop
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const targetsPhysics = useRef([]);
  const targetElementsRef = useRef({}); 

  const idCounter = useRef(0);
  const generateId = () => {
    idCounter.current += 1;
    return idCounter.current;
  };
   
  const comboRef = useRef(combo);
  useEffect(() => {
    comboRef.current = combo;
  }, [combo]);

  // Visibility observer
  useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
          isVisibleRef.current = entry.isIntersecting;
      }, { threshold: 0.1 });
      
      if (gameAreaRef.current) {
          observer.observe(gameAreaRef.current);
      }
      return () => observer.disconnect();
  }, []);

  const scoreStyle = useMemo(() => ({
    transform: `scale(${1 + Math.min(combo * 0.1, 0.5)})`
  }), [combo]);

  // Remove feedbacks automatically
  useEffect(() => {
    if (clickFeedbacks.length > 0) {
        const idToRemove = clickFeedbacks[0].id;
        const timer = setTimeout(() => {
            dispatch({ type: 'REMOVE_FEEDBACK_BY_ID', payload: idToRemove });
        }, 800);
        return () => clearTimeout(timer);
    }
  }, [clickFeedbacks]);

  // GAME LOOP
  useEffect(() => {
    let animationFrame;
    const FIXED_STEP = 1000 / 60; 

    if (gameActive) {
      lastFrameTime.current = performance.now();
      accumulator.current = 0;
      
      const loop = (time) => {
        if (!isVisibleRef.current || document.hidden) {
            animationFrame = requestAnimationFrame(loop);
            lastFrameTime.current = time;
            return;
        }

        let deltaTime = time - lastFrameTime.current;
        lastFrameTime.current = time;
        if (deltaTime > 100) deltaTime = 100;

        accumulator.current += deltaTime;

        while (accumulator.current >= FIXED_STEP) {
            const { width, height } = visualUpdateRef.current || { width: 100, height: 100 };
            const now = Date.now();
            const dt = 1; 

            // Physics Update
            targetsPhysics.current.forEach(t => {
                t.x += t.vx * dt;
                t.y += t.vy * dt;
                if (t.x <= 0) { t.x = 0; t.vx = Math.abs(t.vx); }
                else if (t.x >= 100) { t.x = 100; t.vx = -Math.abs(t.vx); }
                if (t.y <= 0) { t.y = 0; t.vy = Math.abs(t.vy); }
                else if (t.y >= 100) { t.y = 100; t.vy = -Math.abs(t.vy); }

                // Target Expiration
                if (!t.processed && now > t.expiresAt) {
                    t.processed = true;
                    dispatch({ type: 'REMOVE_TARGET', payload: t.id });
                }
            });

            targetsPhysics.current = targetsPhysics.current.filter(t => !t.processed);

            // State Logic Expiration Checks (Visuals & Multiplier)
            const currentState = stateRef.current;
            
            // Check Visual Event Expiration
            if (currentState.visualEvent && now > currentState.visualEventUntil) {
                 dispatch({ type: 'SET_VISUAL_EVENT', payload: null });
            }

            // Check Multiplier Expiration
            if (currentState.multiplier > 1 && currentState.multiplierExpiresAt > 0 && now > currentState.multiplierExpiresAt) {
                 dispatch({ type: 'RESET_MULTIPLIER' });
            }

            accumulator.current -= FIXED_STEP;
        }

        const { width, height } = visualUpdateRef.current || { width: 1, height: 1 };
        targetsPhysics.current.forEach(t => {
             const el = targetElementsRef.current[t.id];
             if (el) {
                const deltaX = (t.x - t.initialX) / 100 * width;
                const deltaY = (t.y - t.initialY) / 100 * height;
                el.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
             }
        });
        
        animationFrame = requestAnimationFrame(loop);
      };
      
      if (gameAreaRef.current) {
         visualUpdateRef.current = {
            width: gameAreaRef.current.offsetWidth,
            height: gameAreaRef.current.offsetHeight
         };
      }

      animationFrame = requestAnimationFrame(loop);
    }
    
    return () => {
        cancelAnimationFrame(animationFrame);
    };
  }, [gameActive]); // Only restarts on game active toggle

  // Resize handler
  useEffect(() => {
    let resizeTimeout;
    const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (visualUpdateRef.current && gameAreaRef.current) {
                visualUpdateRef.current.width = gameAreaRef.current.offsetWidth;
                visualUpdateRef.current.height = gameAreaRef.current.offsetHeight;
            }
        }, 200);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // SPAWN LOGIC
  useEffect(() => {
    let spawnInterval;
    if (gameActive) {
      spawnInterval = setInterval(() => {
        if (targetsPhysics.current.length >= 8) return;
        if (!isVisibleRef.current || document.hidden) return;

        const id = generateId();
        const rand = Math.random();
        let type = 'lead';
        
        if (rand < 0.08) type = 'golden_rocket';
        else if (rand < 0.30) type = 'spam'; 
        else if (rand < 0.35) type = 'vip';
        else if (rand < 0.45) type = 'bad_buzz';
        else if (rand < 0.47) type = 'clock'; 
        
        const isMobile = window.innerWidth < 768;
        const baseSpeed = isMobile ? 0.3 : 0.6; 
        const speedFactor = baseSpeed;

        const startX = Math.random() * 80 + 10;
        const startY = Math.random() * 70 + 15;
        
        let vx = (Math.random() - 0.5) * 2;
        let vy = (Math.random() - 0.5) * 2;
        if (Math.abs(vx) < 0.2) vx = 0.5;
        if (Math.abs(vy) < 0.2) vy = 0.5;

        const lifetime = 1500;
        const expiresAt = Date.now() + lifetime;

        const newTarget = { 
            id, x: startX, y: startY, initialX: startX, initialY: startY,
            type, vx: vx * speedFactor, vy: vy * speedFactor,
            expiresAt, processed: false 
        };

        targetsPhysics.current.push(newTarget);
        dispatch({ type: 'ADD_TARGET', payload: { id, type, initialX: startX, initialY: startY } });

      }, panicMode ? 150 : 280); 
    }
    return () => clearInterval(spawnInterval);
  }, [gameActive, panicMode]);

  // Timer logic
  useEffect(() => {
    let timer;
    if (gameActive) {
      timer = setInterval(() => {
        if (isVisibleRef.current && !document.hidden) {
            dispatch({ type: 'UPDATE_TIME', payload: prev => prev <= 0 ? 0 : prev - 1 });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameActive]);

  // End Game & Panic logic
  useEffect(() => {
      if (gameActive && timeLeft <= 6 && timeLeft > 0 && !panicMode) {
          dispatch({ type: 'SET_PANIC', payload: true });
          playSound(200, 'square', 0.1);
      }
      if (timeLeft === 0 && gameActive) {
          dispatch({ type: 'END_GAME' });
          playSound(60, 'sawtooth', 0.8);
          targetsPhysics.current = [];
          if (score > 150000) onSpell('highscore');
      }
  }, [timeLeft, gameActive, panicMode, playSound, score, onSpell]);

  // Events logic (Replaced setTimeout with visualEventUntil)
  useEffect(() => {
    let eventInterval;
    if (gameActive) {
        eventInterval = setInterval(() => {
            if (!isVisibleRef.current) return;
            const rand = Math.random();
            if (rand < 0.15) {
                // Trigger Crash
                dispatch({ type: 'SET_VISUAL_EVENT', payload: { type: 'crash', until: Date.now() + 500 } });
                playSound(100, 'sawtooth', 0.5);
            } else if (rand > 0.85) {
                // Trigger Hype
                dispatch({ type: 'SET_VISUAL_EVENT', payload: { type: 'hype', until: Date.now() + 500 } });
                playSound(1200, 'square', 0.5);
            }
        }, 4000);
    }
    return () => clearInterval(eventInterval);
  }, [gameActive, playSound]);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
    targetsPhysics.current = [];
    playSound(440, 'sine', 0.3);
  }, [playSound]);

  const handleTargetClick = useCallback((e, type, id) => { 
    const targetIndex = targetsPhysics.current.findIndex(t => t.id === id);
    if (targetIndex === -1) return;

    const targetPhys = targetsPhysics.current[targetIndex];
    if (targetPhys.processed) return;

    targetPhys.processed = true;

    let currentX = targetPhys.x;
    let currentY = targetPhys.y;
    
    const feedbackId = generateId();
    dispatch({ type: 'TARGET_HIT', payload: { targetType: type, id, x: currentX, y: currentY, feedbackId } });

    const currentCombo = comboRef.current;

    switch(type) {
      case 'lead': playSound(880 + (currentCombo * 20)); break;
      case 'golden_rocket': 
        playSound(1300, 'square'); 
        // Trigger multiplier extension (no setTimeout)
        dispatch({ type: 'EXTEND_MULTIPLIER', payload: Date.now() + 5000 });
        break;
      case 'spam': playSound(100, 'sawtooth'); break;
      case 'vip': playSound(1800, 'triangle'); break;
      case 'bad_buzz': playSound(60, 'sawtooth'); break;
      case 'clock': playSound(1200); break;
    }

    targetsPhysics.current.splice(targetIndex, 1);
    delete targetElementsRef.current[id];
  }, [playSound]);

  return (
    <div className="pt-24 md:pt-40 pb-24 md:pb-40 px-6 font-black animate-reveal min-h-screen relative flex flex-col items-center justify-start overflow-hidden">
        {/* Background static léger */}
        <div className="absolute inset-0 bg-[#020202] -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.05)_0%,transparent_100%)] -z-10" />
        
        <div className="max-w-6xl w-full space-y-8 md:space-y-12 relative z-10 py-6 md:py-10 font-black">
            {/* Header Jeu */}
            <div className="text-center space-y-4 md:space-y-6 mb-8 md:mb-12">
                <h2 className="text-4xl md:text-6xl lg:text-[100px] font-black text-white tracking-tighter uppercase italic leading-[0.9] md:leading-[0.8] animate-float leading-none">{t.title} <br/><span className="text-red-600 cursor-pointer hover:text-white transition-colors" onClick={() => onSpell('wingardium')}>{t.title_sub}</span></h2>
            </div>

            {/* Zone de Jeu */}
            <div className={`relative bg-[#050505] border-2 rounded-[3rem] md:rounded-[4rem] p-6 md:p-16 shadow-3xl transition-all duration-1000 border-white/10 w-full mx-auto ${gameActive ? 'border-red-600/40' : ''} ${panicMode ? 'animate-stress' : ''} ${visualEvent === 'crash' ? 'animate-shake' : ''}`}>
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center mb-8 md:mb-12 gap-6 md:gap-8">
                    {/* Scoreboard haut */}
                    <div className="text-center lg:text-left space-y-4">
                        <div className="flex gap-3 justify-center lg:justify-start items-center">
                            <div className="bg-white/[0.03] border border-white/10 px-4 md:px-5 py-2 md:py-3 rounded-2xl inline-block backdrop-blur-md">
                                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-3"><Star size={14} className="text-yellow-500" /> Combo: <span className="text-white">x{combo}</span></p>
                            </div>
                            {multiplier > 1 && <div className="bg-yellow-500 text-black px-4 md:px-5 py-2 md:py-3 rounded-2xl animate-bounce shadow-glow-yellow font-black uppercase text-[9px] md:text-[10px] tracking-widest italic leading-none">HYPE x{multiplier}</div>}
                        </div>
                    </div>
                    {gameActive && (
                    <div className="flex gap-4 md:gap-6 animate-slide-in-right">
                        <div className={`px-6 py-4 md:px-10 md:py-6 rounded-3xl border transition-all duration-500 ${timeLeft < 5 ? 'bg-red-600 text-white shadow-glow-red scale-110' : 'bg-white/5 border-white/10 text-white shadow-3xl'}`}>
                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] opacity-60">{t.timer}</p>
                        <p className="text-2xl md:text-4xl font-black tabular-nums leading-none mt-1 md:mt-2">{timeLeft}s</p>
                        </div>
                        <div className="px-6 py-4 md:px-10 md:py-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-3xl min-w-[160px] md:min-w-[240px]">
                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] opacity-60 text-nowrap">{t.eng}</p>
                        <p className="text-2xl md:text-4xl font-black tabular-nums leading-none mt-1 md:mt-2 transition-all duration-200" style={scoreStyle}>{formatScore(score)}</p>
                        </div>
                    </div>
                    )}
                </div>
                
                {/* Game Area Container */}
                <div ref={gameAreaRef} className={`relative w-full max-w-5xl mx-auto aspect-none md:aspect-[16/8] h-[60vh] md:h-auto bg-[#020202] rounded-[2rem] md:rounded-[3rem] border border-white/10 overflow-hidden group cursor-crosshair transition-all duration-1000 ${gameActive ? 'ring-4 md:ring-8 ring-red-600/5' : ''}`}>
                    {visualEvent === 'crash' && <div className="absolute inset-0 bg-red-600/20 z-0 animate-pulse pointer-events-none" />}
                    {visualEvent === 'hype' && <div className="absolute inset-0 bg-yellow-500/20 z-0 animate-pulse pointer-events-none" />}
                    
                    {!gameActive ? (
                    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[#050505] p-6 text-center">
                        {showBriefing ? (
                            <div className="animate-reveal space-y-6 md:space-y-8 w-full max-w-3xl mx-auto flex flex-col items-center p-6 md:p-8 bg-[#0a0a0a] border border-white/10 rounded-[2rem] md:rounded-[3rem] shadow-2xl">
                                <h3 className="text-white font-black text-2xl md:text-4xl uppercase italic tracking-tighter">{t.brief}</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full">
                                    <div className="flex flex-col items-center gap-2 p-3 md:p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="w-8 h-8 md:w-12 md:h-12"><GameAssets.Lead /></div>
                                        <p className="text-white font-bold uppercase text-[10px] md:text-xs">{t.brief_client}</p>
                                        <p className="text-slate-400 text-[9px] md:text-[10px]">+500 Pts</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-3 md:p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="w-8 h-8 md:w-12 md:h-12"><GameAssets.GoldenRocket /></div>
                                        <p className="text-white font-bold uppercase text-[10px] md:text-xs">{t.brief_viral}</p>
                                        <p className="text-slate-400 text-[9px] md:text-[10px]">+15K Pts</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-3 md:p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="w-8 h-8 md:w-12 md:h-12"><GameAssets.Partner /></div>
                                        <p className="text-white font-bold uppercase text-[10px] md:text-xs">{t.brief_partner}</p>
                                        <p className="text-slate-400 text-[9px] md:text-[10px]">+30K Pts</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-3 md:p-4 bg-red-900/20 rounded-2xl border border-red-500/20">
                                        <div className="w-8 h-8 md:w-12 md:h-12"><GameAssets.Bot /></div>
                                        <p className="text-red-500 font-bold uppercase text-[10px] md:text-xs">{t.brief_bots}</p>
                                        <p className="text-red-400/60 text-[9px] md:text-[10px]">-5K Pts</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-3 md:p-4 bg-red-900/20 rounded-2xl border border-red-500/20">
                                        <div className="w-8 h-8 md:w-12 md:h-12"><GameAssets.BadBuzz /></div>
                                        <p className="text-orange-500 font-bold uppercase text-[10px] md:text-xs">{t.brief_bad}</p>
                                        <p className="text-orange-400/60 text-[9px] md:text-[10px]">-3 Sec</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-3 md:p-4 bg-blue-900/20 rounded-2xl border border-blue-500/20">
                                        <div className="w-8 h-8 md:w-12 md:h-12"><GameAssets.Streak /></div>
                                        <p className="text-blue-400 font-bold uppercase text-[10px] md:text-xs">{t.brief_streak}</p>
                                        <p className="text-blue-300/60 text-[9px] md:text-[10px]">+1 Sec</p>
                                    </div>
                                </div>
                                <button onClick={startGame} className="bg-red-600 text-white px-10 py-4 md:px-12 md:py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-glow-red active:scale-95 text-xs md:text-sm">{t.btn_start}</button>
                            </div>
                        ) : timeLeft === 0 ? (
                        <div className="animate-reveal space-y-6 md:space-y-8 w-full max-w-4xl mx-auto flex flex-col items-center font-black">
                            <h3 className="text-white font-black text-3xl md:text-7xl uppercase italic tracking-tighter leading-none">{t.score_title}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-3xl items-stretch">
                            <div className="flex flex-col p-6 bg-gradient-to-br from-red-600 to-red-900 border border-white/20 rounded-[2rem] md:rounded-[2.5rem] shadow-glow-red text-left">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-xl border-2 border-white/30 overflow-hidden"><img src={profileImageUrl} className="w-full h-full object-cover" alt="Lucien Lukes Freelance Marketing Montpellier" /></div>
                                    <p className="text-white text-base font-black uppercase tracking-tighter italic leading-none">Lucien Lukes</p>
                                </div>
                                <div className="mt-auto">
                                <p className="text-white/40 text-[8px] font-black uppercase tracking-[0.4em]">{t.record}</p>
                                <p className="text-white text-3xl md:text-5xl font-black tracking-tighter leading-none">20.5M</p>
                                </div>
                            </div>
                            <div className="flex flex-col p-6 bg-white/[0.03] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] shadow-3xl text-left">
                                <div className="flex items-center gap-4 mb-4"><div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500"><User size={20} /></div><p className="text-white text-base font-black uppercase tracking-tighter italic leading-none">{t.you}</p></div>
                                <div className="mt-auto"><p className="text-slate-600 text-[8px] font-black uppercase tracking-[0.4em]">{t.score}</p><p className="text-red-500 text-3xl md:text-5xl font-black tracking-tighter leading-none">{formatScore(score)}</p></div>
                            </div>
                            </div>
                            <div className="pt-4 space-y-6 w-full flex flex-col items-center">
                                <div className="bg-red-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-[2rem] font-black uppercase text-[10px] md:text-xs tracking-tight shadow-glow-red italic animate-bounce inline-block">"{t.taunt}"</div>
                                <div className="flex gap-4 justify-center w-full">
                                    <button onClick={() => { dispatch({ type: 'RETRY' }); }} className="bg-white text-black font-black uppercase text-[9px] tracking-[0.5em] py-4 px-6 md:py-5 md:px-8 rounded-2xl hover:bg-red-600 hover:text-white transition-all flex-1 max-w-[150px] active:scale-95">{t.retry}</button>
                                    <button onClick={openChat} className="bg-red-600 text-white font-black uppercase text-[9px] tracking-[0.5em] py-4 px-6 md:py-5 md:px-8 rounded-2xl hover:bg-white hover:text-black transition-all flex-1 max-w-[150px] active:scale-95">{t.contact}</button>
                                </div>
                            </div>
                        </div>
                        ) : null}
                    </div>
                    ) : (
                    <>
                        {clickFeedbacks.map(f => <div key={f.id} style={{ left: `${f.x}%`, top: `${f.y}%` }} className={`absolute pointer-events-none font-black text-xl md:text-3xl uppercase animate-float-out z-50 ${f.color} drop-shadow-[0_0_10px_rgba(0,0,0,1)] will-change-transform`}>{f.msg}</div>)}
                        {targets.map(t => {
                            const AssetComponent = t.type === 'lead' ? GameAssets.Lead : 
                                                   t.type === 'golden_rocket' ? GameAssets.GoldenRocket : 
                                                   t.type === 'spam' ? GameAssets.Bot : 
                                                   t.type === 'vip' ? GameAssets.Partner : 
                                                   t.type === 'bad_buzz' ? GameAssets.BadBuzz : 
                                                   GameAssets.Streak;
                            return (
                            <div 
                                key={t.id} 
                                ref={el => { 
                                    if(el) targetElementsRef.current[t.id] = el;
                                    else delete targetElementsRef.current[t.id]; // Correct cleanup
                                }}
                                onClick={(e) => { e.stopPropagation(); handleTargetClick(e, t.type, t.id); }} 
                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-4 md:p-6 rounded-full cursor-pointer z-10 flex items-center justify-center will-change-pos w-16 h-16 md:w-24 md:h-24 will-change-transform`}
                                style={{ left: `${t.initialX}%`, top: `${t.initialY}%`, transform: 'translate3d(0,0,0)' }} 
                            >
                                <AssetComponent />
                            </div>
                            );
                        })}
                    </>
                    )}
                </div>
            </div>

            {/* Explications Jeu */}
            <div className="w-full max-w-5xl mx-auto mt-12 mb-12 p-8 md:p-12 bg-[#0a0a0a] border border-white/10 rounded-[2rem] relative overflow-hidden animate-reveal">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(closest-side,rgba(220,38,38,0.1),transparent)] pointer-events-none"></div>
                <div className="relative z-10 space-y-10">
                    <div className="flex items-center gap-4">
                        <Brain className="text-red-600 w-8 h-8 md:w-10 md:h-10" />
                        <h3 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter">{t.logic_title}</h3>
                    </div>
                    <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed italic border-l-4 border-red-600/50 pl-6">"{t.logic_intro}"</p>
                    <div className="space-y-8">
                        {/* Logic points (inchangés, juste structure) */}
                        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start group">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all shadow-xl"><Clock size={28} /></div>
                            <div className="space-y-2">
                                <h4 className="text-white font-black uppercase text-lg tracking-wider">{t.logic_p1_title}</h4>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed">{t.logic_p1_desc}</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start group">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl"><Target size={28} /></div>
                            <div className="space-y-2">
                                <h4 className="text-white font-black uppercase text-lg tracking-wider">{t.logic_p2_title}</h4>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed">{t.logic_p2_desc}</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start group">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-yellow-400 group-hover:bg-yellow-500 group-hover:text-black transition-all shadow-xl"><Zap size={28} /></div>
                            <div className="space-y-2">
                                <h4 className="text-white font-black uppercase text-lg tracking-wider">{t.logic_p3_title}</h4>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed">{t.logic_p3_desc}</p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/10 mt-4">
                        <p className="text-white text-base md:text-lg font-medium leading-relaxed">
                            <span className="text-red-500 font-black uppercase tracking-wider mr-2">{t.logic_conc_title}</span>
                            {t.logic_conc_desc}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-8">
                <button onClick={() => navigateTo('home')} className="flex items-center gap-6 text-slate-500 hover:text-white font-black uppercase text-[10px] tracking-[0.8em] transition-all group active:scale-95"><ArrowRight className="rotate-180 group-hover:-translate-x-4 transition-transform duration-500" size={20} /> {t.back}</button>
            </div>
        </div>
    </div>
  );
});

// SIMULATION CODE SPLITTING
// Wrapper simple sans Suspense (single file)
const GameWrapper = memo(({ active, ...props }) => {
    if (!active) return null;
    return <GrowthLabGameComp {...props} />;
});

const MainContent = memo(({ view, profileImageUrl, t, experiences, stackData, testimonials, navigateTo, openChat, playSound, handleDownload, triggerSpell, openModal, copyDiscord, copyFeedback, sayHello }) => {
    return (
        <main className="animate-reveal app-content paused-when-modal">
        {view === 'home' && (
          <>
            <HeroSection 
                openChat={openChat} 
                playSound={playSound} 
                profileImageUrl={profileImageUrl} 
                t={t.hero} 
                handleDownload={handleDownload} 
                triggerLongPress={() => triggerSpell('longpress')}
            />
            <TrustStrip lang={'fr'} t={t.trust} />
            
            <section className="py-12 md:py-24 px-6 text-left relative cv-section paused-when-modal">
              <div className="max-w-7xl mx-auto space-y-16 md:space-y-32">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 md:gap-10">
                  <div className="space-y-3 md:space-y-4">
                    <p className="text-red-500 uppercase text-[10px] md:text-[11px] tracking-[0.8em]">{t.stack.title_sub}</p>
                    <h2 className="text-5xl md:text-7xl lg:text-[100px] font-black text-white tracking-tighter uppercase leading-[0.9] md:leading-[0.8] italic opacity-95">{t.stack.title}</h2>
                  </div>
                  <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] max-w-[240px] text-right border-r-2 border-red-600 pr-4 md:pr-6">{t.stack.desc}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                  {stackData.map((skill, i) => (
                    <div key={skill.name} onClick={() => openModal('skill', skill)} className={`group/skill p-8 md:p-12 rounded-[4rem] md:rounded-[5rem] border border-white/5 bg-slate-900/40 hover:bg-red-600 hover:border-red-600 transition-colors duration-300 cursor-pointer flex flex-col gap-8 md:gap-12 animate-reveal shadow-2xl transform-gpu will-change-transform`}>
                      <div className="w-fit p-6 md:p-7 rounded-[2rem] bg-black text-red-500 group-hover:bg-white group-hover:text-red-600 transition-colors duration-300 shadow-xl font-black"><skill.icon size={32} className="md:w-10 md:h-10" /></div>
                      <div className="space-y-3 md:space-y-4">
                        <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-red-500/80 group-hover:text-white/80 font-black`}>{skill.category}</p>
                        <h4 className={`text-3xl md:text-4xl font-black uppercase tracking-tight leading-none text-slate-100 group-hover:text-white`}>{skill.name}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <Experiences experiences={experiences} onSpell={triggerSpell} t={t.exp} />

            <section className="py-24 md:py-48 px-6 bg-[#020202] font-black relative cv-section paused-when-modal">
               <div className="max-w-6xl mx-auto text-center">
                  <div className="mb-20 md:mb-32 space-y-4 md:space-y-6"><p className="text-red-500 uppercase text-[10px] md:text-[11px] tracking-[1em]">{t.cursus.sub}</p><h3 className="text-5xl md:text-7xl lg:text-[90px] font-black text-white uppercase tracking-tighter italic opacity-95 leading-none">{t.cursus.title}</h3></div>
                  <CursusSectionComp t={t.cursus} />
               </div>
            </section>

            <TestimonialsSection testimonials={testimonials} t={t.testi} />

            <footer className="py-24 md:py-40 px-6 border-t border-white/5 bg-black text-center font-black relative overflow-hidden">
              <div className="max-w-4xl mx-auto space-y-12 md:space-y-20">
                <button onClick={openChat} className="px-12 py-6 md:px-20 md:py-10 bg-red-600 text-white rounded-[2rem] md:rounded-[3rem] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] shadow-glow-red hover:bg-white hover:text-black transition-all active:scale-95 shadow-3xl text-xs md:text-sm">{t.footer.btn}</button>
                <div className="pt-16 md:pt-24 space-y-6">
                    <div className="flex justify-center gap-8 md:gap-10">
                        <a href="https://www.linkedin.com/in/lucien-lukes-1b1a84193/" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-white transition-colors"><Linkedin size={20} className="md:w-6 md:h-6" /></a>
                        <button className="text-slate-600 hover:text-white transition-colors cursor-pointer"><Mail size={20} className="md:w-6 md:h-6" /></button>
                    </div>
                    <p className="text-slate-800 font-black uppercase text-[9px] md:text-[11px] tracking-[1.5em] md:tracking-[2em] opacity-40">{t.footer.copyright}</p>
                </div>
              </div>
            </footer>
          </>
        )}

        {view === 'bio' && (
          <SectionBio profileImageUrl={profileImageUrl} navigateTo={navigateTo} copyDiscord={copyDiscord} copyFeedback={copyFeedback} playSound={playSound} onSpell={triggerSpell} t={t.bio} handleDownload={handleDownload} sayHello={sayHello} />
        )}

        {view === 'play' && (
             <GameWrapper active={view === 'play'} navigateTo={navigateTo} playSound={playSound} profileImageUrl={profileImageUrl} openChat={openChat} onSpell={triggerSpell} t={t.game} />
        )}
        </main>
    );
});

const App = () => {
  const [view, setView] = useState('home'); 
  const [modalType, setModalType] = useState(null); 
  const [selectedData, setSelectedData] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeSpell, setActiveSpell] = useState(null);
  const [lang, setLang] = useState('fr');
  const [isMuted, setIsMuted] = useState(false);
  
  const [foundSecrets, setFoundSecrets] = useState([]);
  const timerRef = useRef([]);

  useGlobalStyles(); // Injection unique des styles

  // PERFORMANCE: Toggle class 'form-open' on body
  // Optimisation: utilise une classe moins invasive pour le CSS
  useEffect(() => {
    if (isChatOpen || !!modalType) {
      document.body.classList.add('form-open');
    } else {
      document.body.classList.remove('form-open');
    }
    
    return () => {
        document.body.classList.remove('form-open');
    }
  }, [isChatOpen, modalType]);

  // Cleanup timers on unmount
  useEffect(() => {
      return () => {
          timerRef.current.forEach(clearTimeout);
      };
  }, []);

  useEffect(() => {
    let keys = [];
    const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    const handler = (e) => {
        keys.push(e.key);
        keys = keys.slice(-10);
        if (JSON.stringify(keys) === JSON.stringify(konami)) {
            triggerSpell('konami');
        }
    };
    
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const profileImageUrl = "https://res.cloudinary.com/dex721lje/image/upload/f_auto,q_auto,w_800/v1740686437/photo_de_profil_kvhg3h.png"; 

  const t = useMemo(() => TEXTS[lang], [lang]);
  const experiences = useMemo(() => getExperiences(lang), [lang]);
  const stackData = useMemo(() => getStack(lang), [lang]);
  const testimonials = useMemo(() => getTestimonials(lang), [lang]);

  const playSound = useCallback((freq, type = 'sine', duration = 0.1) => {
    if (isMuted) return;
    try {
      const ctx = audioSystem.get();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
      osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
      }
    } catch (e) {}
  }, [isMuted]);

  const navigateTo = useCallback((newView) => {
    setView(newView);
    // Defer scrollTo to next frame to prevent layout thrashing
    requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }, []);

  const triggerSpell = useCallback((spellType) => {
    setFoundSecrets(prev => {
        if (prev.includes(spellType)) return prev;

        let spellData = { type: spellType, text: '' };
        if (spellType === 'lumos') {
        playSound(1200, 'sine', 0.5);
        spellData.text = "J'ai fondé PoudlardRP très jeune, sans expérience et mon jeu fait avec passion s'est retrouvé sur le devant de la scène sur un live de 30 000 personnes juste avec une campagne de mailing. Une preuve vivante que la stratégie bat le budget.";
        } else if (spellType === 'alohomora') {
        playSound(800, 'triangle', 0.5);
        spellData.text = "J'ai passé mon bac en candidat libre après avoir arrêté les cours et j'ai finis par un master en marketing digital.";
        } else if (spellType === 'wingardium') {
        playSound(600, 'square', 0.5);
        spellData.text = "Lors d'un lancement, notre serveur a crashé sous la pression. Panique à bord ? Non. J'ai tweeté 'Nos serveurs sont en PLS, vous êtes trop chauds'. Le tweet est parti viral, transformant un bug technique en record historique de connexion à la réouverture.";
        } else if (spellType === 'konami') {
            playSound(1500, 'sawtooth', 0.8);
            spellData.text = "KONAMI CODE ACTIVATED! Vous avez débloqué l'accès développeur secret (fictif, mais bravo pour la ref).";
        } else if (spellType === 'longpress') {
            playSound(400, 'sine', 1);
            spellData.text = "Vous avez trouvé le secret de la persévérance. Parfois, il suffit de tenir bon pour voir le résultat.";
        } else if (spellType === 'highscore') {
            playSound(800, 'square', 1);
            spellData.text = "Score incroyable ! Vous avez l'étoffe d'un Growth Hacker.";
        }
        
        if (spellData.text) {
            setActiveSpell(spellData);
        }

        return [...prev, spellType];
    });
  }, [playSound]);

  const openModal = useCallback((type, data) => {
    setSelectedData(data);
    setModalType(type);
    playSound(600);
  }, [playSound]);

  const closeModal = useCallback(() => {
    setModalType(null);
    setSelectedData(null);
  }, []);

  const openChat = useCallback(() => {
      setIsChatOpen(true);
  }, []);

  const showToast = useCallback((msg) => {
      setToast(msg);
      const id = setTimeout(() => setToast(null), 3000);
      timerRef.current.push(id);
  }, []);

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
          document.execCommand('copy');
          document.body.removeChild(textArea);
          return true;
      } catch (e) {
          document.body.removeChild(textArea);
          return false;
      }
    }
  }, []);

  const copyDiscord = useCallback(async () => {
    const success = await copyToClipboard('MrLegya');
    if (success) {
      setCopyFeedback(true);
      showToast(t.toast.discord_copied);
      playSound(600);
      const id = setTimeout(() => setCopyFeedback(false), 2000);
      timerRef.current.push(id);
    }
  }, [playSound, t, showToast, copyToClipboard]);

  const copyEmail = useCallback(async () => {
      const success = await copyToClipboard('l.lukes@outlook.fr');
      if (success) {
          showToast(t.toast.email_copied);
          playSound(600);
      }
  }, [playSound, t, showToast, copyToClipboard]);

  const sayHello = useCallback(() => {
      playSound(1000, 'sine', 0.2); // Greeting sound
      showToast(t.bio.hello);
  }, [playSound, t, showToast]);

  useEffect(() => {
    document.title = "Lucien Lukes - Portfolio";
    
    const setFavicon = () => {
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/svg+xml';
      link.rel = 'shortcut icon';
      link.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><defs><linearGradient id=%22grad%22 x1=%220%25%22 y1=%22100%25%22 x2=%22100%25%22 y2=%220%25%22><stop offset=%220%25%22 stop-color=%22%23dc2626%22/><stop offset=%2250%25%22 stop-color=%22%23ef4444%22/><stop offset=%22100%25%22 stop-color=%22%23f97316%22/></linearGradient></defs><rect width=%22100%22 height=%22100%22 rx=%2230%22 fill=%22url(%23grad)%22/><text x=%2250%25%22 y=%2255%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22white%22 font-family=%22sans-serif%22 font-weight=%22900%22 font-size=%2245%22>LL</text></svg>`;
      document.head.appendChild(link);
    };
    setFavicon();
  }, []);

  const handleDownload = useCallback(() => {
    playSound(400);
    const link = document.createElement('a');
    link.href = '/Lucien_Lukes_CV.pdf'; 
    link.download = 'Lucien_Lukes_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [playSound]);

  const toggleMute = useCallback(() => {
      setIsMuted(prev => !prev);
  }, []);

  if (!t) return null;

  return (
    <div className={`min-h-screen bg-[#020202] text-slate-300 font-sans selection:bg-red-600 selection:text-white overflow-x-hidden font-black`}>
      <div className="fixed inset-0 pointer-events-none -z-50 bg-[#020202]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.05),transparent_60%)]" />
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <QuestTracker found={foundSecrets} t={t.quest} />

      {activeSpell && (
        <div className="fixed inset-0 z-[1000] bg-black/95 flex flex-col items-center justify-center p-8 text-center animate-reveal cursor-pointer" onClick={() => setActiveSpell(null)}>
            <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,${activeSpell.type === 'lumos' ? 'rgba(255,255,255,0.1)' : activeSpell.type === 'alohomora' ? 'rgba(251,191,36,0.1)' : 'rgba(147,51,234,0.1)'}_0%,transparent_70%)] animate-pulse pointer-events-none`} />
            <Wand2 size={64} className={`${activeSpell.type === 'lumos' ? 'text-white' : activeSpell.type === 'alohomora' ? 'text-amber-400' : 'text-purple-500'} mb-6 animate-bounce shadow-glow-white pointer-events-none`} />
            <h2 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-4 animate-lumos-text pointer-events-none" style={{textShadow: '0 0 30px rgba(255,255,255,0.8)'}}>
              {activeSpell.type === 'lumos' ? 'Lumos Maxima' : activeSpell.type === 'alohomora' ? 'Alohomora' : activeSpell.type === 'konami' ? 'KONAMI CODE' : activeSpell.type === 'longpress' ? 'TIME WARP' : activeSpell.type === 'highscore' ? 'GROWTH HACKER' : 'Wingardium Leviosa'}
            </h2>
            <p className={`${activeSpell.type === 'lumos' ? 'text-white' : activeSpell.type === 'alohomora' ? 'text-amber-500' : 'text-purple-500'} font-black uppercase tracking-[0.5em] text-xs mb-8 pointer-events-none`}>✨ Easter Egg Découvert ✨</p>
            <div className="max-w-2xl bg-white/5 border border-white/10 p-8 rounded-[2rem] relative overflow-hidden pointer-events-none">
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${activeSpell.type === 'lumos' ? 'from-white via-slate-400 to-slate-600' : activeSpell.type === 'alohomora' ? 'from-amber-400 via-orange-500 to-red-600' : 'from-purple-400 via-indigo-500 to-blue-600'}`} />
                <p className="text-white text-lg md:text-xl font-medium leading-relaxed italic">
                  "{activeSpell.text}"
                </p>
            </div>
            <p className="mt-8 text-slate-600 text-xs uppercase tracking-widest animate-pulse pointer-events-none">Click anywhere to close</p>
        </div>
      )}

      <div className="sr-only">
        <h1>Lucien Lukes - Freelance Marketing Montpellier & Consultant Influence France</h1>
        <h2>Spécialiste Growth Architecture, SEO, SEM et Acquisition Payante multicanale.</h2>
        <p>Expert en management de créateurs de contenu et scaling infrastructure.</p>
      </div>

      <Navbar view={view} navigateTo={navigateTo} openChat={openChat} t={t.nav} isMuted={isMuted} toggleMute={toggleMute} />

      <MainContent 
        view={view}
        profileImageUrl={profileImageUrl}
        t={t}
        experiences={experiences}
        stackData={stackData}
        testimonials={testimonials}
        navigateTo={navigateTo}
        openChat={openChat}
        playSound={playSound}
        handleDownload={handleDownload}
        triggerSpell={triggerSpell}
        openModal={openModal}
        copyDiscord={copyDiscord}
        copyFeedback={copyFeedback}
        sayHello={sayHello}
      />

      <Modal isOpen={!!modalType} onClose={closeModal}>
        {modalType === 'skill' && selectedData && (
          <div className="animate-reveal">
            <div className="flex items-center gap-8 md:gap-10 mb-10 md:mb-14 flex-col md:flex-row text-center md:text-left">
              <div className="p-8 md:p-10 bg-red-600 rounded-[2.5rem] md:rounded-[3rem] text-white shadow-glow-red">
                {selectedData?.icon && React.createElement(selectedData.icon, { size: 40, className: "md:w-12 md:h-12" })}
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9] md:leading-[0.8] break-words hyphens-auto">{selectedData.name}</h3>
            </div>
            <div className="space-y-10 md:space-y-12">
              <div className="p-8 md:p-10 bg-white/[0.03] rounded-[2.5rem] md:rounded-[3.5rem] border-l-4 md:border-l-8 border-red-600 text-left">
                  <p className="text-red-500 font-black uppercase text-[10px] md:text-[11px] tracking-[0.4em] mb-3 md:mb-4">{t.modal.strat}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl text-slate-100 font-light italic leading-tight">"{selectedData.simple}"</p>
              </div>
              
              {selectedData.extraInfo && (
                <div className="p-6 bg-blue-900/20 border border-blue-500/20 rounded-[2rem] text-center">
                    <p className="text-blue-400 font-bold uppercase text-xs tracking-widest">{selectedData.extraInfo}</p>
                </div>
              )}

              <div className="space-y-6 md:space-y-8 px-2 md:px-4 text-left font-black">
                  <p className="text-[10px] md:text-[11px] font-black uppercase text-slate-500 tracking-[0.5em]">{t.modal.ops}</p>
                  <div className="grid grid-cols-1 gap-5 md:gap-6">
                    {selectedData.actions?.map(a => (
                      <div key={a} className="flex items-center gap-5 md:gap-6 text-lg md:text-xl font-black uppercase text-white/80"><div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-red-600 shadow-glow-red" />{a}</div>
                    ))}
                  </div>
              </div>
              <button onClick={() => { closeModal(); openChat(); }} className="w-full bg-white text-black font-black py-6 md:py-8 rounded-[2rem] md:rounded-[2.5rem] uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-red-600 hover:text-white transition-all active:scale-95 border-2 border-transparent">{t.modal.btn}</button>
            </div>
          </div>
        )}
      </Modal>

      {isChatOpen && <CollaborationForm onClose={() => setIsChatOpen(false)} playSound={playSound} t={t.form} stackData={stackData} questCompleted={foundSecrets.length >= 4} />}
    </div>
  );
};

export default App;