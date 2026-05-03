'use client';
// app/concesionarias/page.tsx
import { useState } from 'react';
import Navbar from '@/components/navbar';
import { MapPin, Phone, Mail, Clock, ArrowRight, Navigation } from 'lucide-react';

const CONCESIONARIAS = [
  {
    id: 1,
    nombre: 'AutoChiapas Tuxcar',
    ciudad: 'Tuxtla Gutiérrez',
    direccion: 'Bulevar Andrés Serra Rojas 1200, Col. Centro',
    telefono: '961 123 4567',
    correo: 'ventas@autochiapas.com',
    horario: 'Lun-Vie 9:00-19:00 · Sáb 9:00-15:00',
    lat: 16.7516,
    lng: -93.1152,
    destacada: true,
  },
  {
    id: 2,
    nombre: 'Motores de Chiapas',
    ciudad: 'Tapachula',
    direccion: 'Calle Central Norte 890, Col. Centro',
    telefono: '962 234 5678',
    correo: 'ventas@motoresdechiapass.com',
    horario: 'Lun-Vie 9:00-19:00 · Sáb 9:00-14:00',
    lat: 14.9039,
    lng: -92.2572,
  },
  {
    id: 3,
    nombre: 'AutoPremium Tapachula',
    ciudad: 'Tapachula',
    direccion: 'Bulevar Díaz Ordaz 450, Col. Centro',
    telefono: '962 625 8900',
    correo: 'ventas@autopremiumtapachula.com',
    horario: 'Lun-Vie 9:00-19:00 · Sáb 9:00-14:00',
    lat: 14.9089,
    lng: -92.2632,
  },
  {
    id: 4,
    nombre: 'Motores del Sureste',
    ciudad: 'San Cristóbal de las Casas',
    direccion: 'Av. General Utrilla 450, Col. Centro',
    telefono: '967 876 5432',
    correo: 'info@motoresdelsureste.com',
    horario: 'Lun-Vie 9:00-18:00 · Sáb 9:00-14:00',
    lat: 16.7370,
    lng: -92.6376,
  },
  {
    id: 5,
    nombre: 'Elite Motors San Cristóbal',
    ciudad: 'San Cristóbal de las Casas',
    direccion: 'Periférico Sur 1200, Barrio de Guadalupe',
    telefono: '967 674 3200',
    correo: 'info@elitemotorssancris.com',
    horario: 'Lun-Vie 9:00-18:00 · Sáb 9:00-13:00',
    lat: 16.7290,
    lng: -92.6416,
  },
  {
    id: 6,
    nombre: 'Tuxcar Comitán',
    ciudad: 'Comitán de Domínguez',
    direccion: 'Av. Centro Oriente 890, Col. Centro',
    telefono: '963 632 1100',
    correo: 'ventas@tuxcarcomitan.com',
    horario: 'Lun-Vie 9:00-18:00 · Sáb 9:00-14:00',
    lat: 16.2510,
    lng: -92.1335,
  },
];

const CIUDADES = ['Todas', ...new Set(CONCESIONARIAS.map((c) => c.ciudad))];

export default function ConcesionariasPage() {
  const [ciudadFiltro, setCiudadFiltro] = useState('Todas');
  const [seleccionada, setSeleccionada] = useState<number | null>(null);

  const filtradas = ciudadFiltro === 'Todas'
    ? CONCESIONARIAS
    : CONCESIONARIAS.filter((c) => c.ciudad === ciudadFiltro);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(194,154,108,0.1),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <p className="text-[11px] font-semibold tracking-[0.35em] uppercase text-amber-600 mb-4">
            Red de sucursales
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">Nuestras sucursales</h1>
          <p className="text-zinc-400 text-lg max-w-xl leading-relaxed">
            6 concesionarias en las principales ciudades de Chiapas. Encuentra la más cercana y visítanos.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4">
          {[
            { num: '6', label: 'Sucursales' },
            { num: '4', label: 'Ciudades' },
            { num: '29+', label: 'Vehículos' },
            { num: '30+', label: 'Asesores' },
          ].map((s, i) => (
            <div key={s.label} className={`py-8 px-6 text-center ${i < 3 ? 'border-r border-zinc-800/50' : ''}`}>
              <p className="text-2xl sm:text-3xl font-bold text-white mb-0.5">{s.num}</p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-12">

        {/* Filtro por ciudad */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8">
          {CIUDADES.map((c) => (
            <button key={c} onClick={() => setCiudadFiltro(c)}
              className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap border transition-colors ${
                ciudadFiltro === c
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
              }`}>
              {c}
            </button>
          ))}
        </div>

        <p className="text-xs text-zinc-600 mb-6">{filtradas.length} sucursales</p>

        {/* Grid de concesionarias */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtradas.map((c) => (
            <div key={c.id}
              className={`border bg-zinc-900/30 transition-all duration-300 ${
                seleccionada === c.id
                  ? 'border-amber-600/50 bg-zinc-900/60'
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
              onClick={() => setSeleccionada(seleccionada === c.id ? null : c.id)}>

              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-amber-600 font-semibold mb-1">{c.ciudad}</p>
                    <h3 className="font-bold text-white text-lg">{c.nombre}</h3>
                  </div>
                  {c.destacada && (
                    <span className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-amber-600/10 text-amber-500 border border-amber-600/20">
                      Principal
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-600/10 flex items-center justify-center shrink-0">
                      <MapPin size={13} strokeWidth={1.5} className="text-amber-500" />
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{c.direccion}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-600/10 flex items-center justify-center shrink-0">
                      <Phone size={13} strokeWidth={1.5} className="text-amber-500" />
                    </div>
                    <p className="text-xs text-zinc-400">{c.telefono}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-600/10 flex items-center justify-center shrink-0">
                      <Mail size={13} strokeWidth={1.5} className="text-amber-500" />
                    </div>
                    <p className="text-xs text-zinc-400">{c.correo}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-600/10 flex items-center justify-center shrink-0">
                      <Clock size={13} strokeWidth={1.5} className="text-amber-500" />
                    </div>
                    <p className="text-xs text-zinc-400">{c.horario}</p>
                  </div>
                </div>
              </div>

              {/* Expandido: mapa individual */}
              {seleccionada === c.id && (
                <div className="border-t border-zinc-800">
                  <div className="h-48 relative">
                    <iframe
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${c.lng - 0.02}%2C${c.lat - 0.015}%2C${c.lng + 0.02}%2C${c.lat + 0.015}&layer=mapnik&marker=${c.lat}%2C${c.lng}`}
                      className="w-full h-full border-0 grayscale-[30%] brightness-90"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 flex gap-3">
                    <a href={`https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-amber-600 text-white px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider hover:bg-amber-500 transition-colors">
                      <Navigation size={12} />
                      Cómo llegar
                    </a>
                    <a href={`tel:${c.telefono.replace(/\s/g, '')}`}
                      className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-300 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider hover:border-zinc-500 hover:text-white transition-colors">
                      <Phone size={12} />
                      Llamar
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}