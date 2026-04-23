'use client';
// app/dashboard/tab-cotizaciones.tsx
import { useEffect, useState } from 'react';
import { getCotizaciones } from '@/lib/api-admin';
import { Loader2, FileText } from 'lucide-react';

const ESTATUS_COLOR: Record<string, string> = {
  borrador:  'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
  enviada:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  aceptada:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  rechazada: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  expirada:  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

export default function TabCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    getCotizaciones().then((data) => { setCotizaciones(data); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={20} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  if (cotizaciones.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mx-auto mb-4">
          <FileText size={18} strokeWidth={1} className="text-zinc-400" />
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">No hay cotizaciones registradas todavía.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-4">{cotizaciones.length} cotizaciones</p>

      <div className="border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
              {['Fecha', 'Cliente', 'Vehículo', 'Total', 'Estatus', 'Vigencia'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
            {cotizaciones.map((c) => (
              <tr key={c.documentId} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
                  {c.fecha ? new Date(c.fecha).toLocaleDateString('es-MX') : '—'}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                    {c.cliente?.nombre ?? 'Sin cliente'}
                  </p>
                  <p className="text-[11px] text-zinc-400">{c.cliente?.correo ?? ''}</p>
                </td>
                <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
                  {c.vehiculo?.nombre ?? 'Sin vehículo'}
                </td>
                <td className="px-4 py-3 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  ${c.total?.toLocaleString('es-MX') ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                    ESTATUS_COLOR[c.estatus] ?? ESTATUS_COLOR.borrador
                  }`}>
                    {c.estatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
                  {c.vigencia ? new Date(c.vigencia).toLocaleDateString('es-MX') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
