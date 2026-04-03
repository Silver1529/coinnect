"use client"
import { motion } from "framer-motion"
import { Coins } from "lucide-react"

export function WelcomeOverlay() {
  return (
    <motion.div
      key="welcome-overlay"
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" as const } }}
    >
      <motion.div
        className="flex items-center gap-3 mb-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Coins className="h-12 w-12 text-amber-400" />
        <h1 className="text-5xl font-bold tracking-tighter">Coinnect</h1>
      </motion.div>
      <motion.p
        className="text-xl text-zinc-400 font-light"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        O futuro das suas finanças começa aqui.
      </motion.p>
    </motion.div>
  )
}

export default WelcomeOverlay