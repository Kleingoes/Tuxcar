'use client';
// app/vehiculos/page.tsx
import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import VehiculoCard from '@/components/vehiculo-card';
import { getVehiculosFiltrados } from '@/lib/api-extended';
import { SlidersHorizontal, Loader2 } from 'lucide-react';

const TIPOS = ['todos', 'sedan', 'suv', 'pickup', 'hatchback', 'coupe', 'van'];

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const filtros: { tipo?: string; disponible?: boolean } = {};
    if (filtroTipo !== 'todos') filtros.tipo = filtroTipo;
    if (soloDisponibles) filtros.disponible = true;
    getVehiculosFiltrados(filtros).then((data) => { setVehiculos(data); setLoading(false); });
  }, [filtroTipo, soloDisponibles]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(194,154,108,0.1),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <p className="text-[11px] font-semibold tracking-[0.35em] uppercase text-amber-600 mb-4">
            Nuestro inventario
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">Catálogo</h1>
          <p className="text-zinc-400 text-lg max-w-lg leading-relaxed">
            Explora nuestra selección de vehículos multimarca. Cada unidad cuenta con revisión mecánica certificada y garantía extendida.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-10">

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <SlidersHorizontal size={14} className="text-zinc-600 shrink-0" />
            {TIPOS.map((t) => (
              <button key={t} onClick={() => setFiltroTipo(t)}
                className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap border transition-colors
                  ${filtroTipo === t
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'}`}>
                {t === 'todos' ? 'Todos' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
            <input type="checkbox" checked={soloDisponibles}
              onChange={(e) => setSoloDisponibles(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 accent-amber-600" />
            Solo disponibles
          </label>
        </div>

        {/* Resultados */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={20} className="animate-spin text-zinc-600" />
          </div>
        ) : vehiculos.length === 0 ? (
          <p className="text-zinc-600 text-center py-20 text-sm">
            No se encontraron vehículos con los filtros seleccionados.
          </p>
        ) : (
          <>
            <p className="text-xs text-zinc-600 mb-6">{vehiculos.length} vehículos encontrados</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {vehiculos.map((v) => (
                <VehiculoCard key={v.documentId} v={v} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}