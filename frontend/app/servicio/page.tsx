// app/servicio/page.tsx
import Navbar from '@/components/navbar';
import Link from 'next/link';
import { ArrowRight, Wrench, Monitor, Disc, Zap, Wind, Settings2, Shield, Clock } from 'lucide-react';

const SERVICIOS = [
  { Icon: Wrench,    title: 'Servicio mayor y menor', desc: 'Mantenimiento preventivo y correctivo con refacciones originales y mano de obra certificada.' },
  { Icon: Monitor,   title: 'Diagnóstico computarizado', desc: 'Escáner de última generación para detectar fallas electrónicas y mecánicas con precisión.' },
  { Icon: Disc,      title: 'Sistema de frenos', desc: 'Revisión, ajuste y reemplazo de pastillas, discos y líquido de frenos.' },
  { Icon: Zap,       title: 'Sistema eléctrico', desc: 'Diagnóstico y reparación de sistema eléctrico, batería, alternador y sistema de arranque.' },
  { Icon: Wind,      title: 'Aire acondicionado', desc: 'Recarga de gas, limpieza de sistema y reparación de fugas.' },
  { Icon: Settings2, title: 'Transmisión', desc: 'Servicio a transmisiones automáticas y manuales. Cambio de aceite y ajuste de bandas.' },
];

export default function ServicioPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(194,154,108,0.1),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <p className="text-[11px] font-semibold tracking-[0.35em] uppercase text-amber-600 mb-4">
            Centro de servicio
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">Servicio técnico</h1>
          <p className="text-zinc-400 text-lg max-w-xl leading-relaxed">
            Nuestro taller cuenta con técnicos certificados y equipo de diagnóstico de última generación para mantener tu vehículo en condiciones óptimas.
          </p>
        </div>
      </section>

      {/* Servicios grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-zinc-800">
          {SERVICIOS.map(({ Icon, title, desc }, i) => (
            <div key={title}
              className={`p-8 
                ${(i + 1) % 3 !== 0 ? 'lg:border-r border-zinc-800' : ''} 
                ${(i + 1) % 2 !== 0 ? 'sm:border-r lg:border-r-0' : ''} 
                ${(i + 1) % 3 !== 0 ? 'lg:border-r' : ''}
                ${i < 3 ? 'border-b border-zinc-800 lg:border-b' : i < 4 ? 'border-b sm:border-b-0 lg:border-b-0' : ''}
                ${i < 4 ? 'sm:border-b' : 'sm:border-b-0'}
                ${i < 3 ? 'lg:border-b' : 'lg:border-b-0'}
                hover:bg-zinc-900/40 transition-colors`}>
              <div className="w-10 h-10 rounded-lg bg-amber-600/10 flex items-center justify-center mb-5">
                <Icon size={18} strokeWidth={1.5} className="text-amber-500" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-2">{title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Garantía */}
      <section className="border-y border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2">
          <div className="p-10 sm:border-r border-zinc-800/50 flex items-start gap-5">
            <div className="w-10 h-10 rounded-lg bg-amber-600/10 flex items-center justify-center shrink-0">
              <Shield size={18} strokeWidth={1.5} className="text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm mb-1.5">Garantía en servicio</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Todos nuestros servicios incluyen 6 meses de garantía en mano de obra y refacciones instaladas por nuestros técnicos.
              </p>
            </div>
          </div>
          <div className="p-10 flex items-start gap-5 border-t sm:border-t-0 border-zinc-800/50">
            <div className="w-10 h-10 rounded-lg bg-amber-600/10 flex items-center justify-center shrink-0">
              <Clock size={18} strokeWidth={1.5} className="text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm mb-1.5">Agenda tu cita</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Programa tu servicio con anticipación y reduce el tiempo de espera. Atención de lunes a sábado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">¿Tu vehículo necesita atención?</h2>
        <p className="text-zinc-400 text-sm mb-8 max-w-md mx-auto">
          Agenda una cita de diagnóstico gratuito o contacta a uno de nuestros asesores de servicio.
        </p>
        <Link href="/contacto"
          className="inline-flex items-center gap-3 bg-amber-600 text-white px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-amber-500 transition-colors">
          Agendar cita de servicio
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </section>
    </div>
  );
}
