"use client"

import { AnimatePresence, motion } from "framer-motion"

type LoginTransitionProps = {
  active: boolean
  userName?: string
}

export function LoginTransition({ active, userName }: LoginTransitionProps) {
  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[120] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(253,186,116,0.16),transparent_48%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.12),transparent_44%),radial-gradient(circle_at_50%_80%,rgba(251,191,36,0.12),transparent_52%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          <motion.div
            className="absolute left-[-12%] top-[-18%] h-[24rem] w-[24rem] rounded-full bg-amber-200/20 blur-3xl"
            initial={{ opacity: 0, x: -20, y: -14 }}
            animate={{ opacity: [0.2, 0.5, 0.25], x: [0, 28, 8], y: [0, 14, 4] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute right-[-10%] bottom-[-24%] h-[25rem] w-[25rem] rounded-full bg-white/12 blur-3xl"
            initial={{ opacity: 0, x: 20, y: 18 }}
            animate={{ opacity: [0.15, 0.38, 0.2], x: [0, -24, -6], y: [0, -16, -4] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <motion.div
              className="w-[min(90vw,34rem)] rounded-3xl border border-white/20 bg-white/12 px-7 py-6 shadow-[0_18px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
            >
              <p className="text-center text-[10px] uppercase tracking-[0.34em] text-amber-200/90">
                acesso autorizado
              </p>
              <p className="mt-2 text-center text-2xl font-semibold tracking-tight text-white">
                {userName ? `Bem-vindo, ${userName}` : "Entrando..."}
              </p>

              <div className="mt-5 h-[5px] overflow-hidden rounded-full bg-white/20">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-amber-300 via-amber-200 to-white"
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              <p className="mt-3 text-center text-xs text-white/80">Preparando sua area inicial...</p>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default LoginTransition