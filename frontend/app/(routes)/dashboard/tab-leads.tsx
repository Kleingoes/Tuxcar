'use client';
// app/dashboard/tab-leads.tsx
import { useEffect, useState } from 'react';
import { getLeads, eliminarLead } from '@/lib/api-admin';
import { Loader2, MessageSquare, Trash2, AlertTriangle } from 'lucide-react';

interface Props {
  esSuperAdmin: boolean;
}

export default function TabLeads({ esSuperAdmin }: Props) {
  const [leads, setLeads]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    getLeads().then((data) => { setLeads(data); setLoading(false); });
  }, []);

  async function handleDelete(documentId: string) {
    setActionLoading(true);
    const ok = await eliminarLead(documentId);
    setActionLoading(false);
    if (ok) {
      setLeads((prev) => prev.filter((l) => l.documentId !== documentId));
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

  if (leads.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
          <MessageSquare size={18} strokeWidth={1} className="text-zinc-600" />
        </div>
        <p className="text-zinc-500 text-sm">No hay mensajes de contacto todavía.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-zinc-500 mb-4">{leads.length} mensajes recibidos</p>

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 flex items-center justify-center">
                <AlertTriangle size={18} className="text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Eliminar contacto</h3>
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
              {['Fecha', 'Nombre', 'Correo', 'Teléfono', 'Mensaje', ...(esSuperAdmin ? [''] : [])].map((h, i) => (
                <th key={i} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {leads.map((l) => (
              <tr key={l.documentId} className="hover:bg-zinc-900/40 transition-colors">
                <td className="px-4 py-3 text-sm text-zinc-400 whitespace-nowrap">
                  {l.createdAt ? new Date(l.createdAt).toLocaleDateString('es-MX') : '—'}
                </td>
                <td className="px-4 py-3 font-medium text-white text-sm">{l.nombre}</td>
                <td className="px-4 py-3 text-sm text-zinc-400">{l.correo}</td>
                <td className="px-4 py-3 text-sm text-zinc-400">{l.telefono || '—'}</td>
                <td className="px-4 py-3 text-sm text-zinc-400 max-w-xs">
                  <p className="truncate">{l.mensaje || '—'}</p>
                </td>
                {esSuperAdmin && (
                  <td className="px-4 py-3">
                    <button onClick={() => setConfirmDelete(l.documentId)}
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
