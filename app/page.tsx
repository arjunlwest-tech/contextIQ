"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Shield, Mail, FileText, TrendingUp, Zap, ArrowRight, Check, Sparkles, Play, Star } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import { useScrollAnimation, useCountUp, useTypewriter, useMousePosition } from "@/lib/useScrollAnimation";
import { motion } from "framer-motion";

function AnimatedCounter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const { ref, count } = useCountUp(target, 2000);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

function FloatingCard({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotateX((y - 0.5) * -20);
    setRotateY((x - 0.5) * 20);
    setGlarePosition({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition({ x: 50, y: 50 });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${className} relative overflow-hidden`}
      style={{ 
        transformStyle: "preserve-3d", 
        perspective: "1000px",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
      }}
    >
      {/* Glare effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`
        }}
      />
      {children}
    </motion.div>
  );
}

function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function MagneticButton({ children, primary = false, href = "#", className = "" }: { children: React.ReactNode; primary?: boolean; href?: string; className?: string }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <Link href={href}>
      <motion.button
        ref={buttonRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        whileTap={{ scale: 0.95 }}
        className={`relative overflow-hidden px-8 py-4 rounded-xl font-medium text-base flex items-center gap-2 transition-all duration-300 group ${
          primary 
            ? "bg-gradient-to-r from-indigo to-indigo-dark text-white shadow-lg shadow-indigo/30 hover:shadow-indigo/50" 
            : "border border-border bg-surface text-text-secondary hover:text-text-primary hover:border-indigo/50"
        } ${className}`}
      >
        {/* Shimmer effect */}
        {primary && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            initial={{ x: "-200%" }}
            animate={isHovered ? { x: "200%" } : { x: "-200%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        )}
        <span className="relative z-10">{children}</span>
        {isHovered && primary && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10"
          >
            <Sparkles className="w-4 h-4" />
          </motion.span>
        )}
      </motion.button>
    </Link>
  );
}

function TypewriterText({ text, className = "" }: { text: string; className?: string }) {
  const { displayText, isTyping } = useTypewriter(text, 50, 500);
  return (
    <span className={className}>
      {displayText}
      {isTyping && <span className="animate-pulse">|</span>}
    </span>
  );
}

function LiveChurnCounter() {
  const [amount, setAmount] = useState(127500);
  useEffect(() => {
    const interval = setInterval(() => {
      setAmount(prev => prev + Math.floor(Math.random() * 2500) + 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <motion.span 
      key={amount}
      initial={{ scale: 1.1, color: "#10B981" }}
      animate={{ scale: 1, color: "#10B981" }}
      className="font-mono text-emerald text-4xl md:text-5xl font-bold"
    >
      ${amount.toLocaleString()}
    </motion.span>
  );
}


const features = [
  { icon: Shield, title: "Churn Prediction", desc: "AI monitors usage patterns, support sentiment, and engagement signals to predict churn before it happens — with 94% accuracy.", color: "from-red-500 to-orange-500", glow: "glow-red" },
  { icon: Mail, title: "Autonomous Outreach", desc: "Personalized emails drafted and sent by AI at the perfect moment. No human drafting, no delays, no missed windows.", color: "from-indigo-500 to-purple-500", glow: "glow-indigo" },
  { icon: FileText, title: "AI QBR Generation", desc: "Quarterly business reviews auto-generated with real metrics, wins, risks, and next steps. Ship-ready in seconds.", color: "from-amber-500 to-yellow-500", glow: "glow-amber" },
  { icon: TrendingUp, title: "Expansion Detection", desc: "AI spots upsell and cross-sell opportunities from usage patterns — before the customer even asks.", color: "from-emerald-500 to-teal-500", glow: "glow-emerald" },
];

const plans = [
  { name: "Starter", price: "$2,500", period: "/mo", features: ["Up to 50 customers", "Churn prediction", "Autonomous emails", "1 integration"], cta: "Start free trial", popular: false },
  { name: "Growth", price: "$5,000", period: "/mo", features: ["Up to 250 customers", "All Starter features", "AI QBR generation", "Expansion detection", "5 integrations", "Playbook builder"], cta: "Start free trial", popular: true },
  { name: "Enterprise", price: "Custom", period: "", features: ["Unlimited customers", "All Growth features", "Custom playbooks", "Dedicated AI tuning", "SSO & SAML", "SLA guarantee"], cta: "Contact sales", popular: false },
];

const logos = [
  { name: "Stripe", icon: "S" },
  { name: "Linear", icon: "L" },
  { name: "Vercel", icon: "▲" },
  { name: "Notion", icon: "N" },
  { name: "Figma", icon: "F" },
  { name: "Loom", icon: "O" },
];

function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-indigo to-emerald z-50 transition-all duration-100" style={{ width: `${scrollProgress}%` }} />
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base noise relative overflow-x-hidden">
      <ScrollProgress />
      <ParticleBackground />

      {/* Floating Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ 
            y: [0, -30, 0], 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-72 bg-indigo/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            y: [0, 20, 0], 
            scale: [1, 1.2, 1],
            rotate: [0, -5, 0] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-40 right-20 w-96 h-96 bg-emerald/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            y: [0, -20, 0], 
            x: [0, 10, 0] 
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-40 left-1/3 w-80 h-80 bg-amber/10 rounded-full blur-3xl"
        />
      </div>

      {/* Nav */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-0 w-full z-50 border-b border-border/50 bg-base/60 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg shadow-gold/20">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg leading-tight">repulsora</span>
              <span className="text-[10px] tracking-[0.2em] text-gold uppercase font-medium">by Vantage Suites</span>
            </div>
          </motion.div>
          <div className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
            {["Features", "Pricing", "Docs"].map((item, i) => (
              <motion.a 
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative hover:text-text-primary transition-colors"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                {item}
              </motion.a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Log in</Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/signup" className="bg-indigo hover:bg-indigo-dark text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-indigo/30 hover:shadow-indigo/50">Get started</Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border glass text-xs text-text-secondary mb-8 hover:border-indigo/50 transition-colors cursor-pointer group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse-dot group-hover:animate-ping" />
            <span className="group-hover:text-text-primary transition-colors">AI agents active for <span className="text-indigo font-semibold">2,400+</span> companies</span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            Your entire CS team.
            <br />
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="gradient-text text-glow"
            >
              Automated.
            </motion.span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            <TypewriterText text="AI agents that monitor usage, predict churn, send personalized emails, auto-generate QBRs, and execute renewal workflows — without human intervention." />
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <MagneticButton primary href="/signup">
              Connect your stack — free
            </MagneticButton>
            <motion.a 
              href="#features" 
              whileHover={{ scale: 1.02, borderColor: "#6366F1" }}
              whileTap={{ scale: 0.98 }}
              className="border border-border text-text-secondary hover:text-text-primary px-8 py-4 rounded-xl font-medium text-base transition-all flex items-center gap-2 group"
            >
              <Play className="w-4 h-4 group-hover:text-indigo transition-colors" />
              See how it works
            </motion.a>
          </motion.div>

          {/* 3D Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 60, rotateX: 15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-4xl mx-auto relative perspective-1000"
          >
            <motion.div 
              className="border border-border rounded-2xl bg-surface p-2 shadow-2xl shadow-indigo/10 hover:shadow-indigo/20 transition-shadow duration-500"
              whileHover={{ rotateX: 5, rotateY: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="rounded-xl bg-base p-6">
                <div className="flex items-center gap-2 mb-4">
                  <motion.div whileHover={{ scale: 1.2 }} className="w-3 h-3 rounded-full bg-danger/50 hover:bg-danger transition-colors" />
                  <motion.div whileHover={{ scale: 1.2 }} className="w-3 h-3 rounded-full bg-amber/50 hover:bg-amber transition-colors" />
                  <motion.div whileHover={{ scale: 1.2 }} className="w-3 h-3 rounded-full bg-emerald/50 hover:bg-emerald transition-colors" />
                  <span className="ml-3 text-xs text-text-muted font-mono">app.repulsora.ai/dashboard</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "PORTFOLIO HEALTH", value: "62", color: "emerald", width: "62%" },
                    { label: "MRR AT RISK", value: "$35.7K", color: "amber", sub: "↑ 3 customers flagged", subColor: "danger" },
                    { label: "EXPANSION", value: "$48.2K", color: "emerald", sub: "2 opportunities detected", subColor: "emerald" },
                  ].map((card, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="bg-surface rounded-xl p-4 text-left border border-border/50 hover:border-border transition-all"
                    >
                      <p className="text-[10px] text-text-muted mb-1 font-mono">{card.label}</p>
                      <motion.p 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1 + i * 0.1, type: "spring", stiffness: 200 }}
                        className={`text-3xl font-bold text-${card.color} font-mono`}
                      >
                        {card.value}
                      </motion.p>
                      {card.width && (
                        <div className="mt-2 w-full h-2 bg-surface-light rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: card.width }}
                            transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                            className={`h-full bg-${card.color} rounded-full`}
                          />
                        </div>
                      )}
                      {card.sub && <p className={`text-xs text-${card.subColor} mt-1`}>{card.sub}</p>}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Floating decorative elements */}
            <motion.div 
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -right-8 top-10 w-16 h-16 bg-indigo/20 rounded-2xl blur-sm hidden lg:block"
            />
            <motion.div 
              animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute -left-4 bottom-20 w-12 h-12 bg-emerald/20 rounded-xl blur-sm hidden lg:block"
            />
          </motion.div>
        </div>
      </section>

      {/* Live Counter */}
      <section className="py-12 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-text-muted text-sm mb-2 font-mono">CHURN PREVENTED THIS WEEK</p>
          <LiveChurnCounter />
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: 31, suffix: "%", label: "Avg churn reduction", icon: TrendingUp, color: "emerald" },
            { value: 94, suffix: "%", label: "Prediction accuracy", icon: Shield, color: "indigo" },
            { value: 2400, suffix: "+", label: "Companies protected", icon: Check, color: "amber" },
            { value: 12, suffix: "min", label: "Avg time to action", icon: Zap, color: "danger" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="text-center group cursor-default"
            >
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-${stat.color}/10 flex items-center justify-center group-hover:bg-${stat.color}/20 transition-colors`}
              >
                <stat.icon className={`w-6 h-6 text-${stat.color}`} />
              </motion.div>
              <p className="font-heading text-4xl md:text-5xl font-bold text-text-primary group-hover:text-indigo transition-colors">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-text-muted text-sm mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <RevealSection className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-xs font-mono text-indigo mb-4 block"
            >
              POWERFUL FEATURES
            </motion.span>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              AI that <span className="gradient-text">acts</span>,<br />
              not just analyzes
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Every feature is designed to take autonomous action — not just surface insights that gather dust in a dashboard.
            </p>
          </RevealSection>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="gradient-border rounded-xl p-6 bg-surface group cursor-pointer"
              >
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg`}
                >
                  <f.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="font-heading text-xl font-semibold mb-3 group-hover:text-indigo transition-colors">{f.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
                <motion.div 
                  initial={{ x: -10, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 flex items-center gap-2 text-xs text-indigo opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Learn more <ArrowRight className="w-3 h-3" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-6 border-y border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-mono text-text-muted mb-12"
          >
            TRUSTED BY TEAMS AT
          </motion.p>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mb-20">
            {logos.map((logo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                className="flex items-center gap-2 text-text-muted/40 hover:text-text-muted/80 transition-all cursor-default"
              >
                <span className="text-2xl font-bold">{logo.icon}</span>
                <span className="font-heading text-xl font-bold">{logo.name}</span>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-2xl mx-auto border border-border rounded-2xl bg-surface p-8 text-left relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo/5 to-emerald/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Star className="w-5 h-5 text-amber mb-4 fill-amber" />
                <Star className="w-5 h-5 text-amber mb-4 fill-amber -mt-8 ml-6" />
                <Star className="w-5 h-5 text-amber mb-4 fill-amber -mt-8 ml-12" />
              </motion.div>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                &ldquo;repulsora replaced our 3-person CS team. We went from reacting to churn after it happened to preventing it before the customer even knew they were at risk. Our retention went from 87% to 96%.&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo to-indigo-dark flex items-center justify-center text-white font-bold"
                >
                  SL
                </motion.div>
                <div>
                  <p className="text-sm font-medium">Sarah Liu</p>
                  <p className="text-xs text-text-muted">VP Customer Success, Dataflow</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealSection className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-xs font-mono text-emerald mb-4 block"
            >
              PRICING
            </motion.span>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Simple, <span className="gradient-text">transparent</span> pricing
            </h2>
            <p className="text-text-secondary text-lg">Start free. Scale when you&apos;re ready.</p>
          </RevealSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto perspective-1000">
            {plans.map((plan, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ 
                  y: -10, 
                  rotateY: plan.popular ? 0 : 5,
                  rotateX: plan.popular ? 0 : -2,
                  scale: 1.02
                }}
                className={`border rounded-2xl p-8 bg-surface relative overflow-hidden group ${plan.popular ? "border-indigo glow-indigo" : "border-border hover:border-border-light"}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo to-indigo-light text-white text-xs font-mono py-2 text-center">
                    MOST POPULAR
                  </div>
                )}
                <div className={plan.popular ? "pt-6" : ""}>
                  <h3 className="font-heading text-2xl font-semibold mb-2 group-hover:text-indigo transition-colors">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold font-mono">{plan.price}</span>
                    <span className="text-text-muted text-sm">{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((f, j) => (
                      <motion.li 
                        key={j}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + j * 0.1 }}
                        className="flex items-center gap-3 text-sm text-text-secondary"
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                          className="w-5 h-5 rounded-full bg-emerald/20 flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-emerald" />
                        </motion.div>
                        {f}
                      </motion.li>
                    ))}
                  </ul>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/signup" className={`block text-center py-3 rounded-xl text-sm font-medium transition-all ${plan.popular ? "bg-gradient-to-r from-indigo to-indigo-light text-white shadow-lg shadow-indigo/30 hover:shadow-indigo/50" : "border border-border hover:border-indigo text-text-secondary hover:text-indigo"}`}>
                      {plan.cta}
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo/5 via-transparent to-transparent pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo to-indigo-light flex items-center justify-center shadow-lg shadow-indigo/30"
          >
            <Zap className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Stop losing customers
            <br />
            <span className="gradient-text">to slow response</span>
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-xl mx-auto">
            Your AI CS team deploys in minutes. Connect your stack, and repulsora starts acting immediately.
          </p>
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            whileHover={{ scale: 1.02 }}
          >
            <GlowButton primary href="/signup" className="text-lg px-10 py-5">
              Connect your stack — free
            </GlowButton>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-xs text-text-muted mt-6"
          >
            No credit card required • 14-day free trial • Cancel anytime
          </motion.p>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-t border-border py-16 px-6 relative"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <motion.div 
                className="flex items-center gap-3 mb-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg shadow-gold/20">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-xl leading-tight">repulsora</span>
                  <span className="text-[10px] tracking-[0.2em] text-gold uppercase font-medium">by Vantage Suites</span>
                </div>
              </motion.div>
              <p className="text-text-muted text-sm max-w-xs leading-relaxed">
                The autonomous customer success platform that replaces your entire CS team with AI.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                {["Features", "Pricing", "Integrations", "API"].map(item => (
                  <li key={item}>
                    <motion.a 
                      href="#" 
                      className="hover:text-text-primary transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li>
                  <motion.a 
                    href="mailto:vantagesuitesofficial@gmail.com" 
                    className="hover:text-text-primary transition-colors"
                    whileHover={{ x: 2 }}
                  >
                    vantagesuitesofficial@gmail.com
                  </motion.a>
                </li>
                <li>
                  <motion.a 
                    href="https://instagram.com/vantagesuites" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-text-primary transition-colors"
                    whileHover={{ x: 2 }}
                  >
                    @vantagesuites
                  </motion.a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-text-muted text-xs">&copy; 2026 repulsora. All rights reserved.</p>
            <div className="flex items-center gap-6 text-xs text-text-muted">
              {["Privacy", "Terms", "Security"].map(item => (
                <motion.a 
                  key={item}
                  href="#" 
                  className="hover:text-text-primary transition-colors"
                  whileHover={{ y: -1 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
