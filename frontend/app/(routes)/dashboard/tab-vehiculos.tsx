'use client';
// app/dashboard/tab-vehiculos.tsx
import { useEffect, useState } from 'react';
import { getVehiculosAdmin } from '@/lib/api-admin';
import { getImagenUrl } from '@/lib/api-extended';
import Image from 'next/image';
import { Loader2, ImageOff } from 'lucide-react';

export default function TabVehiculos() {
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getVehiculosAdmin().then((data) => { setVehiculos(data); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={20} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-4">{vehiculos.length} vehículos registrados</p>

      {/* Desktop */}
      <div className="hidden md:block border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
              {['', 'Vehículo', 'Marca', 'Año', 'Tipo', 'Precio', 'Km', 'Estatus'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
            {vehiculos.map((v) => {
              const imgUrl = getImagenUrl(v.Imagen);
              return (
                <tr key={v.documentId} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-4 py-3 w-14">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      {imgUrl ? (
                        <Image src={imgUrl} alt={v.nombre} width={40} height={40} className="object-cover w-full h-full" />
                      ) : (
                        <ImageOff size={14} className="text-zinc-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">{v.nombre}</p>
                    <p className="text-[11px] text-zinc-400">{v.numero_serie}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">{v.marca}</td>
                  <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">{v.anio}</td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{v.tipo}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    ${v.precio?.toLocaleString('es-MX')}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
                    {v.kilometraje?.toLocaleString('es-MX')} km
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                      v.disponible
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}>
                      {v.estatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-3">
        {vehiculos.map((v) => {
          const imgUrl = getImagenUrl(v.Imagen);
          return (
            <div key={v.documentId} className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 flex items-center justify-center">
                {imgUrl ? (
                  <Image src={imgUrl} alt={v.nombre} width={56} height={56} className="object-cover w-full h-full" />
                ) : (
                  <ImageOff size={16} className="text-zinc-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm truncate">{v.nombre}</p>
                <p className="text-xs text-zinc-400">{v.marca} · {v.anio} · {v.tipo}</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1">${v.precio?.toLocaleString('es-MX')}</p>
              </div>
              <span className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full shrink-0 ${
                v.disponible
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
              }`}>
                {v.estatus}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
