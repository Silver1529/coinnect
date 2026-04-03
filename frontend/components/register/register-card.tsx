"use client"

import { useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { UserPlus, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiRequest } from "@/lib/api"

type RegisterResponse = {
  message: string
  user: {
    _id: string
    name: string
    email: string
  }
}

export function RegisterCard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSuccessMessage("")
    setErrorMessage("")
    setIsLoading(true)

    try {
      const response = await apiRequest<RegisterResponse>("/users", {
        method: "POST",
        body: { name, email, password },
      })

      setSuccessMessage(response.message)
      setName("")
      setEmail("")
      setPassword("")

      setTimeout(() => {
        router.push("/")
      }, 1200)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Falha ao cadastrar")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-md z-10"
      whileHover={{ y: -4 }}
    >
      <Card className="relative overflow-hidden border border-white/40 bg-white/90 shadow-[0_35px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
        <span className="pointer-events-none absolute -right-16 top-[-4rem] h-56 w-56 rounded-full bg-amber-200/50 blur-3xl" />
        <span className="pointer-events-none absolute -left-20 bottom-[-3rem] h-64 w-64 rounded-full bg-amber-100/40 blur-3xl" />

        <CardHeader className="relative space-y-2 flex flex-col items-center pb-8">
          <motion.div
            className="relative mb-4"
            animate={{ scale: [1, 1.08, 1], rotate: [0, 4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="absolute inset-0 rounded-full bg-amber-400/30 blur-2xl" />
            <div className="relative rounded-full border border-amber-100/60 bg-gradient-to-br from-amber-400 to-amber-500 p-4 text-zinc-900 shadow-xl">
              <UserPlus size={32} />
            </div>
          </motion.div>

          <CardTitle className="text-3xl font-bold tracking-tight text-zinc-950">
            Criar conta
          </CardTitle>
          <CardDescription className="text-center text-zinc-500 text-base">
            Junte-se ao Coinnect e organize suas finanças com indicadores em tempo real
          </CardDescription>
          <div className="flex gap-2 text-[11px] uppercase tracking-[0.35em] text-amber-600">
            <span>Seguro</span>
            <span>Intuitivo</span>
            <span>Familiar</span>
          </div>
        </CardHeader>

        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                placeholder="Miguel da Silva"
                required
                className="h-12 border-zinc-200 focus-visible:ring-amber-500/50"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="miguel@email.com"
                required
                className="h-12 border-zinc-200 focus-visible:ring-amber-500/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                className="h-12 border-zinc-200 focus-visible:ring-amber-500/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {successMessage ? (
              <p className="text-sm text-emerald-600">{successMessage}</p>
            ) : null}
            {errorMessage ? (
              <p className="text-sm text-red-600">{errorMessage}</p>
            ) : null}
          </CardContent>

          <CardFooter className="pt-4 flex flex-col gap-5">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-700 hover:brightness-110 text-white font-semibold text-lg py-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Finalizar Cadastro"}
            </Button>
            <p className="text-xs text-zinc-400 text-center">
              Ao continuar você concorda com nossos termos de uso e políticas de privacidade.
            </p>
            
            <Link href="/" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 transition-colors">
              <ArrowLeft size={16} />
              Voltar para o login
            </Link>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}


export default RegisterCard