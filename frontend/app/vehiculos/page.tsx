'use client';
// app/vehiculos/page.tsx
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import VehiculoCard from '@/components/vehiculo-card';
import { getVehiculosFiltrados } from '@/lib/api-extended';
import { SlidersHorizontal, Loader2, Search, X, ChevronDown, GitCompareArrows } from 'lucide-react';

const TIPOS = ['todos', 'sedan', 'suv', 'pickup', 'hatchback', 'coupe', 'van'];
const TRANSMISIONES = ['todas', 'automatica', 'manual'];
const COMBUSTIBLES = ['todos', 'gasolina', 'diesel', 'hibrido', 'electrico'];
const ORDENAR = [
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
  { value: 'anio-desc', label: 'Año: más reciente' },
  { value: 'anio-asc', label: 'Año: más antiguo' },
  { value: 'km-asc', label: 'Km: menor a mayor' },
  { value: 'km-desc', label: 'Km: mayor a mayor' },
];

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroTransmision, setFiltroTransmision] = useState('todas');
  const [filtroCombustible, setFiltroCombustible] = useState('todos');
  const [filtroMarca, setFiltroMarca] = useState('todas');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [anioMin, setAnioMin] = useState('');
  const [anioMax, setAnioMax] = useState('');
  const [kmMax, setKmMax] = useState('');
  const [soloDisponibles, setSoloDisponibles] = useState(true);
  const [ordenar, setOrdenar] = useState('precio-asc');

  useEffect(() => {
    getVehiculosFiltrados({}).then((data) => { setVehiculos(data); setLoading(false); });
  }, []);

  // Obtener marcas únicas
  const marcas = useMemo(() => {
    const set = new Set(vehiculos.map((v: any) => v.marca).filter(Boolean));
    return ['todas', ...Array.from(set).sort()];
  }, [vehiculos]);

  // Filtrar y ordenar
  const filtrados = useMemo(() => {
    let result = [...vehiculos];

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      result = result.filter((v) =>
        v.nombre?.toLowerCase().includes(q) ||
        v.marca?.toLowerCase().includes(q) ||
        v.modelo?.toLowerCase().includes(q) ||
        v.color?.toLowerCase().includes(q)
      );
    }

    if (filtroTipo !== 'todos') result = result.filter((v) => v.tipo === filtroTipo);
    if (filtroTransmision !== 'todas') result = result.filter((v) => v.transmision === filtroTransmision);
    if (filtroCombustible !== 'todos') result = result.filter((v) => v.combustible === filtroCombustible);
    if (filtroMarca !== 'todas') result = result.filter((v) => v.marca === filtroMarca);
    if (soloDisponibles) result = result.filter((v) => v.disponible !== false);
    if (precioMin) result = result.filter((v) => (v.precio || 0) >= Number(precioMin));
    if (precioMax) result = result.filter((v) => (v.precio || 0) <= Number(precioMax));
    if (anioMin) result = result.filter((v) => (v.anio || 0) >= Number(anioMin));
    if (anioMax) result = result.filter((v) => (v.anio || 0) <= Number(anioMax));
    if (kmMax) result = result.filter((v) => (v.kilometraje || 0) <= Number(kmMax));

    const [campo, dir] = ordenar.split('-');
    result.sort((a, b) => {
      const va = a[campo === 'km' ? 'kilometraje' : campo] || 0;
      const vb = b[campo === 'km' ? 'kilometraje' : campo] || 0;
      return dir === 'asc' ? va - vb : vb - va;
    });

    return result;
  }, [vehiculos, busqueda, filtroTipo, filtroTransmision, filtroCombustible, filtroMarca, soloDisponibles, precioMin, precioMax, anioMin, anioMax, kmMax, ordenar]);

  const filtrosActivos = [filtroTipo !== 'todos', filtroTransmision !== 'todas', filtroCombustible !== 'todos', filtroMarca !== 'todas', !!precioMin, !!precioMax, !!anioMin, !!anioMax, !!kmMax].filter(Boolean).length;

  function limpiarFiltros() {
    setBusqueda(''); setFiltroTipo('todos'); setFiltroTransmision('todas');
    setFiltroCombustible('todos'); setFiltroMarca('todas');
    setPrecioMin(''); setPrecioMax(''); setAnioMin(''); setAnioMax('');
    setKmMax(''); setSoloDisponibles(true); setOrdenar('precio-asc');
  }

  const selectClass = 'bg-zinc-900 border border-zinc-800 text-white text-xs px-3 py-2 focus:outline-none focus:border-amber-600/50 transition-colors w-full';
  const inputClass = 'bg-zinc-900 border border-zinc-800 text-white text-xs px-3 py-2 focus:outline-none focus:border-amber-600/50 transition-colors w-full placeholder-zinc-600';

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(194,154,108,0.1),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <p className="text-[11px] font-semibold tracking-[0.35em] uppercase text-amber-600 mb-4">Nuestro inventario</p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">Catálogo</h1>
          <p className="text-zinc-400 text-lg max-w-lg leading-relaxed">
            Explora nuestra selección de vehículos multimarca. Cada unidad cuenta con revisión mecánica certificada y garantía extendida.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Barra de búsqueda */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input type="text" value={busqueda} placeholder="Buscar por nombre, marca, modelo o color..."
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-600/50 transition-colors" />
            {busqueda && (
              <button onClick={() => setBusqueda('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400">
                <X size={14} />
              </button>
            )}
          </div>
          <button onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className={`inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider border transition-colors ${mostrarFiltros || filtrosActivos > 0 ? 'bg-amber-600 text-white border-amber-600' : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600'}`}>
            <SlidersHorizontal size={14} />
            Filtros {filtrosActivos > 0 && `(${filtrosActivos})`}
            <ChevronDown size={12} className={`transition-transform ${mostrarFiltros ? 'rotate-180' : ''}`} />
          </button>
          <Link href="/vehiculos/comparar"
            className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider border border-zinc-800 text-zinc-400 hover:border-amber-600 hover:text-amber-500 transition-colors whitespace-nowrap">
            <GitCompareArrows size={14} strokeWidth={1.5} />
            Comparar
          </Link>
          <select value={ordenar} onChange={(e) => setOrdenar(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs px-4 py-3 focus:outline-none focus:border-amber-600/50">
            {ORDENAR.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Panel de filtros avanzados */}
        {mostrarFiltros && (
          <div className="border border-zinc-800 bg-zinc-900/50 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">Filtros avanzados</p>
              <button onClick={limpiarFiltros} className="text-[11px] text-zinc-500 hover:text-amber-500 transition-colors underline underline-offset-2">
                Limpiar todo
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Tipo</label>
                <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} className={selectClass}>
                  {TIPOS.map((t) => <option key={t} value={t}>{t === 'todos' ? 'Todos' : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Marca</label>
                <select value={filtroMarca} onChange={(e) => setFiltroMarca(e.target.value)} className={selectClass}>
                  {marcas.map((m) => <option key={m} value={m}>{m === 'todas' ? 'Todas' : m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Transmisión</label>
                <select value={filtroTransmision} onChange={(e) => setFiltroTransmision(e.target.value)} className={selectClass}>
                  {TRANSMISIONES.map((t) => <option key={t} value={t}>{t === 'todas' ? 'Todas' : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Combustible</label>
                <select value={filtroCombustible} onChange={(e) => setFiltroCombustible(e.target.value)} className={selectClass}>
                  {COMBUSTIBLES.map((c) => <option key={c} value={c}>{c === 'todos' ? 'Todos' : c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Precio mín.</label>
                <input type="number" value={precioMin} placeholder="$0" onChange={(e) => setPrecioMin(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Precio máx.</label>
                <input type="number" value={precioMax} placeholder="$∞" onChange={(e) => setPrecioMax(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Año desde</label>
                <input type="number" value={anioMin} placeholder="2015" onChange={(e) => setAnioMin(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Año hasta</label>
                <input type="number" value={anioMax} placeholder="2025" onChange={(e) => setAnioMax(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Km máximo</label>
                <input type="number" value={kmMax} placeholder="50000" onChange={(e) => setKmMax(e.target.value)} className={inputClass} />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400 hover:text-zinc-300 transition-colors py-2">
                  <input type="checkbox" checked={soloDisponibles} onChange={(e) => setSoloDisponibles(e.target.checked)}
                    className="w-4 h-4 border-zinc-700 bg-zinc-900 accent-amber-600" />
                  Solo disponibles
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tipos rápidos */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
          {TIPOS.map((t) => (
            <button key={t} onClick={() => setFiltroTipo(t)}
              className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap border transition-colors ${filtroTipo === t ? 'bg-amber-600 text-white border-amber-600' : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'}`}>
              {t === 'todos' ? 'Todos' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Resultados */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={20} className="animate-spin text-zinc-600" />
          </div>
        ) : filtrados.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-zinc-500 text-sm mb-4">No se encontraron vehículos con los filtros seleccionados.</p>
            <button onClick={limpiarFiltros} className="text-sm text-amber-500 hover:text-amber-400 transition-colors underline underline-offset-2">
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-zinc-600 mb-6">{filtrados.length} vehículos encontrados</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtrados.map((v) => (
                <VehiculoCard key={v.documentId} v={v} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}