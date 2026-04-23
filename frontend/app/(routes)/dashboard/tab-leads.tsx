'use client';
// app/dashboard/tab-leads.tsx
import { useEffect, useState } from 'react';
import { getLeads } from '@/lib/api-admin';
import { Loader2, MessageSquare } from 'lucide-react';

const ESTATUS_COLOR: Record<string, string> = {
  nuevo:      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  contactado: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  convertido: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  descartado: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
};

export default function TabLeads() {
  const [leads, setLeads]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeads().then((data) => { setLeads(data); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={20} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mx-auto mb-4">
          <MessageSquare size={18} strokeWidth={1} className="text-zinc-400" />
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">No hay mensajes de contacto todavía.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-4">{leads.length} mensajes recibidos</p>

      <div className="border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
              {['Fecha', 'Nombre', 'Correo', 'Teléfono', 'Mensaje', 'Estatus'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
            {leads.map((l) => (
              <tr key={l.documentId} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                  {l.createdAt ? new Date(l.createdAt).toLocaleDateString('es-MX') : '—'}
                </td>
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                  {l.nombre}
                </td>
                <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
                  {l.correo}
                </td>
                <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
                  {l.telefono || '—'}
                </td>
                <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
                  <p className="truncate">{l.mensaje || '—'}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                    ESTATUS_COLOR[l.estatus] ?? ESTATUS_COLOR.nuevo
                  }`}>
                    {l.estatus ?? 'nuevo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
