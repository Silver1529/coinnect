"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { WelcomeOverlay } from "@/components/login/welcome-overlay"
import { LoginHeader } from "@/components/login/login-header"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import Link from "next/link" // Importação crucial para navegar sem refresh
import { useRouter } from "next/navigation"
import { api } from "@/services/api"
import { LoginTransition } from "@/components/login/login-transition"
import axios from "axios"
import Cookie from "js-cookie"

type LoginResponse = {
  message: string
  token: string
  user: {
    _id: string
    name: string
    email: string
    profileImageUrl?: string
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [showWelcome, setShowWelcome] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isEntering, setIsEntering] = useState(false)
  const [loggedUserName, setLoggedUserName] = useState("")

  useEffect(() => {
    const disableIntroAnimation =
      localStorage.getItem("coinnect_disable_intro_animation") === "true"

    if (disableIntroAnimation) {
      setShowWelcome(false)
      return
    }

    const timer = setTimeout(() => setShowWelcome(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" as const, delay: 0.2 } 
    }
  }

  const handleLogin = async (data: { email: string; password: string }) => {
    setErrorMessage("")
    setSuccessMessage("")
    setIsLoading(true)

    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email: data.email,
        password: data.password,
      })

      const neverLogout = localStorage.getItem("coinnect_never_logout") === "true"
      const cookieDays = neverLogout ? 365 : 7

      console.log("Login realizado com sucesso!", response.data)
      Cookie.set("coinnect_token", response.data.token, { expires: cookieDays })
      Cookie.set("coinnect_user_name", response.data.user.name, { expires: cookieDays })
      Cookie.set("coinnect_user_email", response.data.user.email, { expires: cookieDays })
      Cookie.set("coinnect_profile_image", response.data.user.profileImageUrl || "", { expires: cookieDays })
      setSuccessMessage(`Bem-vindo, ${response.data.user.name}!`)
      setLoggedUserName(response.data.user.name)
      setIsEntering(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 1250)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Erro no login:", error.response?.data?.message)
        setErrorMessage(error.response?.data?.message || "E-mail ou senha incorretos.")
      } else {
        setErrorMessage("E-mail ou senha incorretos.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-50 p-4 overflow-hidden">
      <LoginTransition active={isEntering} userName={loggedUserName} />

      <AnimatePresence>
        {showWelcome && <WelcomeOverlay />}
      </AnimatePresence>

      <motion.div
        initial="hidden"
        animate={showWelcome ? "hidden" : "visible"}
        variants={cardVariants}
        className="w-full max-w-md z-10"
      >
        <Card className="border-zinc-200 shadow-2xl bg-white/95 backdrop-blur-sm">
          <LoginHeader />
          
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleLogin({ email, password })
            }}
          >
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  required
                  className="h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Senha</Label>
                <Input
                  type="password"
                  required
                  className="h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {successMessage ? <p className="text-sm text-emerald-600">{successMessage}</p> : null}
              {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
            </CardContent>

            <CardFooter className="pt-4 flex flex-col gap-4 text-center">
              <Button disabled={isLoading} className="w-full bg-zinc-950 text-white font-bold py-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
                {isLoading ? <Loader2 className="animate-spin" /> : "Entrar na conta"}
              </Button>

              {/* --- LINK PARA A PÁGINA DE CADASTRO --- */}
              <p className="text-sm text-zinc-500 mt-4 text-center">
                Ainda não tem conta?{" "}
                <Link
                  href="/register"
                  className="text-amber-600 font-semibold hover:underline"
                >
                  Cadastre-se agora
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}