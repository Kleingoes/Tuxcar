'use client';
// app/dashboard/form-nueva-refaccion.tsx
import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { crearRefaccion } from '@/lib/api-admin';

interface Props {
  onSuccess: () => void;
}

export default function FormNuevaRefaccion({ onSuccess }: Props) {
  const [form, setForm] = useState({
    nombre: '', descripcion: '', precio: 0, stock: 0,
    marca: '', categoria: '', numero_refaccion: '',
  });
  const [loading, setLoading] = useState(false);
  const [exito, setExito]     = useState(false);
  const [error, setError]     = useState('');

  const inputClass = `
    w-full px-4 py-3 text-sm
    bg-zinc-900 border border-zinc-800
    text-white placeholder-zinc-600
    focus:outline-none focus:border-amber-600/50
    transition-colors
  `;
  const labelClass = 'block text-[10px] font-semibold uppercase tracking-wider text-zinc-600 mb-2';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre || !form.numero_refaccion || !form.marca || !form.categoria) {
      setError('Nombre, número de parte, marca y categoría son obligatorios.');
      return;
    }
    if (form.precio <= 0) { setError('El precio debe ser mayor a 0.'); return; }

    setLoading(true);
    setError('');
    const result = await crearRefaccion(form);
    setLoading(false);

    if (!result.ok) {
      setError('No se pudo crear la refacción. Verifica los datos.');
      return;
    }
    setExito(true);
  }

  if (exito) {
    return (
      <div className="max-w-lg py-16 text-center mx-auto">
        <div className="w-12 h-12 bg-amber-600/10 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={20} strokeWidth={1.5} className="text-amber-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Refacción registrada</h2>
        <p className="text-zinc-500 text-sm mb-6">
          La refacción se agregó correctamente al inventario.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={onSuccess}
            className="text-sm text-zinc-500 underline underline-offset-4 hover:text-zinc-300 transition-colors">
            Ver inventario
          </button>
          <button onClick={() => {
            setExito(false);
            setForm({ nombre:'', descripcion:'', precio:0, stock:0, marca:'', categoria:'', numero_refaccion:'' });
          }}
            className="inline-flex items-center gap-2 bg-amber-600 text-white px-5 py-2.5 text-sm font-semibold uppercase tracking-wider hover:bg-amber-500 transition-colors">
            Agregar otra
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <p className="text-[11px] font-semibold tracking-[0.35em] uppercase text-amber-600">
        Información de la refacción
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nombre <span className="text-amber-600">*</span></label>
          <input type="text" value={form.nombre} placeholder="Pastillas de freno delanteras"
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>No. de Parte <span className="text-amber-600">*</span></label>
          <input type="text" value={form.numero_refaccion} placeholder="BRK-TOY-001"
            onChange={(e) => setForm({ ...form, numero_refaccion: e.target.value })}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Marca <span className="text-amber-600">*</span></label>
          <input type="text" value={form.marca} placeholder="Toyota"
            onChange={(e) => setForm({ ...form, marca: e.target.value })}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Categoría <span className="text-amber-600">*</span></label>
          <input type="text" value={form.categoria} placeholder="Frenos"
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Precio (MXN) <span className="text-amber-600">*</span></label>
          <input type="number" value={form.precio} min="0" step="10"
            onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Stock (unidades)</label>
          <input type="number" value={form.stock} min="0"
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Descripción</label>
        <textarea rows={3} value={form.descripcion}
          placeholder="Descripción adicional de la refacción..."
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          className={`${inputClass} resize-none`} />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button type="submit" disabled={loading}
        className="inline-flex items-center gap-3 bg-amber-600 text-white px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-amber-500 transition-colors disabled:opacity-50">
        {loading ? 'Registrando...' : 'Registrar refacción'}
        {!loading && <ArrowRight size={16} strokeWidth={2} />}
      </button>
    </form>
  );
}
