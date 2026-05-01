'use client';
// app/(routes)/dashboard/page.tsx
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { getUserRole, isStaff, isSuperAdmin } from '@/lib/admin';
import Navbar from '@/components/navbar';
import { Car, FileText, MessageSquare, Plus, ShieldX, Loader2, Cog } from 'lucide-react';
import TabVehiculos from './tab-vehiculos';
import TabCotizaciones from './tab-cotizaciones';
import TabLeads from './tab-leads';
import TabRefacciones from './tab-refacciones';
import FormNuevoVehiculo from './form-nuevo-vehiculo';
import FormNuevaRefaccion from './form-nueva-refaccion';

type Tab = 'vehiculos' | 'cotizaciones' | 'leads' | 'refacciones' | 'nuevo_vehiculo' | 'nueva_refaccion';

export default function DashboardPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('vehiculos');

  const email = user?.primaryEmailAddress?.emailAddress ?? '';
  const esStaff_ = isStaff(email);
  const esSuperAdmin = isSuperAdmin(email);

  const TABS: { id: Tab; label: string; Icon: any }[] = [
    { id: 'vehiculos',    label: 'Vehículos',    Icon: Car },
    { id: 'refacciones',  label: 'Refacciones',  Icon: Cog },
    { id: 'cotizaciones', label: 'Cotizaciones', Icon: FileText },
    { id: 'leads',        label: 'Contactos',    Icon: MessageSquare },
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-zinc-600" />
      </div>
    );
  }

  if (!isSignedIn) {
    router.push('/sign-in');
    return null;
  }

  if (!esStaff_) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-32 text-center">
          <div className="w-14 h-14 border border-zinc-800 flex items-center justify-center mx-auto mb-6">
            <ShieldX size={22} strokeWidth={1} className="text-zinc-600" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Acceso restringido</h1>
          <p className="text-zinc-500 text-sm mb-6">
            Este panel es exclusivo para el equipo de Tuxcar. Si necesitas acceso, contacta al administrador.
          </p>
          <button onClick={() => router.push('/')}
            className="text-sm text-zinc-600 underline underline-offset-4 hover:text-zinc-400 transition-colors">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const rolLabel = esSuperAdmin ? 'Super Administrador' : 'Empleado';
  const isFormTab = tab === 'nuevo_vehiculo' || tab === 'nueva_refaccion';

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[11px] font-semibold tracking-[0.35em] uppercase text-amber-600">
                Panel administrativo
              </p>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 ${
                esSuperAdmin
                  ? 'bg-amber-600/10 text-amber-500 border border-amber-600/20'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}>
                {rolLabel}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white">
              Bienvenido, {user.firstName ?? 'Usuario'}
            </h1>
          </div>
          {!isFormTab && (
            <div className="flex gap-2">
              <button onClick={() => setTab('nuevo_vehiculo')}
                className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-amber-500 transition-colors">
                <Plus size={14} strokeWidth={2} />
                Nuevo vehículo
              </button>
              <button onClick={() => setTab('nueva_refaccion')}
                className="inline-flex items-center gap-2 bg-zinc-800 text-zinc-300 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-zinc-700 border border-zinc-700 transition-colors">
                <Plus size={14} strokeWidth={2} />
                Nueva refacción
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 mb-8 border-b border-zinc-800 overflow-x-auto">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap
                ${tab === id
                  ? 'border-amber-600 text-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
              <Icon size={15} strokeWidth={1.5} />
              {label}
            </button>
          ))}
          {tab === 'nuevo_vehiculo' && (
            <span className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-amber-600 text-white -mb-px whitespace-nowrap">
              <Plus size={15} strokeWidth={1.5} />
              Nuevo vehículo
            </span>
          )}
          {tab === 'nueva_refaccion' && (
            <span className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-amber-600 text-white -mb-px whitespace-nowrap">
              <Plus size={15} strokeWidth={1.5} />
              Nueva refacción
            </span>
          )}
        </div>

        {tab === 'vehiculos'       && <TabVehiculos esSuperAdmin={esSuperAdmin} />}
        {tab === 'refacciones'     && <TabRefacciones esSuperAdmin={esSuperAdmin} />}
        {tab === 'cotizaciones'    && <TabCotizaciones esSuperAdmin={esSuperAdmin} />}
        {tab === 'leads'           && <TabLeads esSuperAdmin={esSuperAdmin} />}
        {tab === 'nuevo_vehiculo'  && <FormNuevoVehiculo onSuccess={() => setTab('vehiculos')} />}
        {tab === 'nueva_refaccion' && <FormNuevaRefaccion onSuccess={() => setTab('refacciones')} />}
      </main>
    </div>
  );
}