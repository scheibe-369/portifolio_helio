import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Code2, Database, Cpu, Layout, Terminal, Github,
  Linkedin, Mail, Twitter, X, ChevronRight, ExternalLink,
  Menu, Server, Bot, Layers
} from 'lucide-react';
import {
  useScroll, useTransform, motion, useSpring,
  AnimatePresence, useMotionValue, useMotionTemplate
} from 'framer-motion';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

// ─── Estatísticas ─────────────────────────────────────────────────────────────
const STATS = [
  { value: 60, suffix: '+', label: 'Alunos Mentoreados' },
  { value: 3, suffix: '+', label: 'Anos de Experiência em Vendas' },
  { value: 35, suffix: '%', label: 'Aumento médio em vendas' },
  { value: 42, suffix: '%', label: 'Tickets resolvidos com IA' },
];

// ─── Dados Mock ───────────────────────────────────────────────────────────────
const PORTFOLIO_DATA = {
  hero: {
    name: "Helio Monteiro",
    title: "Engenheiro de Software & Especialista em Automação",
    description: "Construo sistemas escaláveis, integrações complexas e produtos digitais com foco profundo em desempenho e inteligência artificial."
  },
  about: {
    text: [
      "Ao longo da minha trajetória, fundei e escalei mais de duas agências do zero e atuei diretamente em projetos com empresas como Horizon Company, Growth Hub, Goat, DG Comunicação e Fyre Solutions, desenvolvendo automações robustas e estruturando processos que escalaram operações inteiras.",
      "Meu trabalho envolve automações inteligentes, agentes de IA, SaaS e sites construídos com obsessão por qualidade e arquitetura escalável. Com ferramentas como n8n, Make, Zapier, Claude Code e Lovable, já desenvolvi desde landing pages e plataformas SaaS até sistemas de alta complexidade, da qualificação de vendas automatizada à geração de produtos personalizados com IA. Cada solução é feita pra performar de verdade.",
      "Além da atuação técnica, já formei mais de 60 alunos em uma mentoria orientada a resultados práticos, o que reforça tanto o domínio técnico quanto a capacidade de aplicar esse conhecimento em diferentes contextos de negócio.",
      "Não entrego o básico. Entrego o que o seu negócio precisa pra crescer sem travar. Se você quer um sistema que realmente trabalhe por você, é aqui que a conversa começa."
    ],
    specialties: ["Automação", "AI Agents", "APIs Rest/GraphQL", "Arquitetura Cloud"]
  },
  skills: [
    {
      category: "Frontend",
      icon: <Layout className="w-6 h-6" />,
      items: [
        { name: "React", level: 92 },
        { name: "Next.js", level: 85 },
        { name: "Tailwind CSS", level: 90 },
        { name: "TypeScript", level: 78 },
      ]
    },
    {
      category: "Backend",
      icon: <Server className="w-6 h-6" />,
      items: [
        { name: "Node.js", level: 88 },
        { name: "Python", level: 85 },
        { name: "Go", level: 72 },
        { name: "PostgreSQL", level: 80 },
        { name: "Redis", level: 75 },
      ]
    },
    {
      category: "AI & Automação",
      icon: <Bot className="w-6 h-6" />,
      items: [
        { name: "LangChain", level: 88 },
        { name: "OpenAI API", level: 92 },
        { name: "n8n / Make", level: 95 },
        { name: "Docker", level: 78 },
      ]
    },
    {
      category: "Arquitetura",
      icon: <Layers className="w-6 h-6" />,
      items: [
        { name: "Microserviços", level: 82 },
        { name: "AWS", level: 78 },
        { name: "CI/CD", level: 80 },
        { name: "System Design", level: 85 },
      ]
    }
  ],
  projects: [
    {
      id: "p1",
      title: "Plataforma de Automação de E-commerce",
      shortDescription: "Sistema automatizado para sincronização de inventário e precificação dinâmica usando IA.",
      problem: "O cliente perdia horas a atualizar preços manualmente em múltiplos marketplaces, resultando em perdas financeiras e stock desatualizado.",
      solution: "Desenvolvi um sistema distribuído em Python e Node.js que consome APIs dos marketplaces, analisa concorrência com IA e ajusta preços em tempo real.",
      result: "Aumento de 35% nas vendas e redução de 100% no trabalho manual de atualização de stock.",
      technologies: ["Python", "Node.js", "PostgreSQL", "AWS Lambda", "OpenAI API"],
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      category: "Backend & AI"
    },
    {
      id: "p2",
      title: "Dashboard Financeiro SaaS",
      shortDescription: "Aplicação web para visualização de métricas financeiras de startups em tempo real.",
      problem: "Startups tinham dificuldade em agregar dados de Stripe, bancos e software de contabilidade num único ecrã.",
      solution: "Criada uma SPA em React com Next.js, utilizando Tailwind para UI. O backend em Go processa milhões de transações diárias.",
      result: "Mais de 200 startups ativas na plataforma. Latência de carregamento de dashboard reduzida para < 800ms.",
      technologies: ["React", "Next.js", "Tailwind CSS", "Go", "GraphQL"],
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      category: "Fullstack"
    },
    {
      id: "p3",
      title: "Agente de Apoio ao Cliente",
      shortDescription: "Chatbot inteligente treinado na base de conhecimento da empresa para resolver tickets de nível 1.",
      problem: "Equipa de suporte sobrecarregada com questões repetitivas e tempo de resposta alto (> 24h).",
      solution: "Implementação de um pipeline RAG (Retrieval-Augmented Generation) integrando a documentação interna com LLMs.",
      result: "Resolução automática de 42% dos tickets. Tempo médio de resposta reduzido para 5 segundos.",
      technologies: ["LangChain", "Pinecone", "Python", "FastAPI"],
      thumbnail: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=800",
      category: "AI Agents"
    },
    {
      id: "p4",
      title: "Sistema de Inbound Marketing IA",
      shortDescription: "Plataforma que automatiza a jornada do lead desde a captura até a conversão com agentes de IA.",
      problem: "Empresas perdiam leads por falta de resposta rápida e qualificação manual demorada.",
      solution: "Integração de agentes n8n com APIs de WhatsApp e CRMs para atendimento instantâneo.",
      result: "Melhoria de 50% na taxa de conversão de leads frios.",
      technologies: ["n8n", "Make", "OpenAI", "Supabase"],
      thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
      category: "Automação"
    },
    {
      id: "p5",
      title: "SaaS de Gestão de Documentos IA",
      shortDescription: "Análise e extração de dados automática de contratos e documentos jurídicos.",
      problem: "Processamento manual exaustivo de centenas de documentos por dia.",
      solution: "Pipeline de OCR e LLMs para classificar e extrair campos específicos em segundos.",
      result: "Redução de 90% no tempo de triagem de documentos.",
      technologies: ["Python", "FastAPI", "React", "Anthropic API"],
      thumbnail: "https://images.unsplash.com/photo-1568992687345-26948abc431a?auto=format&fit=crop&q=80&w=800",
      category: "SaaS"
    },
    {
      id: "p6",
      title: "Workshop Mentoria Tech",
      shortDescription: "Plataforma de ensino onde compartilho conhecimento técnico e prático para novos desenvolvedores.",
      problem: "Muitos cursos focam apenas em teoria, deixando lacunas na aplicação prática em negócios.",
      solution: "Desenvolvimento de um ambiente de aprendizado focado em projetos reais e automações.",
      result: "Mais de 60 alunos formados com projetos reais no portfólio.",
      technologies: ["Next.js", "Strapi", "Stripe", "Clerk"],
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
      category: "Educação"
    }
  ],
  experience: [
    {
      company: "TechNova Solutions",
      role: "Senior Software Engineer",
      period: "2022 – Presente",
      description: "Lidero a equipa de backend na reestruturação da arquitetura legada para microserviços. Implementei pipelines de CI/CD que reduziram o tempo de deploy em 60%."
    },
    {
      company: "DataFlow Analytics",
      role: "Fullstack Developer",
      period: "2019 – 2022",
      description: "Desenvolvimento de dashboards interativos e APIs RESTful de alta performance. Criei o sistema de autenticação unificado da empresa."
    },
    {
      company: "StartupLab X",
      role: "Junior Developer",
      period: "2018 – 2019",
      description: "Criação de landing pages, manutenção de bases de dados MySQL e automação de relatórios diários em Python."
    }
  ],
  contacts: [
    { platform: "GitHub", url: "#", icon: <Github className="w-5 h-5" /> },
    { platform: "LinkedIn", url: "#", icon: <Linkedin className="w-5 h-5" /> },
    { platform: "Twitter", url: "#", icon: <Twitter className="w-5 h-5" /> },
    { platform: "Email", url: "mailto:hello@example.com", icon: <Mail className="w-5 h-5" /> }
  ]
};

// ─── Constantes ───────────────────────────────────────────────────────────────
const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#@$%&';

// ─── Hook: Typewriter ─────────────────────────────────────────────────────────
const useTypewriter = (text, speed = 28, startDelay = 900) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  return { displayed, done };
};

// ─── Hook: Text Scramble ──────────────────────────────────────────────────────
const useTextScramble = (text) => {
  const [displayText, setDisplayText] = useState('');
  const intervalRef = useRef(null);

  const scramble = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let iteration = 0;
    intervalRef.current = setInterval(() => {
      setDisplayText(
        text.split('').map((char, idx) => {
          if (char === ' ') return ' ';
          if (idx < Math.floor(iteration)) return char;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }).join('')
      );
      iteration += 0.4;
      if (Math.floor(iteration) >= text.length) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
      }
    }, 30);
  }, [text]);

  useEffect(() => {
    const t = setTimeout(scramble, 300);
    return () => {
      clearTimeout(t);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [scramble]);

  return { displayText, scramble };
};

// ─── Hook: CountUp ────────────────────────────────────────────────────────────
const useCountUp = (target, duration = 1800) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    let rafId;
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [started, target, duration]);

  return { count, ref };
};

// ─── Componentes ─────────────────────────────────────────────────────────────

// Reveal on scroll
const Reveal = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transform-gpu transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        } ${className}`}
      style={{ transitionDelay: `${delay}ms`, willChange: 'opacity, transform' }}
    >
      {children}
    </div>
  );
};

// Neon Badge
const NeonBadge = ({ children }) => (
  <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/30 backdrop-blur-sm">
    {children}
  </span>
);

// Section Heading
const SectionHeading = ({ title, subtitle }) => (
  <div className="mb-12 text-center md:text-left">
    <Reveal>
      <h2 className="text-3xl md:text-4xl font-bold font-sora text-white mb-3">{title}</h2>
      {subtitle && <p className="text-slate-400 text-lg max-w-2xl">{subtitle}</p>}
      <div className="h-1 w-24 bg-gradient-to-r from-primary via-secondary to-accent mt-4 rounded-full md:mx-0 mx-auto shadow-[0_0_20px_rgba(0,255,255,0.7)]" />
    </Reveal>
  </div>
);

// Timeline Point
const TimelinePoint = ({ progress, index, total }) => {
  const threshold = (index + 0.5) / total;
  const isPast = useTransform(progress, [threshold - 0.1, threshold], [0, 1]);
  const scale = useSpring(useTransform(isPast, [0, 1], [0.8, 1.2]), { stiffness: 300, damping: 20 });
  const opacity = useTransform(isPast, [0, 1], [0.3, 1]);
  const glowOpacity = useTransform(isPast, [0, 1], [0, 0.8]);

  return (
    <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 z-20 flex items-center justify-center">
      <motion.div style={{ opacity: glowOpacity, scale: 2 }} className="absolute w-6 h-6 bg-primary/20 blur-md rounded-full" />
      <motion.div style={{ scale, opacity }} className="w-4 h-4 rounded-full bg-dark border-2 border-primary shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
    </div>
  );
};

// ─── Feature A: Aurora Global com Scroll Morphing ─────────────────────────────
const GlobalAuroraBackground = ({ scrollProgress }) => {
  // Blob 1 — canto superior esquerdo
  const blob1Color = useTransform(
    scrollProgress,
    [0, 0.15, 0.35, 0.55, 0.72, 0.88, 1],
    ["#00FFFF", "#0066FF", "#7000FF", "#0066FF", "#00FFFF", "#7000FF", "#00FFFF"]
  );
  // Blob 2 — canto inferior direito
  const blob2Color = useTransform(
    scrollProgress,
    [0, 0.15, 0.35, 0.55, 0.72, 0.88, 1],
    ["#7000FF", "#00FFFF", "#0066FF", "#7000FF", "#0066FF", "#00FFFF", "#7000FF"]
  );
  // Blob 3 — centro
  const blob3Color = useTransform(
    scrollProgress,
    [0, 0.15, 0.35, 0.55, 0.72, 0.88, 1],
    ["#0066FF", "#7000FF", "#00FFFF", "#0066FF", "#7000FF", "#0066FF", "#00FFFF"]
  );

  const bg1 = useMotionTemplate`radial-gradient(circle at 20% 20%, ${blob1Color} 0%, transparent 55%)`;
  const bg2 = useMotionTemplate`radial-gradient(circle at 80% 75%, ${blob2Color} 0%, transparent 55%)`;
  const bg3 = useMotionTemplate`radial-gradient(circle at 50% 50%, ${blob3Color} 0%, transparent 55%)`;

  return (
    <>
      {/* Base escura fixa */}
      <div className="fixed inset-0 bg-[#010208] z-0" />

      {/* Camadas da Aurora */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        <motion.div className="absolute inset-0 aurora-1" style={{ background: bg1, filter: 'blur(80px)', opacity: 0.22 }} />
        <motion.div className="absolute inset-0 aurora-2" style={{ background: bg2, filter: 'blur(100px)', opacity: 0.18 }} />
        <motion.div className="absolute inset-0 aurora-3" style={{ background: bg3, filter: 'blur(120px)', opacity: 0.15 }} />
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
        />
      </div>
    </>
  );
};



// Magnetic Button
const MagneticButton = ({ children, href, className }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 200, damping: 20, mass: 0.5 });

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.35);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.a>
  );
};

// Skill Progress Bar
const SkillBar = ({ name, level, delay = 0 }) => {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let timeoutId;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutId = setTimeout(() => setWidth(level), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [level, delay]);

  return (
    <div ref={ref} className="mb-3 last:mb-0">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm text-gray-300 font-medium">{name}</span>
        <span className="text-xs text-primary font-mono">{level}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
        <div
          className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full shadow-[0_0_8px_rgba(0,255,255,0.4)] transition-[width] duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

// CountUp Stat Card
const StatCard = ({ value, suffix, label, delay = 0 }) => {
  const { count, ref } = useCountUp(value);
  return (
    <Reveal delay={delay}>
      <div ref={ref} className="glass-panel p-6 rounded-2xl text-center neon-border group hover:border-primary/40 transition-colors duration-300">
        <div className="text-4xl md:text-5xl font-bold font-sora text-gradient mb-2">
          {count}{suffix}
        </div>
        <p className="text-slate-400 text-sm">{label}</p>
      </div>
    </Reveal>
  );
};

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSection, setActiveSection] = useState('top');
  const [activeFilter, setActiveFilter] = useState('Todos');

  // Scroll da timeline
  const experienceRef = useRef(null);
  const timelineRef = useRef(null);
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"]
  });

  // Barra de progresso da página + aurora color source
  const { scrollYProgress: pageProgress } = useScroll();

  // Navbar scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section tracking
  useEffect(() => {
    const sectionIds = ['top', 'about', 'skills', 'projects', 'experience', 'contact'];
    const observers = sectionIds.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(obs => obs?.disconnect());
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = (selectedProject || mobileMenuOpen) ? 'hidden' : 'unset';
  }, [selectedProject, mobileMenuOpen]);

  // Hero hooks
  const { displayed: typewriterText, done: typingDone } = useTypewriter(PORTFOLIO_DATA.hero.description, 28, 900);
  const { displayText: scrambledName, scramble: rescramble } = useTextScramble(PORTFOLIO_DATA.hero.name);

  // Project filter
  const categories = ['Todos', ...new Set(PORTFOLIO_DATA.projects.map(p => p.category))];
  const filteredProjects = activeFilter === 'Todos'
    ? PORTFOLIO_DATA.projects
    : PORTFOLIO_DATA.projects.filter(p => p.category === activeFilter);

  const navLinks = [
    { name: "Sobre", href: "#about", id: "about" },
    { name: "Skills", href: "#skills", id: "skills" },
    { name: "Projetos", href: "#projects", id: "projects" },
    { name: "Experiência", href: "#experience", id: "experience" },
    { name: "Contacto", href: "#contact", id: "contact" },
  ];

  return (
    <div className="min-h-screen text-slate-300 font-inter selection:bg-primary/30 selection:text-white">

      {/* ── Background Unificado (Base escura + Aurora Global) ── */}
      <GlobalAuroraBackground scrollProgress={pageProgress} />

      {/* ── Scroll Progress Bar ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-accent z-[60] origin-left shadow-[0_0_8px_rgba(0,255,255,0.6)]"
        style={{ scaleX: pageProgress }}
      />

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'glass-panel py-3 border-b border-primary/20' : 'bg-transparent py-5'}`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center max-w-6xl">
          <a href="#top" className="text-2xl font-bold font-sora text-white flex items-center gap-2">
            <Code2 className="text-primary" />
            <span>Dev<span className="text-gradient">.</span>Portfolio</span>
          </a>

          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-300 relative group ${isActive ? 'text-primary' : 'hover:text-primary'}`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-[1px] bg-primary rounded-full transition-all duration-300 ${isActive ? 'w-full shadow-[0_0_8px_rgba(0,255,255,0.8)]' : 'w-0 group-hover:w-full'
                      }`}
                  />
                </a>
              );
            })}
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 glass-panel bg-dark/95 flex flex-col justify-center items-center"
          >
            <button className="absolute top-6 right-6 text-white" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-8 text-center">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-sora font-semibold text-white hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section id="top" className="relative min-h-screen flex items-center pt-20 overflow-hidden z-[2]">


        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="max-w-3xl">
            <Reveal delay={100}>
              <h2 className="text-primary font-medium tracking-wider mb-4 uppercase text-sm">Bem-vindo ao meu espaço</h2>
            </Reveal>

            <Reveal delay={200}>
              <h1 className="text-5xl md:text-7xl font-bold font-sora text-white mb-6 leading-tight">
                Olá, eu sou <br />
                <span
                  className="text-gradient font-mono cursor-default select-none"
                  onMouseEnter={rescramble}
                >
                  {scrambledName || PORTFOLIO_DATA.hero.name}
                </span>
              </h1>
            </Reveal>

            <Reveal delay={300}>
              <p className="text-xl md:text-2xl text-slate-300 mb-4 font-medium">
                {PORTFOLIO_DATA.hero.title}.
              </p>
              <p className="text-lg opacity-80 mb-8 min-h-[3.5rem] font-mono text-primary/80">
                {typewriterText}
                {!typingDone && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: "steps(1)" }}
                  >|</motion.span>
                )}
              </p>
            </Reveal>

            <Reveal delay={400} className="flex flex-wrap gap-4">
              <MagneticButton
                href="#projects"
                className="px-8 py-4 rounded-lg bg-transparent border border-primary text-primary font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:bg-primary/10 flex items-center gap-2"
              >
                Ver Projetos <ChevronRight className="w-5 h-5" />
              </MagneticButton>
              <MagneticButton
                href="#contact"
                className="px-8 py-4 rounded-lg bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/10"
              >
                Contactar-me
              </MagneticButton>
            </Reveal>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-80">
          <span className="text-xs uppercase tracking-widest mb-2 text-primary font-bold">Scroll</span>
          <div className="w-1 h-12 bg-gradient-to-b from-primary via-secondary to-transparent rounded-full shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
        </div>
      </section>



      {/* ══════════════════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════════════════ */}
      <section id="about" className="py-24 relative overflow-hidden z-[2]">

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading title="Sobre Mim" subtitle="O meu percurso e o que me motiva." />
              <div className="space-y-4 text-lg">
                {PORTFOLIO_DATA.about.text.map((paragraph, idx) => (
                  <Reveal key={idx} delay={idx * 100}>
                    <p>{paragraph}</p>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={400} className="mt-8">
                <h4 className="text-white font-medium mb-4">Especialidades:</h4>
                <div className="flex flex-wrap gap-3">
                  {PORTFOLIO_DATA.about.specialties.map(spec => (
                    <NeonBadge key={spec}>{spec}</NeonBadge>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal delay={300} className="relative">
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 border-2 border-secondary rounded-2xl transform translate-x-4 translate-y-4 opacity-50" />
                <div className="absolute inset-0 border-2 border-primary rounded-2xl transform -translate-x-4 -translate-y-4 opacity-50 z-0" />
                <img
                  src="/profile.jpg"
                  alt="Perfil"
                  className="rounded-2xl relative z-10 w-full h-full object-cover transition-all duration-500"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>



      {/* ══════════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 relative overflow-hidden z-[2]">

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {STATS.map((stat, idx) => (
              <StatCard key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} delay={idx * 100} />
            ))}
          </div>
        </div>
      </section>



      {/* ══════════════════════════════════════════════════════
          SKILLS
      ══════════════════════════════════════════════════════ */}
      <section id="skills" className="py-24 relative overflow-hidden z-[2]">

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <SectionHeading title="Skills Técnicas" subtitle="A minha caixa de ferramentas e tecnologias." />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {PORTFOLIO_DATA.skills.map((skillGroup, idx) => (
              <Reveal key={skillGroup.category} delay={idx * 150}>
                <div className="glass-panel p-6 rounded-2xl h-full neon-glow transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    {skillGroup.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-5">{skillGroup.category}</h3>
                  <div>
                    {skillGroup.items.map((item, itemIdx) => (
                      <SkillBar
                        key={item.name}
                        name={item.name}
                        level={item.level}
                        delay={idx * 100 + itemIdx * 100}
                      />
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bridge Skills → Projects ── */}
      {/* ══════════════════════════════════════════════════════
          PROJECTS
      ══════════════════════════════════════════════════════ */}
      <section id="projects" className="py-24 relative overflow-hidden z-[2]">
        <ContainerScroll
          titleComponent={
            <div className="flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-bold font-sora text-white mb-6">
                Projetos em <span className="text-gradient">Destaque</span>
              </h2>
              <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto text-center">
                Soluções construídas com obsessão por qualidade e arquitetura escalável.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border ${activeFilter === cat
                      ? 'bg-primary/20 text-primary border-primary/50 shadow-[0_0_12px_rgba(0,255,255,0.3)]'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:border-primary/30 hover:text-primary'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          }
        >
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-8 h-full">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <div
                    className="glass-panel rounded-2xl overflow-hidden cursor-pointer neon-glow transition-all duration-300 group flex flex-col h-full border border-white/5 hover:border-primary/30"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <NeonBadge>{project.category}</NeonBadge>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between bg-[#080C21]">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-3 font-sora group-hover:text-primary transition-colors line-clamp-1">{project.title}</h3>
                        <p className="text-sm text-slate-400 line-clamp-2 mb-4 group-hover:text-slate-300 transition-colors">
                          {project.shortDescription}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-wrap pt-2 border-t border-white/5">
                        {project.technologies.slice(0, 3).map(tech => (
                          <span key={tech} className="text-[11px] text-primary/70 font-mono">#{tech}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </ContainerScroll>
      </section>



      {/* ══════════════════════════════════════════════════════
          EXPERIENCE
      ══════════════════════════════════════════════════════ */}
      <section id="experience" className="py-24 relative overflow-hidden z-[2]" ref={experienceRef}>

        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <SectionHeading title="Trajetória Profissional" subtitle="A minha experiência ao longo dos anos." />

          <div className="relative mt-24" ref={timelineRef}>
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-[2px] bg-white/10 hidden md:block" />
            <motion.div
              style={{ scaleY: timelineProgress, originY: 0 }}
              className="absolute left-1/2 transform -translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-primary via-secondary to-accent hidden md:block z-0 shadow-[0_0_15px_rgba(0,255,255,0.4)]"
            />
            <div className="absolute left-4 h-full w-[2px] bg-white/10 md:hidden" />
            <motion.div
              style={{ scaleY: timelineProgress, originY: 0 }}
              className="absolute left-4 h-full w-[2px] bg-gradient-to-b from-primary via-secondary to-accent md:hidden z-0 shadow-[0_0_15px_rgba(0,255,255,0.4)]"
            />

            {PORTFOLIO_DATA.experience.map((exp, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className="mb-24 last:mb-0 relative flex flex-col md:flex-row items-center w-full">
                  <TimelinePoint progress={timelineProgress} index={idx} total={PORTFOLIO_DATA.experience.length} />
                  <Reveal delay={idx * 150} className={`w-full md:w-[45%] ${isEven ? 'md:mr-auto' : 'md:ml-auto'} pl-12 md:pl-0`}>
                    <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-primary/50 transition-colors duration-500">
                      <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20 uppercase tracking-widest">{exp.period}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 font-sora group-hover:text-primary transition-colors">{exp.role}</h3>
                      <h4 className="text-lg text-slate-400 mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        {exp.company}
                      </h4>
                      <p className="text-slate-300 leading-relaxed text-base italic">{exp.description}</p>
                    </div>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* ══════════════════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════════════════ */}
      <section id="contact" className="py-24 relative overflow-hidden z-[2]">

        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-bold font-sora text-white mb-6">Vamos Conversar?</h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              Estou sempre aberto a novos desafios e oportunidades de colaboração. Sinta-se à vontade para enviar uma mensagem.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {PORTFOLIO_DATA.contacts.map((contact, idx) => (
                <a
                  key={idx}
                  href={contact.url}
                  className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-white neon-glow transform hover:-translate-y-2 transition-all duration-300 group"
                  title={contact.platform}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="group-hover:text-primary transition-colors">{contact.icon}</div>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 border-t border-white/5 text-center relative z-[2]">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} {PORTFOLIO_DATA.hero.name}. Construído com foco no futuro.
        </p>
      </footer>

      {/* ══════════════════════════════════════════════════════
          MODAL DE PROJETO
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            key="modal-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-dark/90 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            />
            <motion.div
              key="modal-content"
              className="relative bg-panel w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl z-10"
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition-colors z-20 backdrop-blur-md"
                onClick={() => setSelectedProject(null)}
              >
                <X className="w-5 h-5" />
              </button>

              <img src={selectedProject.thumbnail} alt={selectedProject.title} className="w-full h-64 object-cover" />

              <div className="p-8">
                <div className="mb-6">
                  <NeonBadge>{selectedProject.category}</NeonBadge>
                  <h2 className="text-3xl font-bold text-white mt-4 font-sora">{selectedProject.title}</h2>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                      <Terminal className="w-5 h-5" /> O Desafio
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{selectedProject.problem}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                      <Cpu className="w-5 h-5" /> A Solução
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{selectedProject.solution}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                      <Database className="w-5 h-5" /> O Resultado
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{selectedProject.result}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Stack Tecnológica</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map(tech => (
                        <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-sm text-gray-200">{tech}</span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-6 border-t border-white/10 flex justify-end">
                    <a href="#" className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 text-primary font-medium border border-primary/30 hover:bg-primary/20 transition-colors">
                      <ExternalLink className="w-4 h-4" /> Visualizar Projeto
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
}
