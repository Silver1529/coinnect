"use client"

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react"
import Cookie from "js-cookie"
import { useRouter } from "next/navigation"
import { api } from "@/services/api"
import { Camera, KeyRound, Moon, Save, ShieldCheck, Sparkles, Sun } from "lucide-react"

type ProfileResponse = {
  _id: string
  name: string
  email: string
  profileImageUrl: string
}

type UpdatePhotoResponse = {
  message: string
  user: {
    _id: string
    name: string
    email: string
    profileImageUrl: string
  }
}

type ChangePasswordResponse = {
  message: string
}

async function resizeImageToDataUrl(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Falha ao ler imagem"))
    reader.readAsDataURL(file)
  })

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Falha ao carregar imagem"))
    image.src = dataUrl
  })

  const maxSize = 320
  const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1)
  const width = Math.max(1, Math.round(img.width * ratio))
  const height = Math.max(1, Math.round(img.height * ratio))

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("Falha ao processar imagem")
  }

  context.drawImage(img, 0, 0, width, height)
  return canvas.toDataURL("image/jpeg", 0.82)
}

export default function SettingsPage() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [neverLogout, setNeverLogout] = useState(false)
  const [disableIntroAnimation, setDisableIntroAnimation] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isSavingPhoto, setIsSavingPhoto] = useState(false)
  const [isSavingPreferences, setIsSavingPreferences] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [name, setName] = useState("Usuario")
  const [email, setEmail] = useState("")
  const [profileImageUrl, setProfileImageUrl] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const token = Cookie.get("coinnect_token")
    const emailFromCookie = Cookie.get("coinnect_user_email")

    if (!token || !emailFromCookie) {
      router.push("/login")
      return
    }

    const theme = localStorage.getItem("coinnect_theme")
    const neverLogoutPreference = localStorage.getItem("coinnect_never_logout")
    const disableIntroPreference = localStorage.getItem("coinnect_disable_intro_animation")
    setIsDarkMode(theme === "dark")
    setNeverLogout(neverLogoutPreference === "true")
    setDisableIntroAnimation(disableIntroPreference === "true")

    api
      .post<ProfileResponse>("/users/profile", { email: emailFromCookie })
      .then((res) => {
        setName(res.data.name)
        setEmail(res.data.email)
        setProfileImageUrl(res.data.profileImageUrl || "")
        Cookie.set("coinnect_user_name", res.data.name, { expires: 7 })
        if (res.data.profileImageUrl) {
          Cookie.set("coinnect_profile_image", res.data.profileImageUrl, { expires: 7 })
        }
      })
      .catch(() => {
        setErrorMessage("Nao foi possivel carregar seu perfil.")
      })
      .finally(() => setIsLoadingProfile(false))
  }, [router])

  useEffect(() => {
    localStorage.setItem("coinnect_theme", isDarkMode ? "dark" : "light")
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  const syncAuthCookieExpiration = (days: number) => {
    const token = Cookie.get("coinnect_token")
    const userName = Cookie.get("coinnect_user_name")
    const userEmail = Cookie.get("coinnect_user_email")
    const profileImage = Cookie.get("coinnect_profile_image")

    if (token) Cookie.set("coinnect_token", token, { expires: days })
    if (userName) Cookie.set("coinnect_user_name", userName, { expires: days })
    if (userEmail) Cookie.set("coinnect_user_email", userEmail, { expires: days })
    if (profileImage) Cookie.set("coinnect_profile_image", profileImage, { expires: days })
  }

  const savePreferences = () => {
    setIsSavingPreferences(true)
    setMessage("")
    setErrorMessage("")

    try {
      localStorage.setItem("coinnect_never_logout", neverLogout ? "true" : "false")
      localStorage.setItem(
        "coinnect_disable_intro_animation",
        disableIntroAnimation ? "true" : "false",
      )

      syncAuthCookieExpiration(neverLogout ? 365 : 7)
      setMessage("Preferencias salvas com sucesso!")
    } catch {
      setErrorMessage("Nao foi possivel salvar suas preferencias.")
    } finally {
      setIsSavingPreferences(false)
    }
  }

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email) {
      return
    }

    setMessage("")
    setErrorMessage("")
    setIsChangingPassword(true)

    try {
      const response = await api.patch<ChangePasswordResponse>("/users/change-password", {
        email,
        currentPassword,
        newPassword,
      })

      setCurrentPassword("")
      setNewPassword("")
      setMessage(response.data.message)
    } catch {
      setErrorMessage("Erro ao alterar senha. Confira a senha atual.")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const themeClasses = useMemo(
    () =>
      isDarkMode
        ? {
            page: "bg-zinc-950 text-zinc-100",
            card: "border-zinc-800 bg-zinc-900",
            muted: "text-zinc-400",
            helper: "text-zinc-500",
            back: "border-zinc-700 hover:bg-zinc-800",
          }
        : {
            page: "bg-[#f5f4ef] text-zinc-900",
            card: "border-[#e8e4d8] bg-white",
            muted: "text-zinc-500",
            helper: "text-zinc-500",
            back: "border-zinc-300 hover:bg-zinc-100",
          },
    [isDarkMode],
  )

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !email) {
      return
    }

    setMessage("")
    setErrorMessage("")
    setIsSavingPhoto(true)

    try {
      const optimizedDataUrl = await resizeImageToDataUrl(file)
      const response = await api.patch<UpdatePhotoResponse>("/users/profile-photo", {
        email,
        profileImageUrl: optimizedDataUrl,
      })

      setProfileImageUrl(response.data.user.profileImageUrl || "")
      Cookie.set("coinnect_profile_image", response.data.user.profileImageUrl || "", {
        expires: 7,
      })
      setMessage("Foto atualizada e salva no banco com sucesso!")
    } catch {
      setErrorMessage("Erro ao salvar foto de perfil.")
    } finally {
      setIsSavingPhoto(false)
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f4ef] text-zinc-600">
        Carregando configuracoes...
      </div>
    )
  }

  return (
    <main className={`min-h-screen p-4 md:p-8 ${themeClasses.page}`}>
      <div className={`mx-auto max-w-3xl rounded-3xl border p-6 md:p-8 ${themeClasses.card}`}>
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className={`text-xs uppercase tracking-[0.24em] ${themeClasses.muted}`}>Configuracoes</p>
            <h1 className="mt-1 text-3xl font-bold">Sua conta</h1>
            <p className={`mt-1 text-sm ${themeClasses.helper}`}>
              Gerencie tema e foto de perfil com persistencia no banco.
            </p>
          </div>

          <button
            onClick={() => setIsDarkMode((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {isDarkMode ? "Modo claro" : "Modo escuro"}
          </button>
        </div>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr] md:items-center">
          <div className="mx-auto md:mx-0">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Foto de perfil"
                className="h-28 w-28 rounded-full object-cover ring-4 ring-amber-400/30"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-zinc-200 text-zinc-500">
                <Camera className="h-7 w-7" />
              </div>
            )}
          </div>

          <div>
            <p className="text-lg font-semibold">{name}</p>
            <p className={`text-sm ${themeClasses.helper}`}>{email}</p>

            <label
              htmlFor="profile-photo"
              className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-lg"
            >
              <Save className="h-4 w-4" />
              {isSavingPhoto ? "Salvando..." : "Trocar foto"}
            </label>
            <input
              id="profile-photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isSavingPhoto}
            />
            <p className={`mt-2 text-xs ${themeClasses.helper}`}>
              A imagem e redimensionada e salva no campo do usuario no MongoDB.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-200/70 p-5 dark:border-zinc-700">
          <p className="text-sm font-semibold">Preferencias da conta</p>
          <div className="mt-4 space-y-3">
            <label className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 p-3 dark:border-zinc-700">
              <span className="inline-flex items-center gap-2 text-sm">
                <ShieldCheck className="h-4 w-4" />
                Nunca deslogar
              </span>
              <input
                type="checkbox"
                checked={neverLogout}
                onChange={(e) => setNeverLogout(e.target.checked)}
                className="h-4 w-4"
              />
            </label>

            <label className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 p-3 dark:border-zinc-700">
              <span className="inline-flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4" />
                Nao exibir animacao inicial de abertura
              </span>
              <input
                type="checkbox"
                checked={disableIntroAnimation}
                onChange={(e) => setDisableIntroAnimation(e.target.checked)}
                className="h-4 w-4"
              />
            </label>
          </div>

          <button
            onClick={savePreferences}
            disabled={isSavingPreferences}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:shadow-lg disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {isSavingPreferences ? "Salvando..." : "Salvar preferencias"}
          </button>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-200/70 p-5 dark:border-zinc-700">
          <p className="inline-flex items-center gap-2 text-sm font-semibold">
            <KeyRound className="h-4 w-4" />
            Alterar senha
          </p>

          <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Senha atual"
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none ring-amber-400/40 transition focus:ring dark:border-zinc-700 dark:bg-zinc-950"
              required
            />

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nova senha"
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none ring-amber-400/40 transition focus:ring dark:border-zinc-700 dark:bg-zinc-950"
              required
              minLength={6}
            />

            <button
              type="submit"
              disabled={isChangingPassword}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-lg disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isChangingPassword ? "Atualizando..." : "Atualizar senha"}
            </button>
          </form>
        </section>

        {message ? <p className="mt-5 text-sm text-emerald-500">{message}</p> : null}
        {errorMessage ? <p className="mt-5 text-sm text-red-500">{errorMessage}</p> : null}

        <div className="mt-8">
          <button
            onClick={() => router.push('/dashboard')}
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${themeClasses.back}`}
          >
            Voltar para dashboard
          </button>
        </div>
      </div>
    </main>
  )
}
