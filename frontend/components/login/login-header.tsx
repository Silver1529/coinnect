"use client"
import { motion } from "framer-motion"
import { Coins } from "lucide-react"
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function LoginHeader() {
  return (
    <CardHeader className="space-y-1 flex flex-col items-center pb-8">
      <motion.div 
        className="rounded-full bg-zinc-900 p-4 mb-4 text-amber-400 shadow-lg"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Coins size={32} />
      </motion.div>
      <CardTitle className="text-3xl font-bold tracking-tight text-zinc-950">
        Acesse sua conta
      </CardTitle>
      <CardDescription className="text-center text-zinc-500 text-base">
        Entre para gerenciar o saldo da família
      </CardDescription>
    </CardHeader>
  )
}

export default LoginHeader