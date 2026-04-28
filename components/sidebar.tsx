"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Activity,
  Brain,
  Calendar,
  FileText,
  Heart,
  ImageIcon,
  MessageSquare,
  Stethoscope,
  AudioWaveform as Waveform,
  Watch,
  LayoutDashboard,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "symptom-checker", label: "Symptom Checker", icon: Stethoscope },
  { id: "disease-detection", label: "Disease Detection", icon: ImageIcon },
  { id: "health-risk", label: "Health Risk", icon: Heart },
  { id: "report-summarizer", label: "Report Summarizer", icon: FileText },
  { id: "doctor-assistant", label: "Doctor Assistant", icon: Calendar },
  { id: "transcription", label: "Transcription", icon: Waveform },
  { id: "mental-health", label: "Mental Health", icon: Brain },
  { id: "wearable", label: "Wearable Health", icon: Watch },
  { id: "telemedicine", label: "Telemedicine", icon: MessageSquare },
]

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await fetch("/api/auth/signout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col shadow-sm">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">HealthAI</h1>
            <p className="text-xs text-muted-foreground">Medical Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                activeSection === item.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </motion.button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-3">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
        >
          <LogOut className="w-4 h-4" />
          {loggingOut ? "Signing out…" : "Sign Out"}
        </button>
        <p className="text-xs text-muted-foreground text-center">
          ⚠️ For educational purposes only. Not a substitute for medical advice.
        </p>
      </div>
    </aside>
  )
}
