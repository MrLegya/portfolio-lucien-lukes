import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { 
  Rocket, Users, Target, Mail, Gamepad2, Zap, ArrowRight,
  Search, Share2, MessageCircle, Cpu, Layers, 
  Sparkles, Award, X, Send, CheckCircle, 
  ChevronRight, ShieldCheck, Globe2, Lock, 
  ExternalLink, Wand2, Star, Trophy, GraduationCap, 
  School, Coins, Activity, Flame, Crown, 
  Download, User, ZapOff, 
  MapPin, ChevronDown, Sparkle, Brain, Focus, Workflow,
  Linkedin, Github, Briefcase as Job, Megaphone, Compass, Menu, Hash, Clock
} from 'lucide-react';

// --- CONFIGURATION SYSTÈME SONORE ---
const audioSystem = {
  ctx: null,
  get() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    return this.ctx;
  }
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
      title: "Fondations.",
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
      loc: "Montpellier / Remote"
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
      cdi: "CDI / Long Terme",
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
      close: "Fermer"
    },
    modal: {
      strat: "Concept stratégique",
      ops: "Opérations clés",
      btn: "Propulser ce levier"
    }
  },
  en: {
    nav: { expertise: "Expertise", bio: "Bio", lab: "Growth Lab", collab: "Collaborate" },
    hero: {
      badge: "Marketing Expert & Digital Projects",
      title1: "Drive",
      title2: "Growth.",
      sub: "Got a project in mind? Need visibility, users, or growth? I guide you from strategy to execution.",
      btn_work: "Work Together",
      btn_cv: "My Resume (PDF)",
      exp: "Experience",
      proj: "Projects",
      success: "100% Success",
      avail: "Available",
      loc: "Montpellier / Remote"
    },
    trust: { sat: "100% Satisfaction", proj: "+50 Projects", int: "International", conf: "Confidentiality" },
    stack: {
      title_sub: "Methodology",
      title: "Playbook.",
      desc: "Marketing Consultant - 360° Acquisition Strategies.",
      top: "Top Demand",
      new: "NEW"
    },
    exp: {
      roadmap: "Roadmap",
      title: "Pro Experience.",
      impact: "Direct Impact",
      details_prefix: "Details"
    },
    cursus: {
      sub: "Academic Foundation",
      title: "Foundations.",
      dc: { title: "Digital Campus", sub: "Master Digital Strategy Expert" },
      iscom: { title: "ISCOM", sub: "Bachelor Communication & Ads" }
    },
    testi: { sub: "Trust", title: "Pro Talk." },
    footer: { btn: "Collaborate Now", copyright: "Developed by Lucien LUKES" },
    bio: {
      sub: "About",
      title: "Bio.",
      dl: "Download CV",
      intro_1: "I am",
      intro_2: "Lucien.",
      job: "Growth Architect & Influence Consultant",
      p1_bold: "I don't just 'do' digital.",
      p1: "I help projects structure themselves, find their audience, and scale up.",
      p2_bold: "gaming, tech, social platforms",
      p2: "I come from a fast-paced world: ",
      p2_end: ". Demanding environments with real audiences and concrete stakes. That's where I learned to grow projects—not in theory, but by testing, adjusting, and iterating.",
      p3: "I've worked on products and initiatives capable of reaching hundreds of thousands, sometimes millions of users, blending strategy, content, and team management.",
      adn: "Digital DNA",
      sectors: "Sectors",
      method: "Method",
      target: "Target Role",
      env: "Environment",
      back: "Back to Expertise",
      avail: "Available",
      loc: "Montpellier / Remote"
    },
    game: {
      title: "Influence",
      title_sub: "Rush.",
      timer: "Timer",
      eng: "ENGAGEMENT",
      brief: "Mission Briefing",
      brief_client: "Clients",
      brief_viral: "Virality",
      brief_partner: "Partner",
      brief_bots: "Bots",
      brief_bad: "Bad Buzz",
      brief_streak: "Streak",
      btn_start: "Start Game",
      score_title: "Scoreboard.",
      record: "Engagement Record",
      you: "You (Visitor)",
      score: "Current Score",
      taunt: "See, I'm better... So contact me! 😉",
      retry: "Retry",
      contact: "Contact",
      back: "Back",
      logic_title: "THE LOGIC BEHIND THIS GAME",
      logic_intro: "This mini-game isn't just entertainment, it's a metaphor for my work.",
      logic_p1_title: "The Timer (Stress)",
      logic_p1_desc: "In startups or product launches, time is the enemy. You must execute fast.",
      logic_p2_title: "The Targets (Opportunities)",
      logic_p2_desc: "They move fast. You must distinguish a Qualified Lead (Blue) from a Bad Buzz (Fire) or a Bot (Red).",
      logic_p3_title: "The Multiplier (Hype)",
      logic_p3_desc: "This is virality. When you hit the right lever (Golden Rocket), results aren't linear, they are exponential.",
      logic_conc_title: "My Role:",
      logic_conc_desc: "I am the one helping you aim true, avoid traps, and trigger that famous growth multiplier."
    },
    form: {
      title: "Collaborate.",
      step1: "01. Contract Type",
      free: "Freelance / Mission",
      cdi: "Full-time / Long Term",
      step2_title: "02. Scope of Work",
      mc: "Minecraft Project?",
      btn_cont: "Continue",
      duration: "Estimated Duration",
      loc: "Location",
      sel_duration: "Select duration...",
      d_one: "One-shot",
      d_short: "1 - 3 Months",
      d_mid: "3 - 6 Months",
      d_long: "Long term (+6 months)",
      l_rem: "Remote",
      l_site: "On Site",
      l_hyb: "Hybrid",
      proj_label: "Your Project / Ambition",
      proj_placeholder: "Describe your needs, current challenges...",
      email_label: "Work Email",
      btn_back: "Back",
      btn_send: "Send Request",
      success_title: "Received!",
      success_msg: "I just received your brief. I'll analyze it and get back to you within 24h at",
      close: "Close"
    },
    modal: {
      strat: "Strategic Concept",
      ops: "Key Operations",
      btn: "Boost this lever"
    }
  }
};

// Data Factories
const getTestimonials = (lang) => [
  { id: 1, name: "Thomas", role: lang === 'fr' ? "Fondateur Serveur SkyBlock (FR)" : "SkyBlock Server Founder", text: lang === 'fr' ? "On stagnait à 50 joueurs simultanés. Après l'audit de Lucien et la refonte de l'acquisition, on a tapé les 500 en un mois. Il connait les codes par coeur." : "We were stuck at 50 concurrent players. After Lucien's audit and acquisition overhaul, we hit 500 in a month. He knows the codes by heart." },
  { id: 2, name: "Sarah L.", role: "CMO - SaaS B2B", text: lang === 'fr' ? "J'avais peur de l'approche 'gaming' pour notre boîte très corporate. Finalement, c'est cette créativité qui nous a permis de débloquer notre coût par lead. Bluffant." : "I was afraid of the 'gaming' approach for our corporate company. Ultimately, this creativity unlocked our cost per lead. Stunning." },
  { id: 3, name: "M. Gauthier", role: lang === 'fr' ? "Directeur E-commerce" : "E-commerce Director", text: lang === 'fr' ? "Pas de blabla, que des résultats. Il a géré notre campagne d'influence de A à Z avec une rigueur militaire. ROI x4." : "No fluff, just results. He managed our influencer campaign from A to Z with military rigor. 4x ROI." }
];

const getExperiences = (lang) => [
  { company: 'RIVRS', link: 'https://www.rivrs.io/', role: lang === 'fr' ? 'Directeur Marketing & Influence' : 'Marketing & Influence Director', period: '2023 - ' + (lang === 'fr' ? 'Présent' : 'Present'), desc: lang === 'fr' ? 'Pilotage global des campagnes d\'influence sur Minecraft (FR & International).' : 'Global management of influencer campaigns on Minecraft (FR & International).', impact: lang === 'fr' ? '5M VISITEURS MENSUELS' : '5M MONTHLY VISITORS', details: lang === 'fr' ? ["Gestion et structuration des campagnes d'influence sur l'ensemble des serveurs Rivrs.", "Pilotage de stratégies massives sur les marchés France, US, DE et IT.", "Management de l'équipe marketing (8 personnes) et créative.", "Optimisation du CAC et de la LTV via des dashboards Data avancés."] : ["Management and structuring of influencer campaigns across all Rivrs servers.", "Steering massive strategies in FR, US, DE, and IT markets.", "Management of the marketing (8 people) and creative teams.", "CAC and LTV optimization via advanced Data dashboards."] },
  { company: 'OUTLIER', link: 'https://outlier.ai/', role: 'AI Marketing Architect', period: '2023 - 2024', desc: lang === 'fr' ? 'Entraînement de modèles IA via le marketing de contenu stratégique.' : 'Training AI models via strategic content marketing.', impact: lang === 'fr' ? '100+ CAMPAGNES IA' : '100+ AI CAMPAIGNS', details: lang === 'fr' ? ["Collaboration étroite avec des ingénieurs IA pour affiner la pertinence et performance des modèles.", "Optimisation de modèles LLM pour la conversion marketing et psychologie client.", "Rédaction de scripts de vente haute-performance assistés par IA."] : ["Close collaboration with AI engineers to refine model relevance and performance.", "LLM optimization for marketing conversion and client psychology.", "High-performance AI-assisted sales script writing."] },
  { 
    company: 'POUDLARD RP', 
    link: 'https://discord.gg/poudlardrp', 
    role: lang === 'fr' ? 'Fondateur & Growth Director' : 'Founder & Growth Director', 
    period: '2018 - 2022', 
    desc: lang === 'fr' ? 'Création et pilotage intégral du serveur Minecraft RPG Harry Potter n°1 en France.' : 'Creation and full management of the #1 Harry Potter RPG Minecraft server in France.', 
    featured: true, 
    isPoudlard: true, 
    impact: lang === 'fr' ? '300 000 JOUEURS UNIQUES' : '300,000 UNIQUE PLAYERS', 
    details: lang === 'fr' ? [
      'Acquisition de 300 000 joueurs uniques via une stratégie 100% organique.',
      'Management intégral de 100 membres (Développeurs, Game Artist et Graphiste, CM).', 
      'Architecture des boucles de viralité TikTok & monétisation in-game.', 
      'Développement d\'une économie virtuelle complexe et stable.'
    ] : [
      'Acquisition of 300,000 unique players via a 100% organic strategy.',
      'Full management of 100 members (Developers, Game Artists, CM).',
      'Architecture of TikTok viral loops & in-game monetization.',
      'Development of a complex and stable virtual economy.'
    ]
  },
  { company: 'UNREAL ENGINE', link: 'https://www.unrealengine.com/fr', role: lang === 'fr' ? 'Chargé de communauté & Événementiel (Stage)' : 'Community & Events Manager (Intern)', period: '2020 - 2022', desc: lang === 'fr' ? 'Community Manager pour l\'écosystème Unreal Engine, focalisé sur l\'engagement Discord.' : 'Community Manager for the Unreal Engine ecosystem, focused on Discord engagement.', impact: lang === 'fr' ? 'GESTION DISCORD INTÉGRALE' : 'FULL DISCORD MANAGEMENT', details: lang === 'fr' ? ["Gestion intégrale et animation du serveur Discord communautaire.", "Organisation d'événements en ligne et coordination des modérateurs.", "Mise en place de bots et de structures de salons pour optimiser l'UX communautaire.", "Relais d'information technique et support de premier niveau pour les créateurs."] : ["Full management and animation of the community Discord server.", "Organization of online events and moderator coordination.", "Implementation of bots and channel structures to optimize community UX.", "Technical information relay and first-level support for creators."] }
];

const getStack = (lang) => [
  { name: "Influence Marketing", icon: Share2, category: "Social", simple: lang === 'fr' ? "Connecter votre marque aux bonnes personnes pour créer de la confiance." : "Connecting your brand to the right people to build trust.", definition: lang === 'fr' ? "Partenariats avec des créateurs de contenu." : "Partnerships with content creators.", popular: true, extraInfo: lang === 'fr' ? "Carnet d'adresses : 300+ Créateurs Internationaux (FR/US/DE/IT)." : "Address book: 300+ International Creators (FR/US/DE/IT).", actions: lang === 'fr' ? ["Sourcing via Data Scraping", "Contrats Performance (CPA)", "Tunnels de Conversion Dédiés"] : ["Sourcing via Data Scraping", "Performance Contracts (CPA)", "Dedicated Conversion Funnels"] },
  { name: "SEO / SEM", icon: Search, category: lang === 'fr' ? "Acquisition" : "Acquisition", simple: lang === 'fr' ? "Être trouvé immédiatement par ceux qui veulent acheter votre produit." : "Be found immediately by those who want to buy your product.", definition: lang === 'fr' ? "Optimisation Google & Publicité ciblée." : "Google Optimization & Targeted Ads.", actions: ["Topic Clusters & Content Silos", "Audit Core Web Vitals", "Google Ads ROI-Driven"] },
  { name: lang === 'fr' ? "Développeur React" : "React Developer", icon: Trophy, category: "Tech", simple: lang === 'fr' ? "Développer des applications web ultra-performantes comme celle-ci." : "Developing ultra-high-performance web apps like this one.", definition: lang === 'fr' ? "Création de sites & apps modernes." : "Modern sites & apps creation.", isNew: true, actions: ["React & Tailwind", "Animations Framer Motion", "Expérience Utilisateur (UX)"] },
  { name: "ADS (Tiktok, FB, Google)", icon: Megaphone, category: "Paid Media", simple: lang === 'fr' ? "Campagnes publicitaires ultra-ciblées pour un ROI immédiat." : "Ultra-targeted ad campaigns for immediate ROI.", definition: lang === 'fr' ? "Acquisition payante multicanale." : "Multi-channel paid acquisition.", actions: lang === 'fr' ? ["A/B Testing Massif", "Ciblage Comportemental", "Analytics Cohortes"] : ["Massive A/B Testing", "Behavioral Targeting", "Cohort Analytics"] },
  { name: "CRM Automation", icon: Layers, category: "Retention", simple: lang === 'fr' ? "Prendre soin de vos clients automatiquement pour qu'ils achètent plus souvent." : "Taking care of your customers automatically so they buy more often.", definition: lang === 'fr' ? "Gestion automatisée de la base client." : "Automated client base management.", actions: lang === 'fr' ? ["Segmentation Comportementale", "Lead Nurturing", "Emailing Haute-Performance"] : ["Behavioral Segmentation", "Lead Nurturing", "High-Performance Emailing"] },
  { name: lang === 'fr' ? "Plan de Com' 360°" : "360° Comm Plan", icon: Compass, category: lang === 'fr' ? "Stratégie" : "Strategy", simple: lang === 'fr' ? "Une feuille de route claire pour dominer votre marché et engager votre audience." : "A clear roadmap to dominate your market and engage your audience.", definition: lang === 'fr' ? "Vision globale et calendrier éditorial." : "Global vision and editorial calendar.", actions: lang === 'fr' ? ["Brand Voice", "Content Pillars", "Planification Stratégique"] : ["Brand Voice", "Content Pillars", "Strategic Planning"] }
];

// --- COMPOSANTS ---

const ScrollProgress = memo(() => {
  const barRef = useRef(null);

  useEffect(() => {
    let rafId;
    const updateScroll = () => {
        if (!barRef.current) return;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        barRef.current.style.height = `${progress}%`;
    };

    const handleScroll = () => {
       cancelAnimationFrame(rafId);
       rafId = requestAnimationFrame(updateScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
        window.removeEventListener('scroll', handleScroll);
        cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed top-0 right-0 h-full w-1.5 bg-white/5 z-[90] hidden md:block">
      <div 
        ref={barRef}
        className="bg-red-600 w-full will-change-transform"
        style={{ height: '0%' }}
      />
    </div>
  );
});

const TrustStrip = memo(({ lang, t }) => (
  <>
    <div className="py-6 md:py-10 border-y border-white/5 bg-white/[0.02] overflow-hidden backdrop-blur-sm relative z-30">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center lg:justify-between gap-4 md:gap-8 items-center text-slate-500 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.2em]">
        <div className="flex items-center gap-2 md:gap-3"><ShieldCheck size={16} className="text-emerald-500" /> {t.sat}</div>
        <div className="flex items-center gap-2 md:gap-3"><Activity size={16} className="text-red-500" /> {t.proj}</div>
        <div className="flex items-center gap-2 md:gap-3"><Globe2 size={16} className="text-blue-500" /> {t.int}</div>
        <div className="flex items-center gap-2 md:gap-3"><Lock size={16} className="text-yellow-500" /> {t.conf}</div>
        </div>
    </div>
    
    {/* ANIMATED SCROLL ARROW MOVED OUTSIDE FOR VISIBILITY */}
    <div className="flex justify-center py-8 animate-bounce w-full relative z-20">
        <ChevronDown className="text-white/40 w-8 h-8 md:w-10 md:h-10" />
    </div>
  </>
));

const TestimonialsSection = memo(({ testimonials, t }) => (
  <section className="py-16 md:py-40 px-6 relative font-black border-t border-white/5">
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
));

const CollaborationForm = memo(({ onClose, playSound, t, stackData }) => {
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

  const toggleMission = (missionName) => {
    setFormData(prev => {
      const exists = prev.missions.includes(missionName);
      if (exists) return { ...prev, missions: prev.missions.filter(m => m !== missionName) };
      return { ...prev, missions: [...prev.missions, missionName] };
    });
    playSound(800, 'sine', 0.05);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(3);
    playSound(600, 'triangle', 0.3);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-6 animate-quick-pop">
      <div className="absolute inset-0 bg-black/95" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[2rem] md:rounded-[3rem] shadow-3xl border-b-4 border-b-red-600 overflow-hidden flex flex-col max-h-[90vh] will-change-transform">
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 bg-black/50 sticky top-0 z-10">
          <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic">{t.title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition bg-white/5 p-3 rounded-full hover:rotate-90 duration-300"><X size={20} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
          {step === 1 && (
            <div className="space-y-8 md:space-y-12 animate-reveal">
              <div className="space-y-4">
                <p className="text-red-500 font-black uppercase text-[10px] tracking-[0.2em]">{t.step1}</p>
                <div className="flex flex-col md:flex-row gap-4">
                  <button onClick={() => setFormData({...formData, type: 'freelance'})} className={`flex-1 p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${formData.type === 'freelance' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}>
                    <Zap size={24} className={formData.type === 'freelance' ? 'text-red-600' : ''} />
                    <span className="font-black uppercase tracking-wider text-sm">{t.free}</span>
                  </button>
                  <button onClick={() => setFormData({...formData, type: 'cdi'})} className={`flex-1 p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${formData.type === 'cdi' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}>
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
                    <button key={stack.name} onClick={() => toggleMission(stack.name)} className={`relative px-6 py-5 rounded-2xl border text-left transition-all duration-100 flex items-start justify-between gap-4 group active:scale-95 ${formData.missions.includes(stack.name) ? 'bg-red-600 border-red-600 text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}>
                      {stack.popular && (
                        <div className="absolute -top-3 -right-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-lg animate-pulse z-10 border border-black flex items-center gap-1">
                          <Flame size={10} fill="white" /> Top
                        </div>
                      )}
                      {stack.isNew && (
                        <div className="absolute -top-3 -right-2 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-lg animate-pulse z-10 border border-black flex items-center gap-1">
                          <Sparkles size={10} fill="white" /> NEW
                        </div>
                      )}
                      <div className="space-y-1">
                        <span className="font-black uppercase text-xs tracking-wider block">{stack.name}</span>
                        <span className={`text-[10px] font-medium block leading-tight ${formData.missions.includes(stack.name) ? 'text-white/80' : 'text-slate-500'}`}>{stack.definition}</span>
                      </div>
                      {formData.missions.includes(stack.name) && <CheckCircle size={18} className="flex-shrink-0 mt-1" />}
                    </button>
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
                    <select required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:border-red-600 outline-none appearance-none font-bold cursor-pointer hover:bg-white/10 transition-colors" onChange={(e) => setFormData({...formData, duration: e.target.value})}>
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
                      <button key={loc} type="button" onClick={() => setFormData({...formData, location: loc})} className={`flex-1 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-wider transition-all ${formData.location === loc ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}>
                        {loc === 'remote' ? t.l_rem : loc === 'presential' ? t.l_site : t.l_hyb}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-red-500 font-black uppercase text-[10px] tracking-[0.2em]">{t.proj_label}</label>
                <textarea required placeholder={t.proj_placeholder} className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-white text-sm focus:border-red-600 outline-none resize-none font-medium placeholder:text-slate-600 transition-colors focus:bg-white/10" onChange={(e) => setFormData({...formData, project: e.target.value})}></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-red-500 font-black uppercase text-[10px] tracking-[0.2em]">{t.email_label}</label>
                <input required type="email" placeholder="contact@entreprise.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-sm focus:border-red-600 outline-none font-bold placeholder:text-slate-600 transition-colors focus:bg-white/10" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>

              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="px-8 py-6 rounded-2xl border border-white/10 text-white font-black uppercase hover:bg-white/5 transition-all text-xs tracking-widest">{t.btn_back}</button>
                <button type="submit" className="flex-1 bg-red-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-glow-red active:scale-95 flex items-center justify-center gap-3">{t.btn_send} <Send size={18} /></button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-8 animate-reveal">
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-glow-emerald animate-bounce">
                <CheckCircle size={40} className="text-black" />
              </div>
              <div className="space-y-4">
                <h4 className="text-3xl font-black text-white uppercase tracking-tighter">{t.success_title}</h4>
                <p className="text-slate-400 font-medium max-w-md mx-auto">{t.success_msg} <span className="text-white">{formData.email}</span>.</p>
              </div>
              <button onClick={onClose} className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-500 hover:text-black transition-all mt-8">{t.close}</button>
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
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-6 animate-quick-pop">
      <div className="absolute inset-0 bg-black/90" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-[#0d0d0d] border border-white/10 rounded-[2rem] md:rounded-[3rem] shadow-3xl border-b-4 border-b-red-600 overflow-hidden transform transition-all">
        <button onClick={onClose} className="absolute top-6 right-6 md:top-8 md:right-8 text-slate-500 hover:text-white transition bg-white/5 p-3 rounded-full z-20 hover:rotate-90 duration-300"><X size={20} /></button>
        <div className="max-h-[85vh] overflow-y-auto custom-scrollbar p-8 md:p-14">
          {children}
        </div>
      </div>
    </div>
  );
});

const Navbar = memo(({ scrolled, view, navigateTo, openChat, lang, setLang, t }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 font-black ${(scrolled || view === 'play') ? 'bg-black/95 backdrop-blur-md border-b border-white/10 py-4 shadow-2xl' : 'bg-transparent py-6 md:py-10'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center relative">
        <div onClick={() => { navigateTo('home'); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="group cursor-pointer flex items-center gap-4 md:gap-6 active:scale-90 transition-all duration-500 z-50">
          <div className="relative">
            <div className="absolute inset-0 bg-red-600 blur-xl opacity-0 group-hover:opacity-40 transition-opacity" />
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-tr from-red-600 via-red-500 to-orange-500 rounded-2xl md:rounded-3xl flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform duration-500 text-xl md:text-2xl font-black relative z-10">LL</div>
            <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-emerald-500 border-[3px] border-black rounded-full shadow-glow-emerald z-20"></div>
          </div>
          <div className="flex flex-col leading-tight font-black pt-1">
            <span className="text-white font-black text-xl md:text-2xl uppercase tracking-tighter group-hover:text-red-500 transition-colors duration-500 text-left">Lucien Lukes</span>
            <span className="text-[9px] md:text-[10px] text-slate-500 font-black tracking-[0.4em] md:tracking-[0.6em] uppercase italic group-hover:text-white transition-colors duration-700">Growth Architect</span>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white z-50 p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center space-y-12 animate-reveal">
              <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 right-8 text-white/50 hover:text-white p-4"><X size={32} /></button>
              
              <div className="flex flex-col items-center gap-10">
                <button onClick={() => { navigateTo('home'); setIsMobileMenuOpen(false); }} className={`text-4xl font-black uppercase tracking-[0.2em] ${view === 'home' ? 'text-red-500' : 'text-white'}`}>{t.expertise}</button>
                <button onClick={() => { navigateTo('bio'); setIsMobileMenuOpen(false); }} className={`text-4xl font-black uppercase tracking-[0.2em] ${view === 'bio' ? 'text-red-500' : 'text-white'}`}>{t.bio}</button>
                <button onClick={() => { navigateTo('play'); setIsMobileMenuOpen(false); }} className={`text-4xl font-black uppercase tracking-[0.2em] ${view === 'play' ? 'text-red-500' : 'text-white'}`}>{t.lab}</button>
              </div>

              <div className="flex flex-col items-center gap-8 mt-8 border-t border-white/10 pt-12 w-2/3">
                <button onClick={() => { openChat(); setIsMobileMenuOpen(false); }} className="w-full bg-white text-black px-10 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl">{t.collab}</button>
                <button onClick={() => setLang(l => l === 'fr' ? 'en' : 'fr')} className="text-slate-500 hover:text-white transition-colors text-xl font-black uppercase tracking-widest border-2 border-white/10 px-8 py-3 rounded-2xl">{lang === 'fr' ? 'FR' : 'EN'}</button>
              </div>
          </div>
        )}

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-16 text-[12px] font-black uppercase tracking-[0.4em]">
          <button onClick={() => navigateTo('home')} className={`transition-all duration-500 hover:text-white relative group ${view === 'home' ? 'text-white' : 'text-slate-500'}`}>{t.expertise}</button>
          <button onClick={() => navigateTo('bio')} className={`transition-all duration-500 hover:text-white relative group ${view === 'bio' ? 'text-white' : 'text-slate-500'}`}>{t.bio}</button>
          <button onClick={() => navigateTo('play')} className={`flex items-center gap-3 transition-all duration-500 hover:text-red-500 group ${view === 'play' ? 'text-red-500' : 'text-slate-500'}`}><Gamepad2 size={18} /> {t.lab}</button>
          <button onClick={openChat} className="bg-white text-black px-12 py-5 rounded-[2rem] font-black hover:bg-red-600 hover:text-white transition-all shadow-2xl active:scale-95 tracking-[0.2em] font-black uppercase border-2 border-transparent">{t.collab}</button>
          
          {/* LANG SWITCHER */}
          <button onClick={() => setLang(l => l === 'fr' ? 'en' : 'fr')} className="text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest border border-white/10 px-2 py-1 rounded-lg ml-[-20px]">{lang === 'fr' ? 'FR' : 'EN'}</button>
        </div>
      </div>
    </nav>
  );
});

const HeroSection = memo(({ openChat, playSound, profileImageUrl, t, handleDownload }) => (
  <section id="hero" className="relative pt-32 md:pt-72 pb-16 md:pb-32 px-6 overflow-hidden font-black">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-900/10 via-transparent to-[#020202] -z-10" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] md:h-[1200px] bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.15)_0%,transparent_70%)] -z-10" />
    <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#020202] to-transparent -z-10" />
    <div className="digital-grid absolute inset-0 opacity-10 -z-20" />
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
      <div className="lg:col-span-8 space-y-8 md:space-y-12 animate-reveal">
        <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-black text-red-500 uppercase tracking-[0.6em] shadow-2xl animate-fade-in-up">
          <Sparkles size={16} className="animate-pulse text-yellow-500" /> {t.badge}
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[130px] font-black text-white tracking-tighter leading-[0.9] lg:leading-[0.8] uppercase italic animate-fade-in-up delay-100">
          {t.title1} <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-400 to-orange-500 drop-shadow-2xl">{t.title2}</span>
        </h1>
        <p className="text-lg md:text-3xl text-slate-400 max-w-2xl leading-relaxed font-light border-l-4 border-red-600 pl-6 md:pl-10 italic transition-all hover:text-white duration-500 animate-fade-in-up delay-200">
          "{t.sub}"
        </p>
        <div className="flex flex-col md:flex-row flex-wrap gap-4 md:gap-8 pt-6 animate-fade-in-up delay-300">
          <button onClick={openChat} className="w-full md:w-auto relative group bg-red-600 text-white px-8 py-4 md:px-12 md:py-6 rounded-2xl font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm shadow-glow-red transition-all hover:-translate-y-2 active:scale-95 overflow-hidden">
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 flex items-center justify-center gap-3 font-black">{t.btn_work} <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" /></span>
          </button>
          <button onClick={handleDownload} className="w-full md:w-auto flex items-center justify-center gap-4 md:gap-6 bg-white/5 border border-white/10 px-8 py-4 md:px-10 md:py-6 rounded-2xl hover:bg-white/10 hover:-translate-y-2 transition-all group border-b-4 border-b-red-500/20 shadow-2xl font-black uppercase text-[10px] md:text-[11px] tracking-widest">{t.btn_cv} <Download size={20} className="text-red-500 ml-2" /></button>
        </div>
      </div>
      <div className="lg:col-span-4 relative group animate-reveal delay-500 hidden lg:block pr-12">
        <div className="relative aspect-[3.8/5] rounded-[5rem] overflow-hidden border-2 border-white/10 shadow-3xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-40" />
          <img src={profileImageUrl} alt="Lucien Lukes Freelance Marketing Montpellier France" className="w-full h-full object-cover object-top brightness-110 contrast-105" />
        </div>
        
        {/* BADGES */}
        <div className="absolute top-16 -left-12 bg-black/80 backdrop-blur-md border border-white/5 p-3 pr-5 rounded-full flex items-center gap-3 shadow-xl z-20 animate-float">
             <div className="bg-red-600/20 p-2 rounded-full text-red-500"><Trophy size={16} /></div>
             <div>
                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{t.exp}</p>
                 <p className="text-white font-black text-sm leading-none">5+ Ans</p>
             </div>
        </div>

        <div className="absolute bottom-16 -right-8 bg-black/80 backdrop-blur-md border border-white/5 p-3 pr-5 rounded-full flex items-center gap-3 shadow-xl z-20 animate-float animation-delay-2000">
             <div className="bg-emerald-500/20 p-2 rounded-full text-emerald-500"><CheckCircle size={16} /></div>
             <div>
                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{t.proj}</p>
                 <p className="text-white font-black text-sm leading-none">{t.success}</p>
             </div>
        </div>

      </div>
    </div>
  </section>
));

const Experiences = memo(({ experiences, onSpell, t }) => {
  const containerRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    let rafId;
    let ticking = false;

    const handleScroll = () => {
        if (!ticking) {
            rafId = requestAnimationFrame(() => {
                if (containerRef.current && progressRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    const progress = Math.min(Math.max(- (rect.top - windowHeight) / rect.height, 0), 1);
                    progressRef.current.style.transform = `scaleY(${progress})`;
                }
                ticking = false;
            });
            ticking = true;
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
        window.removeEventListener('scroll', handleScroll);
        cancelAnimationFrame(rafId);
    }
  }, []);

  return (
    <section id="missions" ref={containerRef} className="py-16 md:py-56 px-6 relative font-black">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-red-600/5 to-transparent -z-10" />
      <div className="max-w-6xl mx-auto space-y-12 md:space-y-32">
        <div className="text-center space-y-6">
            <p className="text-red-500 font-black uppercase text-[11px] tracking-[1em] animate-pulse">{t.roadmap}</p>
            <h2 className="text-4xl md:text-7xl lg:text-[100px] font-black text-white tracking-tighter uppercase relative z-10 leading-[0.9] md:leading-[0.8] italic font-black">{t.title}</h2>
        </div>
        <div className="relative space-y-12 md:space-y-32 text-left">
          <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-[4px] bg-white/5 hidden md:block overflow-hidden rounded-full shadow-inner font-black">
              <div ref={progressRef} className="absolute top-0 left-0 w-full bg-gradient-to-b from-red-600 via-orange-500 to-red-400 origin-top transition-transform duration-150 ease-out will-change-transform font-black" style={{ height: '100%', transform: 'scaleY(0)' }} />
          </div>

          {experiences.map((exp, i) => (
            <div key={i} className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-20 group ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} animate-reveal font-black`}>
              <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-black border-4 border-red-600 z-20 group-hover:scale-150 transition-all duration-500 hidden md:block shadow-glow-red font-black" />
              <div className={`w-full md:w-[45%] p-6 md:p-16 rounded-[2rem] md:rounded-[5rem] transition-all duration-1000 relative overflow-hidden font-black ${exp.isPoudlard ? 'bg-[#0a0a0a] border-amber-500/40 shadow-2xl ring-1 ring-amber-500/20' : 'bg-slate-900/60 border-white/5 backdrop-blur-3xl hover:bg-slate-900 group-hover:border-red-500/40 shadow-3xl'}`}>
                {exp.isPoudlard && <div className="absolute top-0 right-0 bg-amber-500 px-6 py-3 md:px-10 md:py-4 rounded-bl-[2rem] md:rounded-bl-[2.5rem] font-black text-[9px] md:text-[11px] text-black tracking-widest uppercase flex items-center gap-2 md:gap-3 shadow-2xl font-black"><span className="animate-spin-slow"><Sparkle size={14} fill="black" /></span> Projet Pilier</div>}
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
                        <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none group-hover:translate-x-2 transition-transform duration-500">{exp.company}</h3>
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
                          <ChevronRight className={`mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6 ${exp.isPoudlard ? 'text-amber-500' : 'text-red-600'} group-hover/item:translate-x-2 transition-transform`} />
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
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-left font-black">
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

const SectionBio = memo(({ profileImageUrl, navigateTo, copyDiscord, copyFeedback, playSound, onSpell, t, handleDownload }) => (
  <div className="pt-24 md:pt-40 pb-16 md:pb-24 px-6 animate-reveal font-black">
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
            <img src={profileImageUrl} alt="Consultant influence marketing & Freelance marketing France" className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
            
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
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 space-y-8 md:space-y-12 relative overflow-hidden shadow-3xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9] italic mb-4 flex items-center gap-3 md:gap-4 flex-wrap">
                {t.intro_1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white">
                  <span onClick={() => onSpell('alohomora')} className="cursor-pointer hover:text-red-400 transition-colors">{t.intro_2}</span>
                </span>
                <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
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
                  <div className="flex items-center gap-3 text-white font-black uppercase text-xs tracking-widest group-hover:text-red-500 transition-colors"><Focus size={18} /> {t.sectors}</div>
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
        </div>
      </div>

      <div className="mt-20 flex justify-center border-t border-white/5 pt-10">
        <button onClick={() => navigateTo('home')} className="flex items-center gap-6 text-slate-500 hover:text-white font-black uppercase text-[10px] tracking-[0.8em] transition-all group active:scale-95">
          <ArrowRight className="rotate-180 group-hover:-translate-x-4 transition-transform duration-500" size={20} /> {t.back}
        </button>
      </div>
    </div>
  </div>
));

const GrowthLabGameComp = memo(({ navigateTo, playSound, profileImageUrl, openChat, onSpell, t }) => {
  const [gameActive, setGameActive] = useState(false);
  const [showBriefing, setShowBriefing] = useState(true);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [targets, setTargets] = useState([]);
  const [clickFeedbacks, setClickFeedbacks] = useState([]);
  const [multiplier, setMultiplier] = useState(1);
  const [combo, setCombo] = useState(0);
  const [panicMode, setPanicMode] = useState(false);
  const [visualEvent, setVisualEvent] = useState(null); 

  useEffect(() => {
    let eventInterval;
    if (gameActive) {
        eventInterval = setInterval(() => {
            const rand = Math.random();
            if (rand < 0.15) {
                setVisualEvent('crash');
                playSound(100, 'sawtooth', 0.5);
                setTimeout(() => setVisualEvent(null), 500);
            } else if (rand > 0.85) {
                setVisualEvent('hype');
                playSound(1200, 'square', 0.5);
                setTimeout(() => setVisualEvent(null), 500);
            }
        }, 4000);
    }
    return () => clearInterval(eventInterval);
  }, [gameActive, playSound]);

  useEffect(() => {
    let animationFrame;
    if (gameActive) {
      const updateTargets = () => {
        setTargets(prev => prev.map(t => {
          let nx = t.x + t.vx; let ny = t.y + t.vy;
          let nvx = t.vx; let nvy = t.vy;
          if (nx <= 5 || nx >= 95) nvx = -t.vx;
          if (ny <= 5 || ny >= 95) nvy = -t.vy;
          return { ...t, x: nx, y: ny, vx: nvx, vy: nvy };
        }));
        animationFrame = requestAnimationFrame(updateTargets);
      };
      animationFrame = requestAnimationFrame(updateTargets);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [gameActive]);

  useEffect(() => {
    let timerInterval;
    if (gameActive) {
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 6 && prev > 1) { setPanicMode(true); playSound(prev * 140, 'square', 0.05); }
          if (prev <= 1) { clearInterval(timerInterval); setGameActive(false); setPanicMode(false); playSound(60, 'sawtooth', 0.8); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [gameActive, playSound]);

  useEffect(() => {
    let spawnInterval;
    if (gameActive) {
      spawnInterval = setInterval(() => {
        setTargets(prev => {
            if (prev.length >= 8) return prev; 
            const id = Math.random(); const rand = Math.random();
            let type = 'lead';
            if (rand < 0.08) type = 'golden_rocket';
            else if (rand < 0.30) type = 'spam'; 
            else if (rand < 0.35) type = 'vip';
            else if (rand < 0.45) type = 'bad_buzz';
            else if (rand < 0.47) type = 'clock'; 
            
            // Slower speed on mobile to make it playable
            const isMobile = window.innerWidth < 768;
            const speedFactor = isMobile ? (panicMode ? 2 : 1) : (panicMode ? 3.5 : 2);

            const newTarget = { id, x: Math.random() * 80 + 10, y: Math.random() * 70 + 15, type, vx: (Math.random() - 0.5) * speedFactor, vy: (Math.random() - 0.5) * speedFactor };
            setTimeout(() => setTargets(curr => curr.filter(t => t.id !== id)), 2500);
            return [...prev, newTarget];
        });
      }, panicMode ? 180 : 300);
    }
    return () => clearInterval(spawnInterval);
  }, [gameActive, panicMode]);

  const startGame = useCallback(() => {
    setScore(0); setTimeLeft(15); setMultiplier(1); setCombo(0);
    setPanicMode(false); setGameActive(true); setClickFeedbacks([]); setShowBriefing(false);
    playSound(440, 'sine', 0.3);
  }, [playSound]);

  const handleTargetClick = useCallback((type, id, x, y) => {
    let points = 0; let timeBonus = 0; let msg = ""; let color = "text-emerald-400";
    switch(type) {
      case 'lead': points = 500 * multiplier; msg = "+500 LEADS"; playSound(880 + (combo * 20)); setCombo(prev => prev + 1); break;
      case 'golden_rocket': points = 5000 * multiplier; msg = "VIRALITÈ MAX!"; color = "text-yellow-400"; setMultiplier(prev => prev + 1); playSound(1300, 'square'); setTimeout(() => setMultiplier(prev => Math.max(1, prev - 1)), 5000); break;
      case 'spam': points = -3000; msg = "BOTS DETECTED!"; color = "text-red-500"; playSound(100, 'sawtooth'); setCombo(0); break;
      case 'vip': points = 25000 * multiplier; msg = "PARTENARIAT 👑"; color = "text-purple-400"; playSound(1800, 'triangle'); break;
      case 'bad_buzz': timeBonus = -4; msg = "BAD BUZZ!"; color = "text-orange-600"; playSound(60, 'sawtooth'); setCombo(0); break;
      case 'clock': timeBonus = 2; msg = "CONTENT STREAK! +2s"; color = "text-blue-400"; playSound(1200); break;
    }
    const fId = Math.random();
    setClickFeedbacks(prev => [...prev, { id: fId, x, y, msg, color }]);
    setTimeout(() => setClickFeedbacks(prev => prev.filter(f => f.id !== fId)), 800);
    setScore(prev => prev + points);
    if (timeBonus !== 0) setTimeLeft(prev => Math.max(0, prev + timeBonus));
    setTargets(prev => prev.filter(t => t.id !== id));
  }, [multiplier, combo, playSound]);

  return (
    <div className="pt-24 md:pt-40 pb-24 md:pb-40 px-6 font-black animate-reveal min-h-screen relative flex flex-col items-center justify-start overflow-y-auto">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.05)_0%,transparent_100%)] -z-10" />
        <div className="max-w-6xl w-full space-y-8 md:space-y-12 relative z-10 py-6 md:py-10 font-black">
            <div className="text-center space-y-4 md:space-y-6 mb-8 md:mb-12">
                <h2 className="text-4xl md:text-6xl lg:text-[100px] font-black text-white tracking-tighter uppercase italic leading-[0.9] md:leading-[0.8] animate-float leading-none">{t.title} <br/><span className="text-red-600 cursor-pointer hover:text-white transition-colors" onClick={() => onSpell('wingardium')}>{t.title_sub}</span></h2>
            </div>
            <div className={`relative bg-[#050505] border-2 rounded-[3rem] md:rounded-[4rem] p-6 md:p-16 shadow-3xl transition-all duration-1000 border-white/10 w-full mx-auto ${gameActive ? 'border-red-600/40' : ''} ${panicMode ? 'animate-stress' : ''}`}>
              <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center mb-8 md:mb-12 gap-6 md:gap-8">
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
                      <p className="text-2xl md:text-4xl font-black tabular-nums leading-none mt-1 md:mt-2">{formatScore(score)}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className={`relative w-full max-w-5xl mx-auto aspect-none md:aspect-[16/8] h-[60vh] md:h-auto bg-[#020202] rounded-[2rem] md:rounded-[3rem] border border-white/10 overflow-hidden group cursor-crosshair transition-all duration-1000 ${gameActive ? 'ring-4 md:ring-8 ring-red-600/5' : ''}`}>
                {visualEvent === 'crash' && <div className="absolute inset-0 bg-red-600/20 z-0 animate-pulse pointer-events-none" />}
                {visualEvent === 'hype' && <div className="absolute inset-0 bg-yellow-500/20 z-0 animate-pulse pointer-events-none" />}
                
                {!gameActive ? (
                  <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-[40px] p-6 text-center">
                    {showBriefing ? (
                        <div className="animate-reveal space-y-6 md:space-y-8 w-full max-w-3xl mx-auto flex flex-col items-center p-6 md:p-8 bg-[#0a0a0a] border border-white/10 rounded-[2rem] md:rounded-[3rem] shadow-2xl">
                            <h3 className="text-white font-black text-2xl md:text-4xl uppercase italic tracking-tighter">{t.brief}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full">
                                <div className="flex flex-col items-center gap-2 p-3 md:p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <Users size={24} className="text-blue-400 md:w-8 md:h-8" />
                                    <p className="text-white font-bold uppercase text-[10px] md:text-xs">{t.brief_client}</p>
                                    <p className="text-slate-400 text-[9px] md:text-[10px]">+500 Pts</p>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-3 md:p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <Rocket size={24} className="text-yellow-400 md:w-8 md:h-8" />
                                    <p className="text-white font-bold uppercase text-[10px] md:text-xs">{t.brief_viral}</p>
                                    <p className="text-slate-400 text-[9px] md:text-[10px]">+5000 Pts</p>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-3 md:p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <Crown size={24} className="text-purple-400 md:w-8 md:h-8" />
                                    <p className="text-white font-bold uppercase text-[10px] md:text-xs">{t.brief_partner}</p>
                                    <p className="text-slate-400 text-[9px] md:text-[10px]">+25K Pts</p>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-3 md:p-4 bg-red-900/20 rounded-2xl border border-red-500/20">
                                    <ZapOff size={24} className="text-red-500 md:w-8 md:h-8" />
                                    <p className="text-red-500 font-bold uppercase text-[10px] md:text-xs">{t.brief_bots}</p>
                                    <p className="text-red-400/60 text-[9px] md:text-[10px]">-3000 Pts</p>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-3 md:p-4 bg-red-900/20 rounded-2xl border border-red-500/20">
                                    <Flame size={24} className="text-orange-500 md:w-8 md:h-8" />
                                    <p className="text-orange-500 font-bold uppercase text-[10px] md:text-xs">{t.brief_bad}</p>
                                    <p className="text-orange-400/60 text-[9px] md:text-[10px]">-4 Sec</p>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-3 md:p-4 bg-blue-900/20 rounded-2xl border border-blue-500/20">
                                    <Activity size={24} className="text-blue-400 md:w-8 md:h-8" />
                                    <p className="text-blue-400 font-bold uppercase text-[10px] md:text-xs">{t.brief_streak}</p>
                                    <p className="text-blue-300/60 text-[9px] md:text-[10px]">+2 Sec</p>
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
                               <p className="text-white text-3xl md:text-5xl font-black tracking-tighter leading-none">10.5M</p>
                             </div>
                           </div>
                           <div className="flex flex-col p-6 bg-white/[0.03] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] shadow-3xl backdrop-blur-3xl text-left">
                             <div className="flex items-center gap-4 mb-4"><div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500"><User size={20} /></div><p className="text-white text-base font-black uppercase tracking-tighter italic leading-none">{t.you}</p></div>
                             <div className="mt-auto"><p className="text-slate-600 text-[8px] font-black uppercase tracking-[0.4em]">{t.score}</p><p className="text-red-500 text-3xl md:text-5xl font-black tracking-tighter leading-none">{formatScore(score)}</p></div>
                           </div>
                        </div>
                        <div className="pt-4 space-y-6 w-full flex flex-col items-center">
                            <div className="bg-red-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-[2rem] font-black uppercase text-[10px] md:text-xs tracking-tight shadow-glow-red italic animate-bounce inline-block">"{t.taunt}"</div>
                            <div className="flex gap-4 justify-center w-full">
                                <button onClick={() => { setShowBriefing(true); setScore(0); }} className="bg-white text-black font-black uppercase text-[9px] tracking-[0.5em] py-4 px-6 md:py-5 md:px-8 rounded-2xl hover:bg-red-600 hover:text-white transition-all flex-1 max-w-[150px] active:scale-95">{t.retry}</button>
                                <button onClick={openChat} className="bg-red-600 text-white font-black uppercase text-[9px] tracking-[0.5em] py-4 px-6 md:py-5 md:px-8 rounded-2xl hover:bg-white hover:text-black transition-all flex-1 max-w-[150px] active:scale-95">{t.contact}</button>
                            </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <>
                    {clickFeedbacks.map(f => <div key={f.id} style={{ left: `${f.x}%`, top: `${f.y}%` }} className={`absolute pointer-events-none font-black text-xl md:text-3xl uppercase animate-float-out z-50 ${f.color} drop-shadow-[0_0_10px_rgba(0,0,0,1)]`}>{f.msg}</div>)}
                    {targets.map(t => {
                        const IconComp = t.type === 'lead' ? Users : t.type === 'golden_rocket' ? Rocket : t.type === 'spam' ? ZapOff : t.type === 'vip' ? Crown : t.type === 'bad_buzz' ? Flame : Activity;
                        return (
                          <div key={t.id} onClick={(e) => { e.stopPropagation(); handleTargetClick(t.type, t.id, t.x, t.y); }} style={{ left: `${t.x}%`, top: `${t.y}%` }} className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-6 md:p-8 rounded-full cursor-pointer transition-all hover:scale-125 z-10 flex items-center justify-center animate-reveal ${t.type === 'lead' ? 'bg-blue-600/30 border-2 border-blue-400 shadow-glow-blue' : ''} ${t.type === 'golden_rocket' ? 'bg-yellow-500/40 border-2 border-white animate-bounce shadow-glow-yellow' : ''} ${t.type === 'spam' ? 'bg-red-900/60 border-2 border-red-600' : ''} ${t.type === 'vip' ? 'bg-purple-600/40 border-2 border-white animate-pulse shadow-glow-purple' : ''} ${t.type === 'bad_buzz' ? 'bg-orange-600/40 border-2 border-orange-500' : ''} ${t.type === 'clock' ? 'bg-blue-400/40 border-2 border-white animate-float shadow-glow-blue' : ''}`}>
                            <IconComp size={28} className={`md:w-8 md:h-8 ${t.type === 'golden_rocket' || t.type === 'clock' ? 'text-white' : ''}`} />
                          </div>
                        );
                    })}
                  </>
                )}
              </div>
            </div>

            {/* --- NEW LOGIC SECTION --- */}
            <div className="w-full max-w-5xl mx-auto mt-12 mb-12 p-8 md:p-12 bg-[#0a0a0a] border border-white/10 rounded-[2rem] relative overflow-hidden animate-reveal">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[80px] rounded-full pointer-events-none"></div>
                <div className="relative z-10 space-y-10">
                    <div className="flex items-center gap-4">
                        <Brain className="text-red-600 w-8 h-8 md:w-10 md:h-10" />
                        <h3 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter">{t.logic_title}</h3>
                    </div>
                    <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed italic border-l-4 border-red-600/50 pl-6">
                        "{t.logic_intro}"
                    </p>
                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start group">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all shadow-xl">
                                <Clock size={28} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-white font-black uppercase text-lg tracking-wider">{t.logic_p1_title}</h4>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed">{t.logic_p1_desc}</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start group">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">
                                <Target size={28} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-white font-black uppercase text-lg tracking-wider">{t.logic_p2_title}</h4>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed">{t.logic_p2_desc}</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start group">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-yellow-400 group-hover:bg-yellow-500 group-hover:text-black transition-all shadow-xl">
                                <Zap size={28} />
                            </div>
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

// --- COMPOSANT APP PRINCIPAL ---

const App = () => {
  const [view, setView] = useState('home'); 
  const [scrolled, setScrolled] = useState(false);
  const [modalType, setModalType] = useState(null); 
  const [selectedData, setSelectedData] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [activeSpell, setActiveSpell] = useState(null);
  const [lang, setLang] = useState('fr');

  const profileImageUrl = "https://res.cloudinary.com/dex721lje/image/upload/v1740686437/photo_de_profil_kvhg3h.png"; 

  // Derived Data based on Lang
  const t = TEXTS[lang];
  const experiences = getExperiences(lang);
  const stackData = getStack(lang);
  const testimonials = getTestimonials(lang);

  const playSound = useCallback((freq, type = 'sine', duration = 0.1) => {
    try {
      const ctx = audioSystem.get();
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
    } catch (e) {}
  }, []);

  // --- SECURITY ---
  useEffect(() => {
    const handleContext = (e) => e.preventDefault();
    const handleKey = (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handleContext);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('contextmenu', handleContext);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const navigateTo = useCallback((newView) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const triggerSpell = (spellType) => {
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
    }
    setActiveSpell(spellData);
    setTimeout(() => setActiveSpell(null), 10000);
  };

  const openModal = useCallback((type, data) => {
    setSelectedData(data);
    setModalType(type);
    playSound(600);
  }, [playSound]);

  const closeModal = useCallback(() => {
    setModalType(null);
    setSelectedData(null);
  }, []);

  const copyDiscord = useCallback(() => {
    const el = document.createElement('textarea');
    el.value = 'MrLegya';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
    playSound(600);
  }, [playSound]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(prev => prev !== isScrolled ? isScrolled : prev);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- EFFET TITRE & FAVICON ---
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

  const handleDownload = () => {
    playSound(400);
    const link = document.createElement('a');
    link.href = 'CV Lucien - 2026.pdf'; 
    link.download = 'CV Lucien - 2026.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`min-h-screen bg-[#020202] text-slate-300 font-sans selection:bg-red-600 selection:text-white overflow-x-hidden font-black`}>
      <div className="fixed inset-0 pointer-events-none -z-50 bg-[#020202]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.05),transparent_60%)]" />
      </div>

      {activeSpell && (
        <div className="fixed inset-0 z-[1000] bg-black/95 flex flex-col items-center justify-center p-8 text-center animate-reveal">
            <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,${activeSpell.type === 'lumos' ? 'rgba(255,255,255,0.1)' : activeSpell.type === 'alohomora' ? 'rgba(251,191,36,0.1)' : 'rgba(147,51,234,0.1)'}_0%,transparent_70%)] animate-pulse`} />
            <Wand2 size={64} className={`${activeSpell.type === 'lumos' ? 'text-white' : activeSpell.type === 'alohomora' ? 'text-amber-400' : 'text-purple-500'} mb-6 animate-bounce shadow-glow-white`} />
            <h2 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-4 animate-lumos-text" style={{textShadow: '0 0 30px rgba(255,255,255,0.8)'}}>
              {activeSpell.type === 'lumos' ? 'Lumos Maxima' : activeSpell.type === 'alohomora' ? 'Alohomora' : 'Wingardium Leviosa'}
            </h2>
            <p className={`${activeSpell.type === 'lumos' ? 'text-white' : activeSpell.type === 'alohomora' ? 'text-amber-500' : 'text-purple-500'} font-black uppercase tracking-[0.5em] text-xs mb-8`}>✨ Easter Egg Découvert ✨</p>
            <div className="max-w-2xl bg-white/5 border border-white/10 p-8 rounded-[2rem] relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${activeSpell.type === 'lumos' ? 'from-white via-slate-400 to-slate-600' : activeSpell.type === 'alohomora' ? 'from-amber-400 via-orange-500 to-red-600' : 'from-purple-400 via-indigo-500 to-blue-600'}`} />
                <p className="text-white text-lg md:text-xl font-medium leading-relaxed italic">
                  "{activeSpell.text}"
                </p>
            </div>
            <p className="mt-8 text-slate-600 text-xs uppercase tracking-widest animate-pulse">L'effet se dissipera bientôt...</p>
        </div>
      )}

      <div className="sr-only">
        <h1>Lucien Lukes - Freelance Marketing Montpellier & Consultant Influence France</h1>
        <h2>Spécialiste Growth Architecture, SEO, SEM et Acquisition Payante multicanale.</h2>
        <p>Expert en management de créateurs de contenu et scaling infrastructure.</p>
      </div>

      <Navbar scrolled={scrolled} view={view} navigateTo={navigateTo} openChat={() => setIsChatOpen(true)} lang={lang} setLang={setLang} t={t.nav} />
      <ScrollProgress />

      <main className="animate-reveal">
        {view === 'home' && (
          <>
            <HeroSection openChat={() => setIsChatOpen(true)} playSound={playSound} profileImageUrl={profileImageUrl} t={t.hero} handleDownload={handleDownload} />
            <TrustStrip lang={lang} t={t.trust} />
            
            <section className="py-24 md:py-48 px-6 text-left relative">
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
                    <div key={skill.name} onClick={() => openModal('skill', skill)} className={`group/skill p-8 md:p-12 rounded-[4rem] md:rounded-[5rem] border border-white/5 bg-slate-900/40 hover:bg-red-600 hover:border-red-600 transition-all duration-500 cursor-pointer flex flex-col gap-8 md:gap-12 animate-reveal will-change-transform shadow-2xl`}>
                      <div className="w-fit p-6 md:p-7 rounded-[2rem] bg-black text-red-500 group-hover:bg-white group-hover:text-red-600 transition-all duration-700 shadow-xl font-black"><skill.icon size={32} className="md:w-10 md:h-10" /></div>
                      <div className="space-y-3 md:space-y-4">
                        <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-red-500/80 group-hover:text-white/80 font-black`}>{skill.category}</p>
                        <h4 className={`text-3xl md:text-4xl font-black uppercase tracking-tight leading-none text-slate-100 group-hover:text-white`}>{skill.name}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 w-1 h-32 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-full h-1/2 bg-red-600 animate-pulse rounded-full"></div>
              </div>
            </section>

            <Experiences experiences={experiences} onSpell={triggerSpell} t={t.exp} />

            <section className="py-24 md:py-48 px-6 bg-black/80 md:backdrop-blur-3xl font-black relative">
               <div className="max-w-6xl mx-auto text-center">
                  <div className="mb-20 md:mb-32 space-y-4 md:space-y-6"><p className="text-red-500 uppercase text-[10px] md:text-[11px] tracking-[1em]">{t.cursus.sub}</p><h3 className="text-5xl md:text-7xl lg:text-[90px] font-black text-white uppercase tracking-tighter italic opacity-95 leading-none">{t.cursus.title}</h3></div>
                  <CursusSectionComp t={t.cursus} />
               </div>
            </section>

            <TestimonialsSection testimonials={testimonials} t={t.testi} />

            <footer className="py-24 md:py-40 px-6 border-t border-white/5 bg-black text-center font-black relative overflow-hidden">
              <div className="max-w-4xl mx-auto space-y-12 md:space-y-20">
                <button onClick={() => setIsChatOpen(true)} className="px-12 py-6 md:px-20 md:py-10 bg-red-600 text-white rounded-[2rem] md:rounded-[3rem] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] shadow-glow-red hover:bg-white hover:text-black transition-all active:scale-95 shadow-3xl text-xs md:text-sm">{t.footer.btn}</button>
                <div className="pt-16 md:pt-24 space-y-6">
                    <div className="flex justify-center gap-8 md:gap-10">
                        <a href="https://www.linkedin.com/in/lucien-lukes-1b1a84193/" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-white transition-colors"><Linkedin size={20} className="md:w-6 md:h-6" /></a>
                    </div>
                    <p className="text-slate-800 font-black uppercase text-[9px] md:text-[11px] tracking-[1.5em] md:tracking-[2em] opacity-40">{t.footer.copyright}</p>
                </div>
              </div>
            </footer>
          </>
        )}

        {view === 'bio' && (
          <SectionBio profileImageUrl={profileImageUrl} navigateTo={navigateTo} copyDiscord={copyDiscord} copyFeedback={copyFeedback} playSound={playSound} onSpell={triggerSpell} t={t.bio} handleDownload={handleDownload} />
        )}

        {view === 'play' && (
          <GrowthLabGameComp navigateTo={setView} playSound={playSound} profileImageUrl={profileImageUrl} openChat={() => setIsChatOpen(true)} onSpell={triggerSpell} t={t.game} />
        )}
      </main>

      <Modal isOpen={!!modalType} onClose={closeModal}>
        {modalType === 'skill' && selectedData && (
          <div className="animate-reveal">
            <div className="flex items-center gap-8 md:gap-10 mb-10 md:mb-14 flex-col md:flex-row text-center md:text-left">
              <div className="p-8 md:p-10 bg-red-600 rounded-[2.5rem] md:rounded-[3rem] text-white shadow-glow-red">
                {React.createElement(selectedData.icon, { size: 40, className: "md:w-12 md:h-12" })}
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
              <button onClick={() => { setModalType(null); setIsChatOpen(true); }} className="w-full bg-white text-black font-black py-6 md:py-8 rounded-[2rem] md:rounded-[2.5rem] uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-red-600 hover:text-white transition-all active:scale-95 border-2 border-transparent">{t.modal.btn}</button>
            </div>
          </div>
        )}
      </Modal>

      {isChatOpen && <CollaborationForm onClose={() => setIsChatOpen(false)} playSound={playSound} t={t.form} stackData={stackData} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        :root { scroll-behavior: auto; }
        body { font-family: 'Inter', sans-serif; background: #020202; overflow-x: hidden; touch-action: pan-y; }
        .animate-reveal { animation: reveal 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        @keyframes reveal { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes reveal-bottom { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        .animate-reveal-bottom { animation: reveal-bottom 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        @keyframes slide-in-right { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in-right { animation: slide-in-right 1s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        .digital-grid { background-image: linear-gradient(rgba(220, 38, 38, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 38, 38, 0.03) 1px, transparent 1px); background-size: 50px 50px; }
        .shadow-glow-red { box-shadow: 0 0 50px rgba(220, 38, 38, 0.4); }
        .shadow-glow-emerald { box-shadow: 0 0 40px rgba(16, 185, 129, 0.4); }
        .shadow-glow-white { box-shadow: 0 0 40px rgba(255, 255, 255, 0.6); }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        /* Animation flottante désactivée sur mobile pour perf */
        @media (min-width: 768px) {
          .animate-float { animation: float 6s ease-in-out infinite; }
        }
        @keyframes stress { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.01); border-color: #dc2626; } }
        .animate-stress { animation: stress 0.3s infinite ease-in-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #dc2626; }
        @keyframes float-out { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(-100px) scale(1.2); } }
        .animate-float-out { animation: float-out 0.8s ease-out forwards; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
        @keyframes lumos-flash { 0% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 0; } }
        .animate-lumos-flash { 
            background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(220,240,255,0.5) 50%, transparent 70%);
            animation: lumos-magic 2s ease-out forwards;
            mix-blend-mode: screen;
        }
        @keyframes lumos-text {
            0% { opacity: 0; letter-spacing: 1em; filter: blur(10px); }
            100% { opacity: 1; letter-spacing: 0; filter: blur(0); }
        }
        .animate-lumos-text { animation: lumos-text 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes lumos-magic {
            0% { opacity: 0; transform: scale(0); }
            15% { opacity: 1; transform: scale(1.5); }
            100% { opacity: 0; transform: scale(2); }
        }
        @keyframes shimmer-fast { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
        .animate-shimmer-fast { animation: shimmer-fast 1.5s infinite; }
        @keyframes wave { 0% { transform: rotate(0deg); } 10% { transform: rotate(14deg); } 20% { transform: rotate(-8deg); } 30% { transform: rotate(14deg); } 40% { transform: rotate(-4deg); } 50% { transform: rotate(10deg); } 60% { transform: rotate(0deg); } 100% { transform: rotate(0deg); } }
        .animate-wave { animation: wave 2s infinite; }
        @keyframes quick-pop { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-quick-pop { animation: quick-pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default App;