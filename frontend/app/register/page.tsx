"use client"

import { motion } from "framer-motion"
import { RegisterCard } from "@/components/register/register-card"

const floatingModals = [
  {
    id: "metas",
    title: "Metas inteligentes",
    description: "Planeje objetivos compartilhados e acompanhe cada conquista em tempo real.",
    verticalClass: "top-24",
    direction: "right" as const,
    duration: 28,
    delay: 0
  },
  {
    id: "familia",
    title: "Família conectada",
    description: "Distribua permissões e mantenha todos alinhados com alertas suaves.",
    verticalClass: "bottom-24",
    direction: "left" as const,
    duration: 25,
    delay: 2
  },
  {
    id: "seguranca",
    title: "Segurança ativa",
    description: "Criptografia ponta-a-ponta com monitoramento 24/7 para sua paz.",
    verticalClass: "top-1/3",
    direction: "right" as const,
    duration: 32,
    delay: 4
  }
] as const

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-white to-zinc-100">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,196,144,0.35),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.45),transparent_50%)]" />
        {floatingModals.map((modal) => (
          <FloatingModal key={modal.id} {...modal} />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 p-4">
        <RegisterCard />
      </div>
    </div>
  )
}

type FloatingModalProps = {
  title: string
  description: string
  verticalClass: string
  direction: "left" | "right"
  delay: number
  duration: number
}

function FloatingModal({ title, description, verticalClass, direction, delay, duration }: FloatingModalProps) {
  const travelX =
    direction === "right"
      ? ["-45vw", "-10vw", "30vw", "65vw"]
      : ["65vw", "30vw", "-10vw", "-45vw"]

  return (
    <motion.div
      className={`pointer-events-none absolute inset-x-0 ${verticalClass}`}
      style={{ willChange: "transform" }}
      initial={{ opacity: 0 }}
      animate={{ x: travelX, opacity: [0, 0.85, 0.85, 0] }}
      transition={{ delay, duration, repeat: Infinity, repeatType: "loop", ease: "linear", times: [0, 0.1, 0.9, 1] }}
      aria-hidden="true"
    >
      <div className="mx-auto w-60 rounded-2xl border border-white/30 bg-white/60 p-4 shadow-2xl backdrop-blur-md">
        <p className="text-[11px] uppercase tracking-[0.3em] text-amber-600 mb-2">{title}</p>
        <p className="text-sm text-zinc-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}