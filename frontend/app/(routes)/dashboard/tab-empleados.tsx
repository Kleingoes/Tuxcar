'use client';
// app/dashboard/tab-empleados.tsx
import { useEffect, useState } from 'react';
import { getEmpleados, eliminarEmpleado, editarEmpleado, crearEmpleado } from '@/lib/api-empleados';
import { Loader2, Users, Trash2, Pencil, X, Check, AlertTriangle, Plus, UserPlus } from 'lucide-react';

interface Props { esSuperAdmin: boolean; }

export default function TabEmpleados({ esSuperAdmin }: Props) {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newForm, setNewForm] = useState({ nombre: '', puesto: '', telefono: '', correo: '', fecha_ingreso: '', activo: true });
  const [formError, setFormError] = useState('');

  function cargar() { setLoading(true); getEmpleados().then((d) => { setEmpleados(d); setLoading(false); }); }
  useEffect(() => { cargar(); }, []);

  async function handleDelete(docId: string) {
    setActionLoading(true);
    const ok = await eliminarEmpleado(docId);
    setActionLoading(false);
    if (ok) { setEmpleados((p) => p.filter((e) => e.documentId !== docId)); setConfirmDelete(null); }
  }

  function startEdit(e: any) {
    setEditando(e.documentId);
    setEditForm({ nombre: e.nombre, puesto: e.puesto, telefono: e.telefono, correo: e.correo, activo: e.activo });
  }

  async function handleEdit(docId: string) {
    setActionLoading(true);
    const ok = await editarEmpleado(docId, editForm);
    setActionLoading(false);
    if (ok) { setEditando(null); cargar(); }
  }

  async function handleCreate(ev: React.FormEvent) {
    ev.preventDefault();
    if (!newForm.nombre || !newForm.puesto || !newForm.correo) {
      setFormError('Nombre, puesto y correo son obligatorios.');
      return;
    }
    setActionLoading(true); setFormError('');
    const result = await crearEmpleado({
      ...newForm,
      fecha_ingreso: newForm.fecha_ingreso || new Date().toISOString().slice(0, 10),
    });
    setActionLoading(false);
    if (result.ok) {
      setShowForm(false);
      setNewForm({ nombre: '', puesto: '', telefono: '', correo: '', fecha_ingreso: '', activo: true });
      cargar();
    } else {
      setFormError('No se pudo crear el empleado.');
    }
  }

  const inputClass = 'bg-zinc-800 border border-zinc-700 text-white text-sm px-3 py-2 focus:outline-none focus:border-amber-600/50 transition-colors w-full';
  const labelClass = 'block text-[10px] font-semibold uppercase tracking-wider text-zinc-600 mb-1';

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 size={20} className="animate-spin text-zinc-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-zinc-500">{empleados.length} empleados registrados</p>
        {esSuperAdmin && (
          <button onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-600 text-white hover:bg-amber-500 transition-colors">
            <UserPlus size={12} strokeWidth={1.5} />
            Nuevo empleado
          </button>
        )}
      </div>

      {/* Form crear empleado */}
      {showForm && esSuperAdmin && (
        <form onSubmit={handleCreate} className="border border-zinc-800 bg-zinc-900/50 p-5 mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 mb-4">Registrar nuevo empleado</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div><label className={labelClass}>Nombre <span className="text-amber-600">*</span></label><input type="text" value={newForm.nombre} placeholder="Juan Pérez" onChange={(e) => setNewForm({...newForm, nombre: e.target.value})} className={inputClass} /></div>
            <div><label className={labelClass}>Puesto <span className="text-amber-600">*</span></label><input type="text" value={newForm.puesto} placeholder="Asesor de ventas" onChange={(e) => setNewForm({...newForm, puesto: e.target.value})} className={inputClass} /></div>
            <div><label className={labelClass}>Correo <span className="text-amber-600">*</span></label><input type="email" value={newForm.correo} placeholder="juan@tuxcar.com" onChange={(e) => setNewForm({...newForm, correo: e.target.value})} className={inputClass} /></div>
            <div><label className={labelClass}>Teléfono</label><input type="tel" value={newForm.telefono} placeholder="961 123 4567" onChange={(e) => setNewForm({...newForm, telefono: e.target.value})} className={inputClass} /></div>
            <div><label className={labelClass}>Fecha de ingreso</label><input type="date" value={newForm.fecha_ingreso} onChange={(e) => setNewForm({...newForm, fecha_ingreso: e.target.value})} className={inputClass} /></div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400 py-2">
                <input type="checkbox" checked={newForm.activo} onChange={(e) => setNewForm({...newForm, activo: e.target.checked})} className="w-4 h-4 accent-amber-600" />
                Activo
              </label>
            </div>
          </div>
          {formError && <p className="text-sm text-red-400 mb-3">{formError}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={actionLoading} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-600 text-white hover:bg-amber-500 transition-colors disabled:opacity-50">
              {actionLoading ? 'Guardando...' : 'Registrar empleado'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 border border-zinc-700 hover:border-zinc-500 transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 flex items-center justify-center"><AlertTriangle size={18} className="text-red-400" /></div>
              <div><h3 className="font-semibold text-white text-sm">Eliminar empleado</h3><p className="text-xs text-zinc-500">Esta acción no se puede deshacer</p></div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-xs font-semibold uppercase text-zinc-400 border border-zinc-700 hover:border-zinc-500 transition-colors">Cancelar</button>
              <button onClick={() => handleDelete(confirmDelete)} disabled={actionLoading} className="px-4 py-2 text-xs font-semibold uppercase bg-red-600 text-white hover:bg-red-500 transition-colors disabled:opacity-50">{actionLoading ? 'Eliminando...' : 'Eliminar'}</button>
            </div>
          </div>
        </div>
      )}

      {empleados.length === 0 && !showForm ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 border border-zinc-800 flex items-center justify-center mx-auto mb-4"><Users size={18} strokeWidth={1} className="text-zinc-600" /></div>
          <p className="text-zinc-500 text-sm">No hay empleados registrados todavía.</p>
        </div>
      ) : (
        <div className="hidden md:block border border-zinc-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-zinc-800">
                {['Nombre', 'Puesto', 'Correo', 'Teléfono', 'Ingreso', 'Estado', ...(esSuperAdmin ? ['Acciones'] : [])].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {empleados.map((e) => {
                const isEd = editando === e.documentId;
                return (
                  <tr key={e.documentId} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="px-4 py-3">
                      {isEd ? <input type="text" value={editForm.nombre} onChange={(ev) => setEditForm({...editForm, nombre: ev.target.value})} className="bg-zinc-800 border border-zinc-700 text-white text-sm px-2 py-1 w-full" /> : <p className="font-medium text-white text-sm">{e.nombre}</p>}
                    </td>
                    <td className="px-4 py-3">
                      {isEd ? <input type="text" value={editForm.puesto} onChange={(ev) => setEditForm({...editForm, puesto: ev.target.value})} className="bg-zinc-800 border border-zinc-700 text-white text-xs px-2 py-1 w-full" /> : <span className="text-sm text-zinc-400">{e.puesto}</span>}
                    </td>
                    <td className="px-4 py-3">
                      {isEd ? <input type="email" value={editForm.correo} onChange={(ev) => setEditForm({...editForm, correo: ev.target.value})} className="bg-zinc-800 border border-zinc-700 text-white text-xs px-2 py-1 w-full" /> : <span className="text-sm text-zinc-400">{e.correo}</span>}
                    </td>
                    <td className="px-4 py-3">
                      {isEd ? <input type="tel" value={editForm.telefono} onChange={(ev) => setEditForm({...editForm, telefono: ev.target.value})} className="bg-zinc-800 border border-zinc-700 text-white text-xs px-2 py-1 w-24" /> : <span className="text-sm text-zinc-400">{e.telefono || '—'}</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-400">
                      {e.fecha_ingreso ? new Date(e.fecha_ingreso).toLocaleDateString('es-MX') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {isEd ? (
                        <select value={editForm.activo ? 'activo' : 'inactivo'} onChange={(ev) => setEditForm({...editForm, activo: ev.target.value === 'activo'})} className="bg-zinc-800 border border-zinc-700 text-white text-xs px-2 py-1">
                          <option value="activo">Activo</option>
                          <option value="inactivo">Inactivo</option>
                        </select>
                      ) : (
                        <span className={`text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 ${e.activo ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'}`}>
                          {e.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      )}
                    </td>
                    {esSuperAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {isEd ? (
                            <>
                              <button onClick={() => handleEdit(e.documentId)} disabled={actionLoading} className="w-8 h-8 flex items-center justify-center text-emerald-400 hover:bg-emerald-900/30 transition-colors"><Check size={14} strokeWidth={2} /></button>
                              <button onClick={() => setEditando(null)} className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:bg-zinc-800 transition-colors"><X size={14} strokeWidth={2} /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEdit(e)} className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-amber-500 hover:bg-amber-600/10 transition-colors"><Pencil size={13} strokeWidth={1.5} /></button>
                              <button onClick={() => setConfirmDelete(e.documentId)} className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-900/20 transition-colors"><Trash2 size={13} strokeWidth={1.5} /></button>
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
      )}

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {empleados.map((e) => (
          <div key={e.documentId} className="p-4 border border-zinc-800 bg-zinc-900/30 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-white text-sm truncate">{e.nombre}</p>
              <p className="text-xs text-zinc-500">{e.puesto} · {e.correo}</p>
              <span className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 mt-1 inline-block ${e.activo ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'}`}>
                {e.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            {esSuperAdmin && (
              <div className="flex gap-1 shrink-0">
                <button onClick={() => startEdit(e)} className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-amber-500"><Pencil size={12} /></button>
                <button onClick={() => setConfirmDelete(e.documentId)} className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-red-400"><Trash2 size={12} /></button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
