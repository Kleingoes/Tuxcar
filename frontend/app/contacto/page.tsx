'use client';
// app/contacto/page.tsx
import Navbar from '@/components/navbar';
import { useState, useEffect } from 'react';
import { ArrowRight, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { crearLead } from '@/lib/api-extended';

export default function ContactoPage() {
  const { isSignedIn, user, isLoaded } = useUser();

  const [form, setForm]       = useState({ nombre:'', correo:'', telefono:'', mensaje:'' });
  const [loading, setLoading] = useState(false);
  const [exito, setExito]     = useState(false);
  const [error, setError]     = useState('');

  // Pre-llenar con datos de Clerk cuando hay sesión
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setForm((prev) => ({
        ...prev,
        nombre: prev.nombre || user.fullName || '',
        correo: prev.correo || user.primaryEmailAddress?.emailAddress || '',
      }));
    }
  }, [isLoaded, isSignedIn, user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre || !form.correo) { setError('Nombre y correo son obligatorios.'); return; }
    setLoading(true); setError('');
    const ok = await crearLead(form);
    setLoading(false);
    if (ok) { setExito(true); setForm({ nombre:'', correo:'', telefono:'', mensaje:'' }); }
    else setError('No se pudo enviar el mensaje. Por favor intenta de nuevo.');
  }

  const inputClass = `
    w-full px-4 py-3 rounded-xl text-sm
    bg-zinc-50 dark:bg-zinc-900
    border border-zinc-200 dark:border-zinc-700
    text-zinc-900 dark:text-zinc-100
    placeholder-zinc-400 dark:placeholder-zinc-600
    focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500
    transition-colors
  `;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12">

        <div className="mb-14">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-2">
            Atención al cliente
          </p>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-3">Contáctanos</h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md text-base leading-relaxed">
            Déjanos tus datos y un asesor se pondrá en contacto contigo a la brevedad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Formulario */}
          <div className="lg:col-span-2">

            {/* Badge de sesión */}
            {isSignedIn && !exito && (
              <div className="mb-5 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 px-4 py-2.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 w-fit">
                <CheckCircle size={13} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
                <span>Datos pre-llenados desde tu cuenta</span>
              </div>
            )}

            {exito ? (
              <div className="py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={20} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Mensaje recibido</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
                  Gracias por contactarnos. Un asesor te escribirá pronto.
                </p>
                <button onClick={() => setExito(false)}
                  className="text-sm text-zinc-400 underline underline-offset-4 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                    Mensaje
                  </label>
                  <textarea rows={5} value={form.mensaje}
                    placeholder="¿En qué vehículo estás interesado? ¿Tienes alguna pregunta sobre financiamiento o servicio?"
                    onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                    className={`${inputClass} resize-none`} />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button type="submit" disabled={loading}
                  className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50">
                  {loading ? 'Enviando...' : 'Enviar mensaje'}
                  {!loading && <ArrowRight size={14} strokeWidth={2} />}
                </button>
              </form>
            )}
          </div>

          {/* Info de contacto */}
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-6">
              Información de contacto
            </p>

            {[
              { Icon: MapPin, label: 'Dirección',  value: 'Blvd. Andrés Serra Rojas 1200\nTuxtla Gutiérrez, Chiapas' },
              { Icon: Phone,  label: 'Teléfono',   value: '961 123 4567' },
              { Icon: Mail,   label: 'Correo',     value: 'ventas@tuxcar.com' },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  <Icon size={14} strokeWidth={1.5} className="text-zinc-500 dark:text-zinc-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 whitespace-pre-line">{value}</p>
                </div>
              </div>
            ))}

            <div className="mt-6 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <p className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">Horario de atención</p>
              <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>Lunes a Viernes</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">9:00 — 19:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábado</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">9:00 — 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingo</span>
                  <span className="text-zinc-400">Cerrado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}