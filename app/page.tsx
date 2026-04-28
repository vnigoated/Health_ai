"use client"

import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import {
  Activity, Brain, Heart, Shield, FileText, Mic, Smile,
  Watch, Video, ArrowRight, CheckCircle, Star,
  Users, Zap, Menu, X, MessageSquare, TrendingUp,
  Camera, Stethoscope, Pill, ChevronRight, Sparkles,
  Globe, Lock, BarChart3, Clock,
} from "lucide-react"

/* ─────────────────────────── helpers ─────────────────────────── */

function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef(false)
  const startCounter = () => {
    if (ref.current) return
    ref.current = true
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }
  return { count, startCounter }
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─────────────────────────── Nav ─────────────────────────── */

function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = ["Features", "How It Works", "Technology"]

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-slate-950/90 backdrop-blur-md border-b border-white/10 shadow-xl" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Health<span className="text-cyan-400">AI</span></span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-slate-300 hover:text-white text-sm font-medium transition-colors">{l}</a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/signin" className="text-sm text-slate-300 hover:text-white transition-colors font-medium">Sign In</Link>
          <Link href="/signup"
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white text-sm font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/25 flex items-center gap-1.5">
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-slate-950/95 backdrop-blur-md border-b border-white/10 px-6 pb-6 space-y-4">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setOpen(false)}
              className="block text-slate-300 hover:text-white text-sm font-medium py-2 transition-colors">{l}</a>
          ))}
          <Link href="/signup" className="block w-full text-center py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-sm font-semibold rounded-lg">
            Get Started Free
          </Link>
        </motion.div>
      )}
    </motion.nav>
  )
}

/* ─────────────────────────── Hero ─────────────────────────── */

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950 pt-16">
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-3xl" />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Healthcare Intelligence
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-6">
              AI-Powered<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400">
                Healthcare
              </span>
              <br />at Your Fingertips
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
              The most comprehensive AI healthcare platform — from symptom analysis and disease detection to
              telemedicine, mental health tracking, and smart medical record management.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/signup"
                className="group px-7 py-3.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold rounded-xl transition-all hover:shadow-xl hover:shadow-cyan-500/30 flex items-center justify-center gap-2 text-base">
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#how-it-works"
                className="px-7 py-3.5 border border-white/15 hover:border-white/30 text-white font-semibold rounded-xl transition-all hover:bg-white/5 flex items-center justify-center gap-2 text-base">
                See How It Works
              </a>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-400 text-sm">
              {["No credit card required", "Free to use", "HIPAA-ready design"].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right — floating UI cards */}
          <div className="hidden lg:block relative h-[540px]">
            {/* Main card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="absolute top-0 left-0 right-8 bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">AI Symptom Analysis</p>
                  <p className="text-slate-400 text-xs">Advanced AI Analysis</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {[["Headache", 92], ["Fever", 78], ["Fatigue", 65]].map(([label, val]) => (
                  <div key={label as string}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{label}</span>
                      <span className="text-cyan-400 font-semibold">{val}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${val}%` }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-3">
                <p className="text-teal-400 text-xs font-medium">✓ Recommendation generated</p>
                <p className="text-slate-300 text-xs mt-0.5">Rest, hydration &amp; follow-up in 48h</p>
              </div>
            </motion.div>

            {/* Risk card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="absolute bottom-24 right-0 w-56 bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-2xl p-4 shadow-xl">
              <p className="text-slate-400 text-xs mb-2 font-medium">Health Risk Score</p>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-3xl font-extrabold text-emerald-400">Low</span>
                <span className="text-slate-500 text-xs mb-1">risk</span>
              </div>
              {[["Diabetes", 12], ["Heart", 8], ["Stroke", 5]].map(([name, v]) => (
                <div key={name as string} className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">{name}</span>
                  <span className="text-emerald-400 font-semibold">{v}%</span>
                </div>
              ))}
            </motion.div>

            {/* Telemedicine badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="absolute bottom-2 left-4 bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-xl p-3 shadow-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                <Video className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Telemedicine</p>
                <p className="text-emerald-400 text-xs">● Session Active</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "50K+", label: "AI Diagnoses", icon: Brain },
            { value: "99.2%", label: "Accuracy Rate", icon: CheckCircle },
            { value: "24/7", label: "AI Availability", icon: Clock },
            { value: "9+", label: "Health Modules", icon: Zap },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Icon className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
              <div className="text-3xl font-extrabold text-white mb-1">{value}</div>
              <div className="text-slate-400 text-sm">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────── Features ─────────────────────────── */

const FEATURES = [
  { icon: Brain, color: "from-cyan-500 to-blue-500", bg: "bg-cyan-500/10 border-cyan-500/20",
    title: "AI Symptom Checker", desc: "Describe your symptoms and get instant AI-powered differential diagnosis with probability scores." },
  { icon: Camera, color: "from-violet-500 to-purple-600", bg: "bg-violet-500/10 border-violet-500/20",
    title: "Disease Detection", desc: "Upload X-rays, CT scans, or MRI images for AI radiologist-level analysis and classification." },
  { icon: BarChart3, color: "from-orange-400 to-red-500", bg: "bg-orange-500/10 border-orange-500/20",
    title: "Health Risk Prediction", desc: "Get your personalised diabetes, heart attack, and stroke risk assessment based on your vitals." },
  { icon: FileText, color: "from-emerald-400 to-teal-500", bg: "bg-emerald-500/10 border-emerald-500/20",
    title: "Report Summarizer", desc: "Upload PDF medical reports and get structured summaries — diagnosis, medications, and recommendations." },
  { icon: Stethoscope, color: "from-sky-400 to-cyan-500", bg: "bg-sky-500/10 border-sky-500/20",
    title: "Doctor Assistant", desc: "Complete CRUD management for doctors, patients, appointments, and consultation records." },
  { icon: Mic, color: "from-pink-500 to-rose-500", bg: "bg-pink-500/10 border-pink-500/20",
    title: "Medical Transcription", desc: "Upload audio recordings and get accurate clinical notes transcribed in seconds." },
  { icon: Smile, color: "from-yellow-400 to-orange-400", bg: "bg-yellow-500/10 border-yellow-500/20",
    title: "Mental Health Tracker", desc: "Track daily mood, get sentiment analysis, and visualise your mental wellbeing over time." },
  { icon: Watch, color: "from-indigo-400 to-purple-500", bg: "bg-indigo-500/10 border-indigo-500/20",
    title: "Wearable Integration", desc: "Monitor heart rate, blood oxygen, steps, and sleep quality from your wearable devices." },
  { icon: Video, color: "from-teal-400 to-emerald-500", bg: "bg-teal-500/10 border-teal-500/20",
    title: "Telemedicine Chat", desc: "Consult with an AI doctor in real time. Sessions are saved and WhatsApp/Jitsi integrated." },
]

function Features() {
  return (
    <section id="features" className="py-28 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold tracking-wide mb-4">
            <Zap className="w-3.5 h-3.5" /> 9 Powerful Modules
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Everything you need in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              one platform
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            From AI diagnostics to telemedicine — HealthAI brings together the entire spectrum of
            modern healthcare intelligence under one roof.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <FadeIn key={f.title} delay={Math.floor(i / 3) * 0.1 + (i % 3) * 0.05}>
                <div className="group relative p-6 rounded-2xl bg-slate-900/60 border border-white/8 hover:border-white/20 transition-all duration-300 hover:bg-slate-900/90 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30 h-full">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-cyan-400 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore feature <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── How It Works ─────────────────────────── */

function HowItWorks() {
  const STEPS = [
    { step: "01", icon: MessageSquare, color: "from-cyan-400 to-blue-500",
      title: "Describe Your Concern", desc: "Enter symptoms, upload images or audio, or simply chat with our AI — in plain language." },
    { step: "02", icon: Brain, color: "from-violet-400 to-purple-500",
      title: "AI Analyses Instantly", desc: "Our AI processes your input in seconds, cross-referencing millions of medical data points for accurate results." },
    { step: "03", icon: Heart, color: "from-emerald-400 to-teal-500",
      title: "Get Personalised Care", desc: "Receive detailed insights, risk scores, recommendations, and connect with a doctor through telemedicine." },
  ]

  return (
    <section id="how-it-works" className="py-28 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold tracking-wide mb-4">
            Simple Process
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">HealthAI</span> works
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            From concern to care in three simple steps — no medical training required.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-14 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-cyan-500/40 via-violet-500/40 to-emerald-500/40" />

          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <FadeIn key={s.step} delay={i * 0.15}>
                <div className="relative text-center p-8 rounded-2xl bg-slate-900/50 border border-white/8 hover:border-white/20 transition-all hover:-translate-y-1">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-black text-slate-600 bg-slate-950 px-2">
                    {s.step}
                  </div>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-6 shadow-xl`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── Technology ─────────────────────────── */

function Technology() {
  const TECH = [
    { icon: Brain, label: "Advanced AI Engine", desc: "State-of-the-art multimodal AI for text, image, and audio analysis — fast and accurate." },
    { icon: Shield, label: "Secure & Private", desc: "All data handled with HIPAA-ready design principles and end-to-end security." },
    { icon: Globe, label: "Scalable Database", desc: "Serverless, scalable, always-available database infrastructure." },
    { icon: Lock, label: "Secure Authentication", desc: "Account-based access with JWT sessions and encrypted credentials." },
    { icon: Zap, label: "Real-time Streaming", desc: "AI responses streamed instantly — no waiting, no timeouts." },
    { icon: TrendingUp, label: "Live Analytics", desc: "Dashboard charts built from live Neon DB data updated in real time." },
  ]

  return (
    <section id="technology" className="py-28 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl -translate-y-1/2" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Built on Cutting-Edge Tech
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Powered by the best{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">AI & infra</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            HealthAI is built on production-grade technology trusted by leading companies worldwide.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TECH.map((t, i) => {
            const Icon = t.icon
            return (
              <FadeIn key={t.label} delay={i * 0.07}>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-white/8 hover:border-white/20 transition-all hover:-translate-y-1 h-full">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/20 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-2">{t.label}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{t.desc}</p>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── Stats ─────────────────────────── */

function StatCard({ target, suffix, label, icon: Icon }: { target: number; suffix: string; label: string; icon: any }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const { count, startCounter } = useCounter(target, 1800)

  useEffect(() => { if (inView) startCounter() }, [inView])

  return (
    <div ref={ref} className="text-center p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-white/8">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-cyan-400" />
      </div>
      <div className="text-4xl font-extrabold text-white mb-1">{count.toLocaleString()}{suffix}</div>
      <div className="text-slate-400 text-sm">{label}</div>
    </div>
  )
}

function Stats() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard target={50000} suffix="+" label="AI Diagnoses Made" icon={Brain} />
            <StatCard target={99} suffix=".2%" label="Analysis Accuracy" icon={CheckCircle} />
            <StatCard target={10000} suffix="+" label="Patients Served" icon={Users} />
            <StatCard target={9} suffix="" label="Healthcare Modules" icon={Zap} />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

/* ─────────────────────────── CTA ─────────────────────────── */

function CTA() {
  return (
    <section className="py-28 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/60 via-slate-950 to-teal-950/60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <FadeIn>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cyan-500/30">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Start your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              AI health journey
            </span>{" "}
            today
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Join thousands who already use HealthAI for smarter, faster, and more accessible healthcare intelligence.
            No credit card. No setup. Just results.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup"
              className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold rounded-xl text-base transition-all hover:shadow-2xl hover:shadow-cyan-500/30 flex items-center gap-2">
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Free forever
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

/* ─────────────────────────── Footer ─────────────────────────── */

function Footer() {
  return (
    <footer className="border-t border-white/8 bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">Health<span className="text-cyan-400">AI</span></span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              AI-powered healthcare intelligence platform. Built for doctors, patients, and healthcare professionals.
            </p>
          </div>
          {[
            { title: "Product", links: ["Features", "How It Works", "Technology", "Dashboard"] },
            { title: "Modules", links: ["Symptom Checker", "Disease Detection", "Telemedicine", "Mental Health"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "HIPAA Notice", "Cookie Policy"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l}>
                    <Link href="/dashboard" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">© 2025 HealthAI. For educational purposes only — not a substitute for medical advice.</p>
          <p className="text-slate-600 text-xs">Built with advanced AI &amp; cloud infrastructure</p>
        </div>
        <div className="mt-6 text-center sm:text-left">
          <p className="text-slate-500 text-sm">
            Created by{" "}
            <a href="https://varun.sparkstudio.co.in/" target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Varun Inamdar
            </a>
            {" · "}
            <a href="https://piyush.sparkstudio.co.in/" target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Piyush Dhoka
            </a>
            {" · "}
            <a href="https://vedant.sparkstudio.co.in/" target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Vedant Pandhare
            </a>
            {" · "}
            <a href="https://www.linkedin.com/in/aadarshpathre/" target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Aadarsh Pathre
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ─────────────────────────── Page ─────────────────────────── */

export default function LandingPage() {
  return (
    <div className="bg-slate-950 antialiased">
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <Technology />
      <Stats />
      <CTA />
      <Footer />
    </div>
  )
}
