"use client";
import { useEffect, useState } from 'react';
import Cookie from 'js-cookie';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  Bell,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  Wallet,
  Users,
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; profileImageUrl?: string } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookie.get('coinnect_token');
    const userName = Cookie.get('coinnect_user_name');
    const profileImageUrl = Cookie.get('coinnect_profile_image');
    const savedTheme = localStorage.getItem('coinnect_theme');

    if (!token) {
      router.push('/login');
      return;
    }

    setIsDarkMode(savedTheme === 'dark');

    setUser({ name: userName || 'Usuario', profileImageUrl: profileImageUrl || '' });
  }, []);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f5f4ef]">
        <p className="text-base text-zinc-600">Carregando dashboard...</p>
      </div>
    );
  }

  const firstName = user.name.split(' ')[0];

  const pageClass = isDarkMode
    ? "min-h-screen bg-zinc-950 text-zinc-100 [font-family:'DM_Sans',sans-serif]"
    : "min-h-screen bg-[#f5f4ef] text-zinc-900 [font-family:'DM_Sans',sans-serif]";

  const panelClass = isDarkMode
    ? "border-zinc-800 bg-zinc-900"
    : "border-[#e8e4d8] bg-white/90";

  return (
    <div className={pageClass}>
      <div className="mx-auto flex max-w-7xl gap-6 p-4 md:p-6 lg:p-8">
        <aside className={`hidden w-72 shrink-0 rounded-3xl border p-6 shadow-[0_20px_60px_rgba(30,25,12,0.08)] md:block ${panelClass}`}>
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-[#1c1b16]">Coinnect</h1>
            <p className="mt-1 text-sm text-zinc-500">Painel financeiro familiar</p>
          </div>

          <nav className="space-y-2">
            <button className="flex w-full items-center gap-3 rounded-2xl bg-[#191913] px-4 py-3 text-left text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <LayoutDashboard className="h-4 w-4" />
              Inicio
            </button>
            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-zinc-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f4f2ea] hover:text-zinc-900 hover:shadow-sm dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
              <Wallet className="h-4 w-4" />
              Transacoes
            </button>
            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-zinc-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f4f2ea] hover:text-zinc-900 hover:shadow-sm dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
              <Users className="h-4 w-4" />
              Familia
            </button>
            <button
              onClick={() => router.push('/settings')}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-zinc-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f4f2ea] hover:text-zinc-900 hover:shadow-sm dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              <Settings className="h-4 w-4" />
              Configuracoes
            </button>
          </nav>

          <div className="mt-10 rounded-2xl border border-[#f1e8d1] bg-gradient-to-br from-[#fff6e8] to-[#fffdf8] p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-700">Status</p>
            <p className="mt-2 text-sm text-zinc-700">Conta verificada e sincronizada.</p>
          </div>
        </aside>

        <main className="flex-1">
          <header className={`rounded-3xl border p-5 shadow-[0_20px_60px_rgba(30,25,12,0.06)] backdrop-blur ${panelClass}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-amber-700">Dashboard</p>
                <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#1c1b16]">Ola, {firstName}</h2>
                <p className="mt-1 text-zinc-500">Seja bem-vindo ao seu painel financeiro.</p>
              </div>

              <div className="flex items-center gap-2">
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Foto de perfil"
                    className="h-11 w-11 rounded-xl object-cover ring-2 ring-amber-300/40"
                  />
                ) : null}
                <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#ece7d8] bg-[#fbfaf5] text-zinc-600 transition hover:text-zinc-900">
                  <Bell className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    Cookie.remove('coinnect_token');
                    Cookie.remove('coinnect_user_name');
                    Cookie.remove('coinnect_user_email');
                    Cookie.remove('coinnect_profile_image');
                    router.push('/login');
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1c1b16] px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:shadow-lg"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </div>
          </header>

          <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-[#e8e4d8] bg-white p-5 shadow-[0_16px_40px_rgba(30,25,12,0.05)]">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Saldo total</p>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-[#1d1b16]">C$ 1.500,00</h3>
              <p className="mt-2 inline-flex items-center gap-1 text-sm text-emerald-600">
                <ArrowUpRight className="h-4 w-4" />
                +4.8% este mes
              </p>
            </article>

            <article className="rounded-2xl border border-[#e8e4d8] bg-white p-5 shadow-[0_16px_40px_rgba(30,25,12,0.05)]">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Conexoes ativas</p>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-[#1d1b16]">12</h3>
              <p className="mt-2 text-sm text-zinc-500">4 novas conexoes esta semana</p>
            </article>

            <article className="rounded-2xl border border-[#f2e5c8] bg-gradient-to-br from-[#fff9ed] to-[#fffdf7] p-5 shadow-[0_16px_40px_rgba(30,25,12,0.05)]">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-700">Status da conta</p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#1d1b16]">Verificada</h3>
              <p className="mt-2 inline-flex items-center gap-1 text-sm text-amber-700">
                <Sparkles className="h-4 w-4" />
                Protecao e validacao ativas
              </p>
            </article>
          </section>

          <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border border-[#e8e4d8] bg-white p-6 shadow-[0_16px_40px_rgba(30,25,12,0.05)]">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Proxima meta</p>
              <h4 className="mt-2 text-xl font-semibold text-[#1d1b16]">Reserva familiar de emergencia</h4>
              <p className="mt-3 text-sm text-zinc-600">72% concluido. Faltam C$ 840,00 para bater a meta do trimestre.</p>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#f1eee3]">
                <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-amber-500 to-amber-300" />
              </div>
            </article>

            <article className="rounded-2xl border border-[#e8e4d8] bg-white p-6 shadow-[0_16px_40px_rgba(30,25,12,0.05)]">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Cartao principal</p>
              <div className="mt-4 rounded-2xl bg-gradient-to-br from-[#1d1c16] via-[#27251e] to-[#3f341f] p-5 text-white">
                <div className="flex items-start justify-between">
                  <p className="text-sm text-white/70">Coinnect Black</p>
                  <CreditCard className="h-5 w-5 text-amber-300" />
                </div>
                <p className="mt-8 text-lg tracking-[0.22em]">**** **** **** 6021</p>
                <p className="mt-2 text-xs text-white/70">Limite utilizado: 34%</p>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}