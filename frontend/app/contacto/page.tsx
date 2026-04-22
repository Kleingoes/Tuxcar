'use client';
// app/contacto/page.tsx
import Navbar from '@/components/navbar';
import { useState } from 'react';
import { crearLead } from '@/lib/api-extended';

export default function ContactoPage() {
  const [form, setForm]     = useState({ nombre:'', correo:'', telefono:'', mensaje:'' });
  const [loading, setLoading] = useState(false);
  const [exito, setExito]   = useState(false);
  const [error, setError]   = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre || !form.correo) { setError('Nombre y correo son obligatorios.'); return; }
    setLoading(true); setError('');
    const ok = await crearLead(form);
    setLoading(false);
    if (ok) { setExito(true); setForm({ nombre:'', correo:'', telefono:'', mensaje:'' }); }
    else setError('Hubo un problema al enviar. Intenta de nuevo.');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contáctanos</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Un asesor te contactará a la brevedad</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          {exito ? (
            <div className="text-center py-8">
              <p className="text-5xl mb-4">✅</p>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">¡Mensaje enviado!</h2>
              <p className="text-gray-500 dark:text-gray-400">Un asesor se pondrá en contacto contigo pronto.</p>
              <button onClick={() => setExito(false)} className="mt-4 text-sm text-gray-500 underline">
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {[
                { key: 'nombre',   label: 'Nombre completo',    type: 'text',  placeholder: 'Juan Pérez',       required: true },
                { key: 'correo',   label: 'Correo electrónico', type: 'email', placeholder: 'juan@correo.com',  required: true },
                { key: 'telefono', label: 'Teléfono',           type: 'tel',   placeholder: '961 123 4567',     required: false },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                    {f.label} {f.required && <span className="text-red-500">*</span>}
                  </label>
                  <input type={f.type} value={(form as any)[f.key]} placeholder={f.placeholder}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
                </div>
              ))}

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Mensaje</label>
                <textarea rows={4} value={form.mensaje}
                  placeholder="¿En qué vehículo estás interesado? ¿Necesitas financiamiento?"
                  onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none" />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-medium hover:opacity-80 transition-opacity disabled:opacity-50">
                {loading ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            { icon:'📍', label:'Ubicación', value:'Tuxtla Gutiérrez, Chiapas' },
            { icon:'📞', label:'Teléfono',  value:'961 123 4567' },
            { icon:'✉️', label:'Correo',    value:'ventas@tuxcar.com' },
          ].map((c) => (
            <div key={c.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
              <p className="text-2xl mb-1">{c.icon}</p>
              <p className="text-xs text-gray-400">{c.label}</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{c.value}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
