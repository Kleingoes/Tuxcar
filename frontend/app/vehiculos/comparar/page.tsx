'use client';
// app/vehiculos/comparar/page.tsx
import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import { getVehiculosFiltrados, getImagenUrl } from '@/lib/api-extended';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Plus, X, ImageOff, Check, Minus, Fuel, Settings2, Gauge, DoorOpen } from 'lucide-react';

export default function CompararPage() {
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [seleccionados, setSeleccionados] = useState<any[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [slotActivo, setSlotActivo] = useState<number | null>(null);

  useEffect(() => {
    getVehiculosFiltrados({ disponible: true }).then(setVehiculos);
  }, []);

  const filtrados = busqueda.trim()
    ? vehiculos.filter((v) =>
        v.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        v.marca?.toLowerCase().includes(busqueda.toLowerCase())
      )
    : vehiculos;

  function agregarVehiculo(v: any) {
    if (slotActivo !== null) {
      const nuevo = [...seleccionados];
      nuevo[slotActivo] = v;
      setSeleccionados(nuevo);
    } else if (seleccionados.length < 3) {
      setSeleccionados([...seleccionados, v]);
    }
    setBuscando(false);
    setBusqueda('');
    setSlotActivo(null);
  }

  function quitarVehiculo(index: number) {
    setSeleccionados(seleccionados.filter((_, i) => i !== index));
  }

  function abrirSelector(slot?: number) {
    setSlotActivo(slot ?? null);
    setBuscando(true);
    setBusqueda('');
  }

  const specs = [
    { label: 'Precio', key: 'precio', format: (v: any) => v.precio ? `$${v.precio.toLocaleString('es-MX')}` : '—', highlight: 'min' },
    { label: 'Año', key: 'anio', format: (v: any) => v.anio ?? '—', highlight: 'max' },
    { label: 'Kilometraje', key: 'kilometraje', format: (v: any) => v.kilometraje ? `${v.kilometraje.toLocaleString('es-MX')} km` : '—', highlight: 'min' },
    { label: 'Tipo', key: 'tipo', format: (v: any) => v.tipo?.toUpperCase() ?? '—' },
    { label: 'Transmisión', key: 'transmision', format: (v: any) => v.transmision ? v.transmision.charAt(0).toUpperCase() + v.transmision.slice(1) : '—' },
    { label: 'Combustible', key: 'combustible', format: (v: any) => v.combustible ? v.combustible.charAt(0).toUpperCase() + v.combustible.slice(1) : '—' },
    { label: 'Puertas', key: 'puertas', format: (v: any) => v.puertas ?? '—' },
    { label: 'Color', key: 'color', format: (v: any) => v.color ?? '—' },
    { label: 'Estatus', key: 'estatus', format: (v: any) => v.estatus?.toUpperCase() ?? '—' },
    { label: 'No. Serie', key: 'numero_serie', format: (v: any) => v.numero_serie ?? '—' },
  ];

  function getBestValue(spec: any) {
    if (!spec.highlight || seleccionados.length < 2) return -1;
    const values = seleccionados.map((v) => v[spec.key] || 0);
    if (spec.highlight === 'min') return values.indexOf(Math.min(...values));
    return values.indexOf(Math.max(...values));
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="relative overflow-hidden border-b border-zinc-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(194,154,108,0.1),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <Link href="/vehiculos" className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-amber-500 transition-colors mb-4">
            <ArrowLeft size={14} /> Volver al catálogo
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">Comparar vehículos</h1>
          <p className="text-zinc-400 text-sm">Selecciona hasta 3 vehículos para comparar sus especificaciones.</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Selector modal */}
        {buscando && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-50 pt-20 px-4">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg max-h-[70vh] flex flex-col">
              <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
                <input type="text" value={busqueda} placeholder="Buscar vehículo..." autoFocus
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="flex-1 bg-transparent text-white text-sm placeholder-zinc-600 focus:outline-none" />
                <button onClick={() => { setBuscando(false); setSlotActivo(null); }} className="text-zinc-500 hover:text-zinc-300">
                  <X size={18} />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 p-2">
                {filtrados.filter((v) => !seleccionados.find((s) => s.documentId === v.documentId)).map((v) => {
                  const imgUrl = getImagenUrl(v.Imagen);
                  return (
                    <button key={v.documentId} onClick={() => agregarVehiculo(v)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-zinc-800 transition-colors text-left">
                      <div className="w-12 h-12 bg-zinc-800 shrink-0 overflow-hidden flex items-center justify-center">
                        {imgUrl ? <Image src={imgUrl} alt={v.nombre} width={48} height={48} className="object-cover w-full h-full" /> : <ImageOff size={14} className="text-zinc-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{v.nombre}</p>
                        <p className="text-[11px] text-zinc-500">{v.marca} · {v.anio} · ${v.precio?.toLocaleString('es-MX')}</p>
                      </div>
                    </button>
                  );
                })}
                {filtrados.length === 0 && <p className="text-center text-zinc-600 text-sm py-8">No se encontraron vehículos</p>}
              </div>
            </div>
          </div>
        )}

        {/* Slots de vehículos */}
        <div className={`grid gap-4 mb-8 ${seleccionados.length === 0 ? 'grid-cols-1' : seleccionados.length === 1 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {seleccionados.map((v, i) => {
            const imgUrl = getImagenUrl(v.Imagen);
            return (
              <div key={v.documentId} className="border border-zinc-800 bg-zinc-900/30 relative">
                <button onClick={() => quitarVehiculo(i)}
                  className="absolute top-2 right-2 w-7 h-7 bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-red-400 hover:bg-red-900/20 transition-colors z-10">
                  <X size={12} />
                </button>
                <div className="aspect-[16/10] bg-zinc-800 overflow-hidden">
                  {imgUrl ? <Image src={imgUrl} alt={v.nombre} width={400} height={250} className="object-cover w-full h-full" /> : <div className="w-full h-full flex items-center justify-center"><ImageOff size={24} className="text-zinc-700" /></div>}
                </div>
                <div className="p-4">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">{v.marca} · {v.anio}</p>
                  <p className="font-semibold text-white text-sm">{v.nombre}</p>
                  <p className="text-lg font-bold text-amber-500 mt-1">${v.precio?.toLocaleString('es-MX')}</p>
                </div>
                <button onClick={() => abrirSelector(i)}
                  className="w-full py-2 text-[10px] uppercase tracking-wider text-zinc-500 border-t border-zinc-800 hover:text-amber-500 hover:bg-amber-600/5 transition-colors">
                  Cambiar vehículo
                </button>
              </div>
            );
          })}

          {seleccionados.length < 3 && (
            <button onClick={() => abrirSelector()}
              className="border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center py-16 hover:border-zinc-600 hover:bg-zinc-900/20 transition-colors min-h-[200px]">
              <Plus size={24} className="text-zinc-600 mb-2" />
              <span className="text-sm text-zinc-600">Agregar vehículo</span>
              <span className="text-[10px] text-zinc-700 mt-1">{seleccionados.length}/3 seleccionados</span>
            </button>
          )}
        </div>

        {/* Tabla comparativa */}
        {seleccionados.length >= 2 && (
          <div className="border border-zinc-800 overflow-hidden">
            <div className="bg-zinc-900/50 border-b border-zinc-800 px-5 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">Comparación de especificaciones</p>
            </div>
            {specs.map((spec, i) => {
              const bestIdx = getBestValue(spec);
              return (
                <div key={spec.key} className={`grid ${seleccionados.length === 2 ? 'grid-cols-3' : 'grid-cols-4'} ${i % 2 === 0 ? 'bg-zinc-900/20' : ''}`}>
                  <div className="px-5 py-3 text-xs font-medium text-zinc-400 border-r border-zinc-800/50 flex items-center">
                    {spec.label}
                  </div>
                  {seleccionados.map((v, j) => (
                    <div key={v.documentId}
                      className={`px-5 py-3 text-sm font-medium ${j < seleccionados.length - 1 ? 'border-r border-zinc-800/50' : ''} ${bestIdx === j ? 'text-amber-400' : 'text-white'}`}>
                      {bestIdx === j && <span className="text-amber-500 mr-1 text-[10px]">★</span>}
                      {spec.format(v)}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {seleccionados.length < 2 && (
          <div className="text-center py-12">
            <p className="text-zinc-600 text-sm">Selecciona al menos 2 vehículos para ver la comparación.</p>
          </div>
        )}
      </main>
    </div>
  );
}
