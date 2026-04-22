'use client';
// app/vehiculos/[documentId]/form-cotizacion.tsx
import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, LogIn } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { crearCotizacion } from '@/lib/api-extended';

interface Props {
  vehiculoDocumentId: string;
  vehiculoNombre: string;
  vehiculoPrecio: number;
}

export default function FormCotizacion({ vehiculoDocumentId, vehiculoNombre, vehiculoPrecio }: Props) {
  const { isSignedIn, user, isLoaded } = useUser();
  const [form, setForm]       = useState({ nombre: '', correo: '', telefono: '', notas: '' });
  const [loading, setLoading] = useState(false);
  const [exito, setExito]     = useState(false);
  const [error, setError]     = useState('');

  // Pre-llenar con datos del usuario autenticado
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setForm((prev) => ({
        ...prev,
        nombre: user.fullName ?? '',
        correo: user.primaryEmailAddress?.emailAddress ?? '',
      }));
    }
  }, [isLoaded, isSignedIn, user]);

  const inputClass = `
    w-full px-4 py-3 rounded-xl text-sm
    bg-zinc-50 dark:bg-zinc-900
    border border-zinc-200 dark:border-zinc-700
    text-zinc-900 dark:text-zinc-100
    placeholder-zinc-400 dark:placeholder-zinc-600
    focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500
    transition-colors
  `;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre || !form.correo) {
      setError('Nombre y correo son obligatorios.');
      return;
    }
    setLoading(true);
    setError('');

    const ok = await crearCotizacion({
      nombre: form.nombre,
      correo: form.correo,
      telefono: form.telefono,
      notas: form.notas,
      vehiculoDocumentId,
    });

    setLoading(false);
    if (ok) {
      setExito(true);
      setForm({ nombre: '', correo: '', telefono: '', notas: '' });
    } else {
      setError('No se pudo enviar la cotización. Por favor intenta de nuevo.');
    }
  }

  // Estado de carga de Clerk
  if (!isLoaded) {
    return (
      <div className="h-32 rounded-xl bg-zinc-50 dark:bg-zinc-900 animate-pulse" />
    );
  }

  // No hay sesión → pedir inicio de sesión
  if (!isSignedIn) {
    return (
      <div className="p-8 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-center">
        <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mx-auto mb-4">
          <LogIn size={18} strokeWidth={1.5} className="text-zinc-500" />
        </div>
        <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">Inicia sesión para cotizar</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">
          Para darte seguimiento personalizado y guardar tu cotización, necesitas iniciar sesión.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/sign-in"
            className="inline-flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-full font-semibold text-sm hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors">
            Iniciar sesión
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
          <Link href="/sign-up"
            className="inline-flex items-center justify-center gap-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-6 py-3 rounded-full font-semibold text-sm hover:border-zinc-500 dark:hover:border-zinc-500 transition-colors">
            Crear cuenta
          </Link>
        </div>
      </div>
    );
  }

  // Sesión iniciada + cotización enviada
  if (exito) {
    return (
      <div className="flex flex-col items-start gap-4 py-8">
        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <CheckCircle size={18} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">Cotización enviada</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Tu solicitud para el <span className="font-medium text-zinc-700 dark:text-zinc-300">{vehiculoNombre}</span> fue recibida.
            Un asesor se pondrá en contacto contigo pronto.
          </p>
        </div>
        <button onClick={() => setExito(false)}
          className="text-xs text-zinc-400 underline underline-offset-4 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  // Sesión iniciada + formulario
  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 mb-6">
        <p className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">Vehículo seleccionado</p>
        <div className="flex items-center justify-between">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{vehiculoNombre}</p>
          <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
            ${vehiculoPrecio?.toLocaleString('es-MX')}
            <span className="text-xs font-normal text-zinc-400 ml-1">MXN</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
            Nombre completo <span className="text-red-400">*</span>
          </label>
          <input type="text" value={form.nombre} placeholder="Juan Pérez"
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
            Correo electrónico <span className="text-red-400">*</span>
          </label>
          <input type="email" value={form.correo} placeholder="juan@correo.com"
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
            className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
          Teléfono
        </label>
        <input type="tel" value={form.telefono} placeholder="961 123 4567"
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          className={inputClass} />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
          Notas adicionales
        </label>
        <textarea rows={3} value={form.notas}
          placeholder="¿Tienes alguna pregunta sobre el vehículo? ¿Necesitas financiamiento?"
          onChange={(e) => setForm({ ...form, notas: e.target.value })}
          className={`${inputClass} resize-none`} />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={loading}
        className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50">
        {loading ? 'Enviando...' : 'Solicitar cotización'}
        {!loading && <ArrowRight size={14} strokeWidth={2} />}
      </button>
    </form>
  );
}
