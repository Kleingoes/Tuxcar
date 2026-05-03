'use client';
// app/(routes)/dashboard/page.tsx
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { getUserRole, isStaff, isSuperAdmin } from '@/lib/admin';
import { getCotizaciones, getLeads } from '@/lib/api-admin';
import Navbar from '@/components/navbar';
import { Car, FileText, MessageSquare, Plus, ShieldX, Loader2, Cog, BarChart3, Bell, X, Users } from 'lucide-react';
import TabVehiculos from './tab-vehiculos';
import TabCotizaciones from './tab-cotizaciones';
import TabLeads from './tab-leads';
import TabRefacciones from './tab-refacciones';
import TabEstadisticas from './tab-estadisticas';
import TabEmpleados from './tab-empleados';
import FormNuevoVehiculo from './form-nuevo-vehiculo';
import FormNuevaRefaccion from './form-nueva-refaccion';

type Tab = 'estadisticas' | 'vehiculos' | 'cotizaciones' | 'leads' | 'refacciones' | 'empleados' | 'nuevo_vehiculo' | 'nueva_refaccion';

export default function DashboardPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('estadisticas');
  const [notificaciones, setNotificaciones] = useState<{ tipo: string; mensaje: string; fecha: string }[]>([]);
  const [showNotif, setShowNotif] = useState(false);

  const email = user?.primaryEmailAddress?.emailAddress ?? '';
  const esStaff_ = isStaff(email);
  const esSuperAdmin = isSuperAdmin(email);

  useEffect(() => {
    if (!esStaff_) return;
    async function cargarNotificaciones() {
      const [cotizaciones, leads] = await Promise.all([getCotizaciones(), getLeads()]);
      const ahora = new Date();
      const hace7dias = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
      const notifs: { tipo: string; mensaje: string; fecha: string }[] = [];

      cotizaciones.forEach((c: any) => {
        const f = new Date(c.createdAt || c.fecha);
        if (f >= hace7dias) {
          notifs.push({ tipo: 'cotizacion', mensaje: `Nueva cotización de ${c.cliente?.nombre ?? 'cliente'} — ${c.vehiculo?.nombre ?? 'vehículo'} por $${c.total?.toLocaleString('es-MX') ?? '0'}`, fecha: f.toLocaleDateString('es-MX') });
        }
      });

      leads.forEach((l: any) => {
        const f = new Date(l.createdAt);
        if (f >= hace7dias) {
          notifs.push({ tipo: 'lead', mensaje: `Nuevo contacto de ${l.nombre} (${l.correo})`, fecha: f.toLocaleDateString('es-MX') });
        }
      });

      notifs.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      setNotificaciones(notifs);
    }
    cargarNotificaciones();
  }, [esStaff_]);

  const TABS: { id: Tab; label: string; Icon: any }[] = [
    { id: 'estadisticas',  label: 'Resumen',       Icon: BarChart3 },
    { id: 'vehiculos',     label: 'Vehículos',     Icon: Car },
    { id: 'refacciones',   label: 'Refacciones',   Icon: Cog },
    { id: 'cotizaciones',  label: 'Cotizaciones',  Icon: FileText },
    { id: 'leads',         label: 'Contactos',     Icon: MessageSquare },
    ...(esSuperAdmin ? [{ id: 'empleados' as Tab, label: 'Empleados', Icon: Users }] : []),
  ];

  if (!isLoaded) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center"><Loader2 size={24} className="animate-spin text-zinc-600" /></div>;
  if (!isSignedIn) { router.push('/sign-in'); return null; }

  if (!esStaff_) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-32 text-center">
          <div className="w-14 h-14 border border-zinc-800 flex items-center justify-center mx-auto mb-6"><ShieldX size={22} strokeWidth={1} className="text-zinc-600" /></div>
          <h1 className="text-xl font-bold text-white mb-2">Acceso restringido</h1>
          <p className="text-zinc-500 text-sm mb-6">Este panel es exclusivo para el equipo de Tuxcar.</p>
          <button onClick={() => router.push('/')} className="text-sm text-zinc-600 underline underline-offset-4 hover:text-zinc-400 transition-colors">Volver al inicio</button>
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
              <p className="text-[11px] font-semibold tracking-[0.35em] uppercase text-amber-600">Panel administrativo</p>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 ${esSuperAdmin ? 'bg-amber-600/10 text-amber-500 border border-amber-600/20' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>{rolLabel}</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Bienvenido, {user.firstName ?? 'Usuario'}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setShowNotif(!showNotif)} className="relative w-10 h-10 flex items-center justify-center border border-zinc-800 text-zinc-400 hover:text-amber-500 hover:border-amber-600/50 transition-colors">
                <Bell size={16} strokeWidth={1.5} />
                {notificaciones.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full">{notificaciones.length > 9 ? '9+' : notificaciones.length}</span>}
              </button>
              {showNotif && (
                <div className="absolute right-0 top-12 w-80 bg-zinc-900 border border-zinc-800 shadow-2xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">Notificaciones (7 días)</p>
                    <button onClick={() => setShowNotif(false)} className="text-zinc-500 hover:text-zinc-300"><X size={14} /></button>
                  </div>
                  {notificaciones.length === 0 ? <p className="p-4 text-center text-zinc-600 text-xs">Sin notificaciones recientes</p> : notificaciones.map((n, i) => (
                    <div key={i} className="p-3 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors cursor-pointer" onClick={() => { setTab(n.tipo === 'cotizacion' ? 'cotizaciones' : 'leads'); setShowNotif(false); }}>
                      <div className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.tipo === 'cotizacion' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                        <div><p className="text-xs text-zinc-300 leading-relaxed">{n.mensaje}</p><p className="text-[10px] text-zinc-600 mt-0.5">{n.fecha}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {!isFormTab && (
              <>
                <button onClick={() => setTab('nuevo_vehiculo')} className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-amber-500 transition-colors"><Plus size={14} strokeWidth={2} /> Nuevo vehículo</button>
                <button onClick={() => setTab('nueva_refaccion')} className="inline-flex items-center gap-2 bg-zinc-800 text-zinc-300 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-zinc-700 border border-zinc-700 transition-colors"><Plus size={14} strokeWidth={2} /> Nueva refacción</button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 mb-8 border-b border-zinc-800 overflow-x-auto">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)} className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${tab === id ? 'border-amber-600 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
              <Icon size={15} strokeWidth={1.5} /> {label}
            </button>
          ))}
          {tab === 'nuevo_vehiculo' && <span className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-amber-600 text-white -mb-px whitespace-nowrap"><Plus size={15} /> Nuevo vehículo</span>}
          {tab === 'nueva_refaccion' && <span className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-amber-600 text-white -mb-px whitespace-nowrap"><Plus size={15} /> Nueva refacción</span>}
        </div>

        {tab === 'estadisticas'    && <TabEstadisticas />}
        {tab === 'vehiculos'       && <TabVehiculos esSuperAdmin={esSuperAdmin} />}
        {tab === 'refacciones'     && <TabRefacciones esSuperAdmin={esSuperAdmin} />}
        {tab === 'cotizaciones'    && <TabCotizaciones esSuperAdmin={esSuperAdmin} />}
        {tab === 'leads'           && <TabLeads esSuperAdmin={esSuperAdmin} />}
        {tab === 'empleados'       && <TabEmpleados esSuperAdmin={esSuperAdmin} />}
        {tab === 'nuevo_vehiculo'  && <FormNuevoVehiculo onSuccess={() => setTab('vehiculos')} />}
        {tab === 'nueva_refaccion' && <FormNuevaRefaccion onSuccess={() => setTab('refacciones')} />}
      </main>
    </div>
  );
}
