'use client';
// app/dashboard/form-nuevo-vehiculo.tsx
import { useState } from 'react';
import { ArrowRight, CheckCircle, Upload, X } from 'lucide-react';
import { crearVehiculo, subirImagenVehiculo } from '@/lib/api-admin';

interface Props {
  onSuccess: () => void;
}

const TIPOS        = ['sedan', 'suv', 'pickup', 'hatchback', 'coupe', 'van'];
const TRANSMISION  = ['automatica', 'manual'];
const COMBUSTIBLE  = ['gasolina', 'diesel', 'hibrido', 'electrico'];

export default function FormNuevoVehiculo({ onSuccess }: Props) {
  const [form, setForm] = useState({
    nombre: '', marca: '', modelo: '', anio: 2025, color: '',
    precio: 0, kilometraje: 0, tipo: 'sedan', transmision: 'automatica',
    combustible: 'gasolina', puertas: 4, numero_serie: '', descripcion: '',
  });
  const [imagen, setImagen]   = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exito, setExito]     = useState(false);
  const [error, setError]     = useState('');

  const inputClass = `
    w-full px-4 py-3 rounded-xl text-sm
    bg-zinc-50 dark:bg-zinc-900
    border border-zinc-200 dark:border-zinc-700
    text-zinc-900 dark:text-zinc-100
    placeholder-zinc-400 dark:placeholder-zinc-600
    focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500
    transition-colors
  `;

  const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2';

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Solo se permiten imágenes'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('La imagen no debe superar 5MB'); return; }
    setImagen(file);
    setPreview(URL.createObjectURL(file));
    setError('');
  }

  function removeImage() {
    setImagen(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre || !form.marca || !form.modelo || !form.numero_serie) {
      setError('Nombre, marca, modelo y número de serie son obligatorios.');
      return;
    }
    if (form.precio <= 0) { setError('El precio debe ser mayor a 0.'); return; }

    setLoading(true);
    setError('');

    const result = await crearVehiculo(form);

    if (!result.ok) {
      setLoading(false);
      setError('No se pudo crear el vehículo. Verifica los datos e intenta de nuevo.');
      return;
    }

    // Subir imagen si hay una
    if (imagen && result.documentId) {
      // Necesitamos el ID numérico, vamos a buscarlo
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:1337';
        const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN ?? '';
        const res = await fetch(`${API_URL}/api/vehiculos/${result.documentId}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
          },
        });
        const json = await res.json();
        const vehiculoId = json.data?.id;
        if (vehiculoId) {
          await subirImagenVehiculo(imagen, vehiculoId);
        }
      } catch (e) {
        console.error('Error subiendo imagen:', e);
      }
    }

    setLoading(false);
    setExito(true);
  }

  if (exito) {
    return (
      <div className="max-w-lg py-16 text-center mx-auto">
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={20} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Vehículo registrado</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
          El vehículo se agregó correctamente al inventario.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={onSuccess}
            className="text-sm font-medium text-zinc-500 underline underline-offset-4 hover:text-zinc-700 transition-colors">
            Ver inventario
          </button>
          <button onClick={() => {
            setExito(false);
            setForm({ nombre:'', marca:'', modelo:'', anio:2025, color:'', precio:0, kilometraje:0,
              tipo:'sedan', transmision:'automatica', combustible:'gasolina', puertas:4, numero_serie:'', descripcion:'' });
            removeImage();
          }}
            className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors">
            Agregar otro
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">

      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500">
        Información del vehículo
      </p>

      {/* Imagen */}
      <div>
        <label className={labelClass}>Imagen del vehículo</label>
        {preview ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-2">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button type="button" onClick={removeImage}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors">
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors">
            <Upload size={20} className="text-zinc-400 mb-2" />
            <span className="text-sm text-zinc-400">Selecciona una imagen</span>
            <span className="text-[11px] text-zinc-400 mt-1">JPG, PNG, WEBP — máx. 5MB</span>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        )}
      </div>

      {/* Datos principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nombre <span className="text-red-400">*</span></label>
          <input type="text" value={form.nombre} placeholder="Volkswagen Jetta 2021"
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>No. de Serie <span className="text-red-400">*</span></label>
          <input type="text" value={form.numero_serie} placeholder="VW-JET-2021-001"
            onChange={(e) => setForm({ ...form, numero_serie: e.target.value })}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Marca <span className="text-red-400">*</span></label>
          <input type="text" value={form.marca} placeholder="Volkswagen"
            onChange={(e) => setForm({ ...form, marca: e.target.value })}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Modelo <span className="text-red-400">*</span></label>
          <input type="text" value={form.modelo} placeholder="Jetta"
            onChange={(e) => setForm({ ...form, modelo: e.target.value })}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Año</label>
          <input type="number" value={form.anio} min="1990" max="2027"
            onChange={(e) => setForm({ ...form, anio: Number(e.target.value) })}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Color</label>
          <input type="text" value={form.color} placeholder="Blanco"
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Precio (MXN) <span className="text-red-400">*</span></label>
          <input type="number" value={form.precio} min="0" step="1000"
            onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Kilometraje</label>
          <input type="number" value={form.kilometraje} min="0"
            onChange={(e) => setForm({ ...form, kilometraje: Number(e.target.value) })}
            className={inputClass} />
        </div>
      </div>

      {/* Selects */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Tipo</label>
          <select value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            className={inputClass}>
            {TIPOS.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Transmisión</label>
          <select value={form.transmision}
            onChange={(e) => setForm({ ...form, transmision: e.target.value })}
            className={inputClass}>
            {TRANSMISION.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Combustible</label>
          <select value={form.combustible}
            onChange={(e) => setForm({ ...form, combustible: e.target.value })}
            className={inputClass}>
            {COMBUSTIBLE.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Puertas</label>
        <div className="flex gap-2">
          {[2, 4, 5].map((p) => (
            <button type="button" key={p}
              onClick={() => setForm({ ...form, puertas: p })}
              className={`px-5 py-2 rounded-full text-xs font-semibold border transition-colors
                ${form.puertas === p
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white'
                  : 'bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'}`}>
              {p} puertas
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Descripción</label>
        <textarea rows={3} value={form.descripcion}
          placeholder="Descripción adicional del vehículo..."
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          className={`${inputClass} resize-none`} />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={loading}
        className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50">
        {loading ? 'Registrando...' : 'Registrar vehículo'}
        {!loading && <ArrowRight size={14} strokeWidth={2} />}
      </button>
    </form>
  );
}
