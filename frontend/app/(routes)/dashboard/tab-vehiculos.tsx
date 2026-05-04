'use client';
import { useEffect, useState } from 'react';
import { getVehiculosAdmin, eliminarVehiculo, editarVehiculo } from '@/lib/api-admin';
import { exportarVehiculos } from '@/lib/export-excel';
import { getImagenUrl } from '@/lib/api-extended';
import Image from 'next/image';
import ExportButton from '@/components/export-button';
import { Loader2, ImageOff, Trash2, Pencil, X, Check, AlertTriangle } from 'lucide-react';

interface Props { esSuperAdmin: boolean; }

export default function TabVehiculos({ esSuperAdmin }: Props) {
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  function cargar() { setLoading(true); getVehiculosAdmin().then((d) => { setVehiculos(d); setLoading(false); }); }
  useEffect(() => { cargar(); }, []);

  async function handleDelete(docId: string) {
    setActionLoading(true);
    const ok = await eliminarVehiculo(docId);
    setActionLoading(false);
    if (ok) { setVehiculos((p) => p.filter((v) => v.documentId !== docId)); setConfirmDelete(null); }
  }

  function startEdit(v: any) {
    setEditando(v.documentId);
    setEditForm({ nombre: v.nombre, precio: v.precio, estatus: v.estatus, disponible: v.disponible, kilometraje: v.kilometraje });
  }

  async function handleEdit(docId: string) {
    setActionLoading(true);
    const ok = await editarVehiculo(docId, editForm);
    setActionLoading(false);
    if (ok) { setEditando(null); cargar(); }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 size={20} className="animate-spin text-zinc-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-zinc-500">{vehiculos.length} vehículos registrados</p>
        <ExportButton onClick={() => exportarVehiculos(vehiculos)} />
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 flex items-center justify-center"><AlertTriangle size={18} className="text-red-400" /></div>
              <div><h3 className="font-semibold text-white text-sm">Eliminar vehículo</h3><p className="text-xs text-zinc-500">Esta acción no se puede deshacer</p></div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-xs font-semibold uppercase text-zinc-400 border border-zinc-700 hover:border-zinc-500 transition-colors">Cancelar</button>
              <button onClick={() => handleDelete(confirmDelete)} disabled={actionLoading} className="px-4 py-2 text-xs font-semibold uppercase bg-red-600 text-white hover:bg-red-500 transition-colors disabled:opacity-50">{actionLoading ? 'Eliminando...' : 'Eliminar'}</button>
            </div>
          </div>
        </div>
      )}

      <div className="hidden md:block border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-900/50 border-b border-zinc-800">
              {['', 'Vehículo', 'Marca', 'Año', 'Tipo', 'Precio', 'Km', 'Estatus', ...(esSuperAdmin ? ['Acciones'] : [])].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {vehiculos.map((v) => {
              const imgUrl = getImagenUrl(v.Imagen);
              const isEd = editando === v.documentId;
              return (
                <tr key={v.documentId} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="px-4 py-3 w-14"><div className="w-10 h-10 overflow-hidden bg-zinc-800 flex items-center justify-center">{imgUrl ? <Image src={imgUrl} alt={v.nombre} width={40} height={40} className="object-cover w-full h-full" /> : <ImageOff size={14} className="text-zinc-600" />}</div></td>
                  <td className="px-4 py-3">{isEd ? <input type="text" value={editForm.nombre} onChange={(e) => setEditForm({...editForm, nombre: e.target.value})} className="bg-zinc-800 border border-zinc-700 text-white text-sm px-2 py-1 w-full" /> : <><p className="font-medium text-white text-sm">{v.nombre}</p><p className="text-[11px] text-zinc-600">{v.numero_serie}</p></>}</td>
                  <td className="px-4 py-3 text-sm text-zinc-400">{v.marca}</td>
                  <td className="px-4 py-3 text-sm text-zinc-400">{v.anio}</td>
                  <td className="px-4 py-3"><span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">{v.tipo}</span></td>
                  <td className="px-4 py-3">{isEd ? <input type="number" value={editForm.precio} onChange={(e) => setEditForm({...editForm, precio: Number(e.target.value)})} className="bg-zinc-800 border border-zinc-700 text-white text-sm px-2 py-1 w-24" /> : <span className="font-bold text-sm text-white">${v.precio?.toLocaleString('es-MX')}</span>}</td>
                  <td className="px-4 py-3">{isEd ? <input type="number" value={editForm.kilometraje} onChange={(e) => setEditForm({...editForm, kilometraje: Number(e.target.value)})} className="bg-zinc-800 border border-zinc-700 text-white text-sm px-2 py-1 w-24" /> : <span className="text-sm text-zinc-400">{v.kilometraje?.toLocaleString('es-MX')} km</span>}</td>
                  <td className="px-4 py-3">{isEd ? <select value={editForm.estatus} onChange={(e) => setEditForm({...editForm, estatus: e.target.value, disponible: e.target.value === 'disponible'})} className="bg-zinc-800 border border-zinc-700 text-white text-xs px-2 py-1"><option value="disponible">Disponible</option><option value="vendido">Vendido</option><option value="reservado">Reservado</option></select> : <span className={`text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 ${v.disponible ? 'bg-emerald-900/30 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>{v.estatus}</span>}</td>
                  {esSuperAdmin && (
                    <td className="px-4 py-3"><div className="flex items-center gap-1">
                      {isEd ? (<><button onClick={() => handleEdit(v.documentId)} disabled={actionLoading} className="w-8 h-8 flex items-center justify-center text-emerald-400 hover:bg-emerald-900/30 transition-colors"><Check size={14} strokeWidth={2} /></button><button onClick={() => setEditando(null)} className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:bg-zinc-800 transition-colors"><X size={14} strokeWidth={2} /></button></>) : (<><button onClick={() => startEdit(v)} className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-amber-500 hover:bg-amber-600/10 transition-colors"><Pencil size={13} strokeWidth={1.5} /></button><button onClick={() => setConfirmDelete(v.documentId)} className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-900/20 transition-colors"><Trash2 size={13} strokeWidth={1.5} /></button></>)}
                    </div></td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {vehiculos.map((v) => {
          const imgUrl = getImagenUrl(v.Imagen);
          return (
            <div key={v.documentId} className="p-4 border border-zinc-800 bg-zinc-900/30 flex items-center gap-4">
              <div className="w-14 h-14 overflow-hidden bg-zinc-800 shrink-0 flex items-center justify-center">{imgUrl ? <Image src={imgUrl} alt={v.nombre} width={56} height={56} className="object-cover w-full h-full" /> : <ImageOff size={16} className="text-zinc-600" />}</div>
              <div className="flex-1 min-w-0"><p className="font-medium text-white text-sm truncate">{v.nombre}</p><p className="text-xs text-zinc-500">{v.marca} · {v.anio}</p><p className="text-sm font-bold text-white mt-1">${v.precio?.toLocaleString('es-MX')}</p></div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 ${v.disponible ? 'bg-emerald-900/30 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>{v.estatus}</span>
                {esSuperAdmin && <div className="flex gap-1"><button onClick={() => startEdit(v)} className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-amber-500"><Pencil size={12} /></button><button onClick={() => setConfirmDelete(v.documentId)} className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-red-400"><Trash2 size={12} /></button></div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
