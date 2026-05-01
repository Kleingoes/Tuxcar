'use client';
// app/dashboard/tab-refacciones.tsx
import { useEffect, useState } from 'react';
import { getRefaccionesAdmin, eliminarRefaccion, editarRefaccion } from '@/lib/api-admin';
import { Loader2, Cog, Trash2, Pencil, X, Check, AlertTriangle } from 'lucide-react';

interface Props {
  esSuperAdmin: boolean;
}

export default function TabRefacciones({ esSuperAdmin }: Props) {
  const [refacciones, setRefacciones] = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [editando, setEditando]       = useState<string | null>(null);
  const [editForm, setEditForm]       = useState<any>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  function cargar() {
    setLoading(true);
    getRefaccionesAdmin().then((data) => { setRefacciones(data); setLoading(false); });
  }

  useEffect(() => { cargar(); }, []);

  async function handleDelete(documentId: string) {
    setActionLoading(true);
    const ok = await eliminarRefaccion(documentId);
    setActionLoading(false);
    if (ok) {
      setRefacciones((prev) => prev.filter((r) => r.documentId !== documentId));
      setConfirmDelete(null);
    }
  }

  function startEdit(r: any) {
    setEditando(r.documentId);
    setEditForm({
      nombre: r.nombre, precio: r.precio, stock: r.stock,
      categoria: r.categoria, marca: r.marca,
    });
  }

  async function handleEdit(documentId: string) {
    setActionLoading(true);
    const ok = await editarRefaccion(documentId, editForm);
    setActionLoading(false);
    if (ok) {
      setEditando(null);
      cargar();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={20} className="animate-spin text-zinc-600" />
      </div>
    );
  }

  if (refacciones.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
          <Cog size={18} strokeWidth={1} className="text-zinc-600" />
        </div>
        <p className="text-zinc-500 text-sm">No hay refacciones registradas todavía.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-zinc-500 mb-4">{refacciones.length} refacciones registradas</p>

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 flex items-center justify-center">
                <AlertTriangle size={18} className="text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Eliminar refacción</h3>
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

      {/* Desktop table */}
      <div className="hidden md:block border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-900/50 border-b border-zinc-800">
              {['Refacción', 'No. Parte', 'Categoría', 'Marca', 'Stock', 'Precio', ...(esSuperAdmin ? ['Acciones'] : [])].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {refacciones.map((r) => {
              const isEditing = editando === r.documentId;
              return (
                <tr key={r.documentId} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input type="text" value={editForm.nombre}
                        onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                        className="bg-zinc-800 border border-zinc-700 text-white text-sm px-2 py-1 w-full" />
                    ) : (
                      <>
                        <p className="font-medium text-white text-sm">{r.nombre}</p>
                        {r.descripcion && <p className="text-[11px] text-zinc-600 mt-0.5 line-clamp-1">{r.descripcion}</p>}
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500 font-mono">{r.numero_refaccion}</td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input type="text" value={editForm.categoria}
                        onChange={(e) => setEditForm({ ...editForm, categoria: e.target.value })}
                        className="bg-zinc-800 border border-zinc-700 text-white text-xs px-2 py-1 w-24" />
                    ) : (
                      <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">{r.categoria}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input type="text" value={editForm.marca}
                        onChange={(e) => setEditForm({ ...editForm, marca: e.target.value })}
                        className="bg-zinc-800 border border-zinc-700 text-white text-xs px-2 py-1 w-24" />
                    ) : (
                      <span className="text-sm text-zinc-400">{r.marca}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input type="number" value={editForm.stock}
                        onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                        className="bg-zinc-800 border border-zinc-700 text-white text-sm px-2 py-1 w-16" />
                    ) : (
                      <>
                        <span className={`text-sm font-bold ${r.stock > 5 ? 'text-emerald-400' : r.stock > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                          {r.stock}
                        </span>
                        <span className="text-[10px] text-zinc-600 ml-1">uds</span>
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input type="number" value={editForm.precio}
                        onChange={(e) => setEditForm({ ...editForm, precio: Number(e.target.value) })}
                        className="bg-zinc-800 border border-zinc-700 text-white text-sm px-2 py-1 w-20" />
                    ) : (
                      <span className="font-bold text-white text-sm">${r.precio?.toLocaleString('es-MX')}</span>
                    )}
                  </td>
                  {esSuperAdmin && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {isEditing ? (
                          <>
                            <button onClick={() => handleEdit(r.documentId)} disabled={actionLoading}
                              className="w-8 h-8 flex items-center justify-center text-emerald-400 hover:bg-emerald-900/30 transition-colors">
                              <Check size={14} strokeWidth={2} />
                            </button>
                            <button onClick={() => setEditando(null)}
                              className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:bg-zinc-800 transition-colors">
                              <X size={14} strokeWidth={2} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(r)}
                              className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-amber-500 hover:bg-amber-600/10 transition-colors"
                              title="Editar">
                              <Pencil size={13} strokeWidth={1.5} />
                            </button>
                            <button onClick={() => setConfirmDelete(r.documentId)}
                              className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                              title="Eliminar">
                              <Trash2 size={13} strokeWidth={1.5} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {refacciones.map((r) => (
          <div key={r.documentId} className="p-4 border border-zinc-800 bg-zinc-900/30 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-white text-sm truncate">{r.nombre}</p>
              <p className="text-xs text-zinc-500">{r.categoria} · {r.marca}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm font-bold text-white">${r.precio?.toLocaleString('es-MX')}</span>
                <span className={`text-xs font-bold ${r.stock > 5 ? 'text-emerald-400' : r.stock > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                  {r.stock} uds
                </span>
              </div>
            </div>
            {esSuperAdmin && (
              <div className="flex gap-1 shrink-0">
                <button onClick={() => startEdit(r)}
                  className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-amber-500 transition-colors">
                  <Pencil size={12} />
                </button>
                <button onClick={() => setConfirmDelete(r.documentId)}
                  className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-red-400 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
