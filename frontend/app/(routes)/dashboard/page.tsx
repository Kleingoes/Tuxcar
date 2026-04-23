'use client';
// app/dashboard/page.tsx
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/admin';
import Navbar from '@/components/navbar';
import { Car, FileText, MessageSquare, Plus, ShieldX, Loader2 } from 'lucide-react';
import TabVehiculos from './tab-vehiculos';
import TabCotizaciones from './tab-cotizaciones';
import TabLeads from './tab-leads';
import FormNuevoVehiculo from './form-nuevo-vehiculo';

type Tab = 'vehiculos' | 'cotizaciones' | 'leads' | 'nuevo';

const TABS = [
  { id: 'vehiculos'    as Tab, label: 'Vehículos',    Icon: Car },
  { id: 'cotizaciones' as Tab, label: 'Cotizaciones',  Icon: FileText },
  { id: 'leads'        as Tab, label: 'Contactos',     Icon: MessageSquare },
];

export default function DashboardPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('vehiculos');

  const email = user?.primaryEmailAddress?.emailAddress ?? '';
  const esAdmin = isAdmin(email);

  // Cargando
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  // No logueado
  if (!isSignedIn) {
    router.push('/sign-in');
    return null;
  }

  // No es admin
  if (!esAdmin) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-32 text-center">
          <div className="w-14 h-14 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mx-auto mb-6">
            <ShieldX size={22} strokeWidth={1} className="text-zinc-400" />
          </div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Acceso restringido</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
            Este panel es exclusivo para administradores. Si necesitas acceso, contacta al equipo de Tuxcar.
          </p>
          <button onClick={() => router.push('/')}
            className="text-sm text-zinc-400 underline underline-offset-4 hover:text-zinc-600 transition-colors">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // ── Panel admin ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-2">
              Panel administrativo
            </p>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Bienvenido, {user.firstName ?? 'Admin'}
            </h1>
          </div>
          {tab !== 'nuevo' && (
            <button onClick={() => setTab('nuevo')}
              className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors">
              <Plus size={15} strokeWidth={2} />
              Nuevo vehículo
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 border-b border-zinc-100 dark:border-zinc-800">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px
                ${tab === id
                  ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white'
                  : 'border-transparent text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'}`}>
              <Icon size={15} strokeWidth={1.5} />
              {label}
            </button>
          ))}
          {tab === 'nuevo' && (
            <span className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white -mb-px">
              <Plus size={15} strokeWidth={1.5} />
              Nuevo vehículo
            </span>
          )}
        </div>

        {/* Contenido */}
        {tab === 'vehiculos'    && <TabVehiculos />}
        {tab === 'cotizaciones' && <TabCotizaciones />}
        {tab === 'leads'        && <TabLeads />}
        {tab === 'nuevo'        && <FormNuevoVehiculo onSuccess={() => setTab('vehiculos')} />}
      </main>
    </div>
  );
}