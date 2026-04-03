"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function InicioPage() {
  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl border-zinc-200 shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl text-zinc-900">Bem-vindo ao Coinnect</CardTitle>
          <CardDescription className="text-zinc-600">
            Login realizado com sucesso. Esta e sua pagina inicial.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">Voltar para login</Button>
          </Link>
          <Link href="/register" className="w-full">
            <Button className="w-full bg-zinc-900 text-white">Ir para cadastro</Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}