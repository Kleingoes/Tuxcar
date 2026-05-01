'use client';
// app/dashboard/tab-cotizaciones.tsx
import { useEffect, useState } from 'react';
import { getCotizaciones, eliminarCotizacion } from '@/lib/api-admin';
import { Loader2, FileText, Trash2, AlertTriangle } from 'lucide-react';

interface Props {
  esSuperAdmin: boolean;
}

const ESTATUS_COLOR: Record<string, string> = {
  borrador:  'bg-zinc-800 text-zinc-400',
  enviada:   'bg-blue-900/30 text-blue-400',
  aceptada:  'bg-emerald-900/30 text-emerald-400',
  rechazada: 'bg-red-900/30 text-red-400',
  expirada:  'bg-yellow-900/30 text-yellow-400',
};

export default function TabCotizaciones({ esSuperAdmin }: Props) {
  const [cotizaciones, setCotizaciones] = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    getCotizaciones().then((data) => { setCotizaciones(data); setLoading(false); });
  }, []);

  async function handleDelete(documentId: string) {
    setActionLoading(true);
    const ok = await eliminarCotizacion(documentId);
    setActionLoading(false);
    if (ok) {
      setCotizaciones((prev) => prev.filter((c) => c.documentId !== documentId));
      setConfirmDelete(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={20} className="animate-spin text-zinc-600" />
      </div>
    );
  }

  if (cotizaciones.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
          <FileText size={18} strokeWidth={1} className="text-zinc-600" />
        </div>
        <p className="text-zinc-500 text-sm">No hay cotizaciones registradas todavía.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-zinc-500 mb-4">{cotizaciones.length} cotizaciones</p>

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 flex items-center justify-center">
                <AlertTriangle size={18} className="text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Eliminar cotización</h3>
                <p className="text-xs text-zinc-500">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 border border-zinc-700 hover:border-zinc-500 transition-colors">
                Cancelar
              </button>
              <button onClick={() => handleDelete(confirmDelete)} disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-red-600 text-white hover:bg-red-500 transition-colors disabled:opacity-50">
                {actionLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-900/50 border-b border-zinc-800">
              {['Fecha', 'Cliente', 'Vehículo', 'Total', 'Estatus', 'Vigencia', ...(esSuperAdmin ? [''] : [])].map((h, i) => (
                <th key={i} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {cotizaciones.map((c) => (
              <tr key={c.documentId} className="hover:bg-zinc-900/40 transition-colors">
                <td className="px-4 py-3 text-sm text-zinc-400">
                  {c.fecha ? new Date(c.fecha).toLocaleDateString('es-MX') : '—'}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-white text-sm">{c.cliente?.nombre ?? 'Sin cliente'}</p>
                  <p className="text-[11px] text-zinc-600">{c.cliente?.correo ?? ''}</p>
                </td>
                <td className="px-4 py-3 text-sm text-zinc-400">
                  {c.vehiculo?.nombre ?? 'Sin vehículo'}
                </td>
                <td className="px-4 py-3 font-bold text-sm text-white">
                  ${c.total?.toLocaleString('es-MX') ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 ${
                    ESTATUS_COLOR[c.estatus] ?? ESTATUS_COLOR.borrador
                  }`}>
                    {c.estatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-zinc-400">
                  {c.vigencia ? new Date(c.vigencia).toLocaleDateString('es-MX') : '—'}
                </td>
                {esSuperAdmin && (
                  <td className="px-4 py-3">
                    <button onClick={() => setConfirmDelete(c.documentId)}
                      className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                      title="Eliminar">
                      <Trash2 size={13} strokeWidth={1.5} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}