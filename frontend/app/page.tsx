// app/page.tsx
import Navbar from '@/components/navbar';
import VehiculoCard from '@/components/vehiculo-card';
import Link from 'next/link';
import Image from 'next/image';
import { getVehiculosFiltrados } from '@/lib/api-extended';
import { ArrowRight, Shield, Wrench, CreditCard, Clock } from 'lucide-react';

export default async function Home() {
  const vehiculos = await getVehiculosFiltrados({ disponible: true });
  const destacados = vehiculos.slice(0, 6);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      {/* ═══ HERO CON IMAGEN ═══ */}
      <section className="relative min-h-[90vh] flex items-end overflow-hidden">
        {/* Imagen de fondo */}
        <Image
          src="/hero.jpg"
          alt="Tuxcar"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_80%_50%,transparent,rgba(9,9,11,0.6))]" />

        {/* Contenido */}
        <div className="relative w-full max-w-7xl mx-auto px-4 pb-24 pt-40">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold tracking-[0.35em] uppercase text-amber-500 mb-6">
              Concesionaria multimarca en Chiapas
            </p>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-8">
              <span className="block text-white">CONDUCE</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
                TU FUTURO
              </span>
            </h1>
            <p className="text-zinc-300 text-lg sm:text-xl max-w-lg leading-relaxed mb-10">
              Encuentra el vehículo perfecto entre nuestra selección de las mejores marcas. Financiamiento a tu medida y servicio de primer nivel.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/vehiculos"
                className="inline-flex items-center gap-3 bg-amber-600 text-white px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-amber-500 transition-colors">
                Explorar catálogo
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
              <Link href="/contacto"
                className="inline-flex items-center gap-3 border border-white/20 text-white px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:border-white/40 hover:bg-white/5 transition-colors backdrop-blur-sm">
                Contactar asesor
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />
      </section>

      {/* ═══ STATS ═══ */}
      <section className="border-y border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4">
          {[
            { num: `${vehiculos.length}+`, label: 'Vehículos en inventario' },
            { num: '10+',  label: 'Marcas disponibles' },
            { num: '98%',  label: 'Clientes satisfechos' },
            { num: '24h',  label: 'Tiempo de respuesta' },
          ].map((s, i) => (
            <div key={s.label}
              className={`py-10 px-6 text-center ${i < 3 ? 'border-r border-zinc-800/50' : ''}`}>
              <p className="text-3xl sm:text-4xl font-bold text-white mb-1">{s.num}</p>
              <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ VEHÍCULOS DESTACADOS ═══ */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.35em] uppercase text-amber-600 mb-3">
              Selección destacada
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Modelos disponibles</h2>
          </div>
          <Link href="/vehiculos"
            className="hidden sm:inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-500 transition-colors group">
            Ver todos
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {destacados.length === 0 ? (
          <p className="text-zinc-500 text-center py-20">No hay vehículos disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {destacados.map((v) => (
              <VehiculoCard key={v.documentId} v={v} />
            ))}
          </div>
        )}

        <div className="text-center mt-10 sm:hidden">
          <Link href="/vehiculos"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-500 transition-colors">
            Ver todos los vehículos
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ═══ SERVICIOS ═══ */}
      <section className="border-y border-zinc-800/50 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold tracking-[0.35em] uppercase text-amber-600 mb-3">
              Por qué elegirnos
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Experiencia completa
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
            {[
              { Icon: Shield,     title: 'Garantía extendida',     desc: 'Todos nuestros vehículos cuentan con garantía de agencia y revisión mecánica certificada.' },
              { Icon: CreditCard, title: 'Financiamiento flexible', desc: 'Trabajamos con los principales bancos del país para ofrecerte las mejores tasas y plazos.' },
              { Icon: Wrench,     title: 'Servicio integral',      desc: 'Centro de servicio con técnicos certificados, refacciones originales y diagnóstico de última generación.' },
              { Icon: Clock,      title: 'Atención inmediata',     desc: 'Asesores disponibles para ayudarte en cada paso, desde la cotización hasta la entrega de llaves.' },
            ].map(({ Icon, title, desc }, i) => (
              <div key={title}
                className={`p-8 ${i < 3 ? 'lg:border-r border-zinc-800/50' : ''} ${i < 2 ? 'sm:border-r' : ''} ${i < 2 ? 'border-b sm:border-b-0 lg:border-b-0' : i === 2 ? 'border-b lg:border-b-0' : ''}`}>
                <div className="w-10 h-10 rounded-lg bg-amber-600/10 flex items-center justify-center mb-5">
                  <Icon size={18} strokeWidth={1.5} className="text-amber-500" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">{title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_110%,rgba(194,154,108,0.1),transparent)]" />
        <div className="relative max-w-3xl mx-auto px-4 py-28 text-center">
          <p className="text-[11px] font-semibold tracking-[0.35em] uppercase text-amber-600 mb-6">
            Da el primer paso
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Tu próximo vehículo te está esperando
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Agenda una cita con uno de nuestros asesores o visítanos directamente en nuestra sala de exhibición.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/vehiculos"
              className="inline-flex items-center gap-3 bg-amber-600 text-white px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-amber-500 transition-colors">
              Ver catálogo
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <Link href="/financiamiento"
              className="inline-flex items-center gap-3 border border-zinc-700 text-zinc-300 px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:border-zinc-500 hover:text-white transition-colors">
              Financiamiento
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
