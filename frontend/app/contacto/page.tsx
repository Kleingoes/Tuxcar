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
    w-full px-4 py-3 text-sm
    bg-zinc-900 border border-zinc-800
    text-white placeholder-zinc-600
    focus:outline-none focus:border-amber-600/50
    transition-colors
  `;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(194,154,108,0.1),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <p className="text-[11px] font-semibold tracking-[0.35em] uppercase text-amber-600 mb-4">
            Atención al cliente
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">Contáctanos</h1>
          <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
            Déjanos tus datos y un asesor se pondrá en contacto contigo a la brevedad.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Formulario */}
          <div className="lg:col-span-2">
            {isSignedIn && !exito && (
              <div className="mb-6 flex items-center gap-2 text-[11px] text-amber-500 px-3 py-2 bg-amber-600/5 border border-amber-600/20 w-fit">
                <CheckCircle size={12} strokeWidth={1.5} />
                <span>Datos pre-llenados desde tu cuenta</span>
              </div>
            )}

            {exito ? (
              <div className="py-20 text-center">
                <div className="w-12 h-12 bg-amber-600/10 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={20} strokeWidth={1.5} className="text-amber-500" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Mensaje recibido</h2>
                <p className="text-zinc-500 text-sm mb-6">
                  Gracias por contactarnos. Un asesor te escribirá pronto.
                </p>
                <button onClick={() => setExito(false)}
                  className="text-sm text-zinc-600 underline underline-offset-4 hover:text-zinc-400 transition-colors">
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-600 mb-2">
                      Nombre completo <span className="text-amber-600">*</span>
                    </label>
                    <input type="text" value={form.nombre} placeholder="Juan Pérez"
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-600 mb-2">
                      Correo electrónico <span className="text-amber-600">*</span>
                    </label>
                    <input type="email" value={form.correo} placeholder="juan@correo.com"
                      onChange={(e) => setForm({ ...form, correo: e.target.value })}
                      className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-600 mb-2">Teléfono</label>
                  <input type="tel" value={form.telefono} placeholder="961 123 4567"
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    className={inputClass} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-600 mb-2">Mensaje</label>
                  <textarea rows={5} value={form.mensaje}
                    placeholder="¿En qué vehículo estás interesado? ¿Tienes alguna pregunta?"
                    onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                    className={`${inputClass} resize-none`} />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <button type="submit" disabled={loading}
                  className="inline-flex items-center gap-3 bg-amber-600 text-white px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-amber-500 transition-colors disabled:opacity-50">
                  {loading ? 'Enviando...' : 'Enviar mensaje'}
                  {!loading && <ArrowRight size={16} strokeWidth={2} />}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4">
            <p className="text-[11px] font-semibold tracking-[0.35em] uppercase text-amber-600 mb-6">
              Información
            </p>
            {[
              { Icon: MapPin, label: 'Dirección',  value: 'Blvd. Andrés Serra Rojas 1200\nTuxtla Gutiérrez, Chiapas' },
              { Icon: Phone,  label: 'Teléfono',   value: '961 123 4567' },
              { Icon: Mail,   label: 'Correo',     value: 'ventas@tuxcar.com' },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 p-4 border border-zinc-800 bg-zinc-900/30">
                <div className="w-8 h-8 bg-amber-600/10 flex items-center justify-center shrink-0">
                  <Icon size={14} strokeWidth={1.5} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-white whitespace-pre-line">{value}</p>
                </div>
              </div>
            ))}

            <div className="mt-6 p-4 border border-zinc-800 bg-zinc-900/30">
              <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-3">Horario de atención</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Lunes a Viernes</span>
                  <span className="font-medium text-white">9:00 — 19:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Sábado</span>
                  <span className="font-medium text-white">9:00 — 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Domingo</span>
                  <span className="text-zinc-700">Cerrado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}