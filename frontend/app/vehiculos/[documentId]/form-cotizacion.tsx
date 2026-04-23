'use client';
// app/vehiculos/[documentId]/form-cotizacion.tsx
import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, LogIn, Calculator, FileDown } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { crearCotizacion } from '@/lib/api-extended';
import { generarPDFCotizacion } from '@/lib/pdf-generator';

interface Props {
  vehiculoDocumentId: string;
  vehiculoNombre: string;
  vehiculoPrecio: number;
  vehiculoMarca?: string;
  vehiculoModelo?: string;
  vehiculoAnio?: number;
}

// Calcula la mensualidad con fórmula de amortización francesa
function calcularMensualidad(monto: number, tasaAnual: number, meses: number): number {
  if (monto <= 0 || meses <= 0) return 0;
  const tasaMensual = tasaAnual / 100 / 12;
  if (tasaMensual === 0) return monto / meses;
  return (monto * tasaMensual * Math.pow(1 + tasaMensual, meses)) / (Math.pow(1 + tasaMensual, meses) - 1);
}

export default function FormCotizacion({
  vehiculoDocumentId,
  vehiculoNombre,
  vehiculoPrecio,
  vehiculoMarca = '',
  vehiculoModelo = '',
  vehiculoAnio = 0,
}: Props) {
  const { isSignedIn, user, isLoaded } = useUser();

  const [form, setForm] = useState({ nombre: '', correo: '', telefono: '', notas: '' });
  const [financiamiento, setFinanciamiento] = useState({
    engancheMonto: Math.round((vehiculoPrecio ?? 0) * 0.2),
    plazoMeses: 48,
    tasaAnual: 12.5,
  });
  const [loading, setLoading] = useState(false);
  const [exito, setExito]     = useState(false);
  const [error, setError]     = useState('');
  const [ultimaCotizacion, setUltimaCotizacion] = useState<any>(null);

  // Pre-llenar con datos del usuario
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setForm((prev) => ({
        ...prev,
        nombre: prev.nombre || user.fullName || '',
        correo: prev.correo || user.primaryEmailAddress?.emailAddress || '',
      }));
    }
  }, [isLoaded, isSignedIn, user]);

  // ── Cálculos derivados ───────────────────────────────────────────────────
  const precio         = vehiculoPrecio ?? 0;
  const enganche       = Math.min(Math.max(financiamiento.engancheMonto, 0), precio);
  const porcentajeEng  = precio > 0 ? ((enganche / precio) * 100).toFixed(1) : '0';
  const montoFinanciar = precio - enganche;
  const mensualidad    = calcularMensualidad(montoFinanciar, financiamiento.tasaAnual, financiamiento.plazoMeses);
  const totalPagar     = enganche + (mensualidad * financiamiento.plazoMeses);
  const interesesTotal = totalPagar - precio;

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

    const notas = `
Enganche: $${enganche.toLocaleString('es-MX')} (${porcentajeEng}%)
Plazo: ${financiamiento.plazoMeses} meses
Tasa anual: ${financiamiento.tasaAnual}%
Mensualidad estimada: $${Math.round(mensualidad).toLocaleString('es-MX')}
Total a pagar: $${Math.round(totalPagar).toLocaleString('es-MX')}
${form.notas ? '\nNotas del cliente: ' + form.notas : ''}
    `.trim();

    const ok = await crearCotizacion({
      nombre: form.nombre,
      correo: form.correo,
      telefono: form.telefono,
      notas,
      vehiculoDocumentId,
    });

    setLoading(false);
    if (ok) {
      setUltimaCotizacion({
        cliente: { ...form },
        vehiculo: { nombre: vehiculoNombre, marca: vehiculoMarca, modelo: vehiculoModelo, anio: vehiculoAnio, precio },
        financiamiento: {
          enganche, porcentajeEng, plazoMeses: financiamiento.plazoMeses,
          tasaAnual: financiamiento.tasaAnual, montoFinanciar,
          mensualidad, totalPagar, interesesTotal
        },
        fecha: new Date(),
        folio: 'COT-' + Date.now().toString().slice(-8),
      });
      setExito(true);
    } else {
      setError('No se pudo enviar la cotización. Por favor intenta de nuevo.');
    }
  }

  function descargarPDF() {
    if (ultimaCotizacion) generarPDFCotizacion(ultimaCotizacion);
  }

  // ── Estados de vista ──────────────────────────────────────────────────────

  if (!isLoaded) {
    return <div className="h-32 rounded-xl bg-zinc-50 dark:bg-zinc-900 animate-pulse" />;
  }

  if (!isSignedIn) {
    return (
      <div className="p-8 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-center">
        <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mx-auto mb-4">
          <LogIn size={18} strokeWidth={1.5} className="text-zinc-500" />
        </div>
        <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">Inicia sesión para cotizar</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">
          Para calcular financiamiento, guardar tu cotización y descargar el PDF, necesitas iniciar sesión.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/sign-in"
            className="inline-flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-full font-semibold text-sm hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors">
            Iniciar sesión <ArrowRight size={14} strokeWidth={2} />
          </Link>
          <Link href="/sign-up"
            className="inline-flex items-center justify-center gap-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-6 py-3 rounded-full font-semibold text-sm hover:border-zinc-500 transition-colors">
            Crear cuenta
          </Link>
        </div>
      </div>
    );
  }

  if (exito && ultimaCotizacion) {
    return (
      <div className="p-6 rounded-xl border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/10">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
            <CheckCircle size={18} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">Cotización generada</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Folio <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">{ultimaCotizacion.folio}</span> · Vigente por 14 días.
            </p>
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 mb-5 border border-zinc-100 dark:border-zinc-800">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1">Mensualidad</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                ${Math.round(mensualidad).toLocaleString('es-MX')}
                <span className="text-sm font-normal text-zinc-400 ml-1">/mes</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1">Total a pagar</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                ${Math.round(totalPagar).toLocaleString('es-MX')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={descargarPDF}
            className="inline-flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-full font-semibold text-sm hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors">
            Descargar cotización en PDF
            <FileDown size={14} strokeWidth={2} />
          </button>
          <button onClick={() => { setExito(false); setUltimaCotizacion(null); }}
            className="inline-flex items-center justify-center gap-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-6 py-3 rounded-full font-semibold text-sm hover:border-zinc-500 transition-colors">
            Nueva cotización
          </button>
        </div>
      </div>
    );
  }

  // ── Formulario principal ──────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Resumen del vehículo */}
      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
        <p className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">Vehículo seleccionado</p>
        <div className="flex items-center justify-between">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{vehiculoNombre}</p>
          <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
            ${precio.toLocaleString('es-MX')}
            <span className="text-xs font-normal text-zinc-400 ml-1">MXN</span>
          </p>
        </div>
      </div>

      {/* Calculadora financiera */}
      <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-2 mb-5">
          <Calculator size={16} strokeWidth={1.5} className="text-zinc-500" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Calculadora de financiamiento</h3>
        </div>

        <div className="space-y-5">
          {/* Enganche */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Enganche
              </label>
              <span className="text-xs text-zinc-400">{porcentajeEng}%</span>
            </div>
            <input type="number" value={financiamiento.engancheMonto} min="0" max={precio} step="1000"
              onChange={(e) => setFinanciamiento({ ...financiamiento, engancheMonto: Number(e.target.value) })}
              className={inputClass} />
            <input type="range" value={financiamiento.engancheMonto} min="0" max={precio} step="1000"
              onChange={(e) => setFinanciamiento({ ...financiamiento, engancheMonto: Number(e.target.value) })}
              className="w-full mt-2 accent-zinc-900 dark:accent-white" />
          </div>

          {/* Plazo */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
              Plazo: {financiamiento.plazoMeses} meses
            </label>
            <div className="flex flex-wrap gap-2">
              {[12, 24, 36, 48, 60].map((m) => (
                <button type="button" key={m}
                  onClick={() => setFinanciamiento({ ...financiamiento, plazoMeses: m })}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-colors
                    ${financiamiento.plazoMeses === m
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white'
                      : 'bg-transparent text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'}`}>
                  {m} meses
                </button>
              ))}
            </div>
          </div>

          {/* Tasa */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
              Tasa anual: {financiamiento.tasaAnual}%
            </label>
            <input type="range" value={financiamiento.tasaAnual} min="5" max="25" step="0.1"
              onChange={(e) => setFinanciamiento({ ...financiamiento, tasaAnual: Number(e.target.value) })}
              className="w-full accent-zinc-900 dark:accent-white" />
            <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
              <span>5%</span>
              <span>25%</span>
            </div>
          </div>

          {/* Resultado */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950">
              <p className="text-[10px] uppercase tracking-wider text-zinc-400 mb-0.5">Monto a financiar</p>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">${montoFinanciar.toLocaleString('es-MX')}</p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950">
              <p className="text-[10px] uppercase tracking-wider text-zinc-400 mb-0.5">Intereses totales</p>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">${Math.round(interesesTotal).toLocaleString('es-MX')}</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 col-span-2">
              <p className="text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-0.5">Mensualidad estimada</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                ${Math.round(mensualidad).toLocaleString('es-MX')}
                <span className="text-sm font-normal text-zinc-400 ml-1">/mes por {financiamiento.plazoMeses} meses</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Datos del cliente */}
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Tus datos
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" value={form.nombre} placeholder="Nombre completo *"
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className={inputClass} />
          <input type="email" value={form.correo} placeholder="Correo electrónico *"
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
            className={inputClass} />
        </div>
        <input type="tel" value={form.telefono} placeholder="Teléfono (opcional)"
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          className={inputClass} />
        <textarea rows={2} value={form.notas}
          placeholder="Notas adicionales (opcional)"
          onChange={(e) => setForm({ ...form, notas: e.target.value })}
          className={`${inputClass} resize-none`} />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={loading}
        className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50">
        {loading ? 'Generando cotización...' : 'Generar cotización'}
        {!loading && <ArrowRight size={14} strokeWidth={2} />}
      </button>
    </form>
  );
}
