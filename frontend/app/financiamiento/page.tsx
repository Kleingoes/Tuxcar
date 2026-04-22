// app/financiamiento/page.tsx
import Navbar from '@/components/navbar';
import Link from 'next/link';
import { ArrowRight, Check, Building2 } from 'lucide-react';

const BANCOS = [
  { nombre: 'BBVA México', tasa: '12.5%', plazo: 'Hasta 60 meses', enganche: '20%' },
  { nombre: 'Banorte',     tasa: '11.9%', plazo: 'Hasta 60 meses', enganche: '20%' },
  { nombre: 'Scotiabank',  tasa: '13.0%', plazo: 'Hasta 48 meses', enganche: '25%' },
  { nombre: 'HSBC',        tasa: '12.8%', plazo: 'Hasta 60 meses', enganche: '20%' },
];

const PASOS = [
  { num: '01', titulo: 'Elige tu vehículo',   desc: 'Selecciona el auto que más te guste de nuestro catálogo.' },
  { num: '02', titulo: 'Solicita tu crédito', desc: 'Llena el formulario de contacto con tus datos y preferencias.' },
  { num: '03', titulo: 'Aprobación rápida',   desc: 'En 24 a 48 horas hábiles recibes respuesta de tu solicitud.' },
  { num: '04', titulo: 'Recibe las llaves',   desc: 'Firma tu contrato y estrena tu vehículo el mismo día.' },
];

const REQUISITOS = [
  'Identificación oficial vigente (INE o pasaporte)',
  'Comprobante de domicilio no mayor a 3 meses',
  'Comprobante de ingresos de los últimos 3 meses',
  'RFC con homoclave',
  'Enganche mínimo del 20% del valor del vehículo',
];

export default function FinanciamientoPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12">

        <div className="mb-14">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-2">
            Opciones de crédito
          </p>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-3">Financiamiento</h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-xl text-base leading-relaxed">
            Trabajamos con las principales instituciones bancarias del país para ofrecerte el plan de crédito que mejor se adapte a tu situación.
          </p>
        </div>

        {/* Proceso */}
        <div className="mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-6">
            Proceso de compra
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PASOS.map((p) => (
              <div key={p.num}
                className="p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <p className="text-4xl font-bold text-zinc-100 dark:text-zinc-800 mb-3 leading-none">{p.num}</p>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-1.5">{p.titulo}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bancos */}
        <div className="mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-6">
            Instituciones financieras
          </p>

          {/* Desktop: tabla */}
          <div className="hidden md:block border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
                  {['Banco', 'Tasa anual', 'Plazo máximo', 'Enganche mínimo'].map((h) => (
                    <th key={h} className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                {BANCOS.map((b) => (
                  <tr key={b.nombre} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                          <Building2 size={14} strokeWidth={1.5} className="text-zinc-500" />
                        </div>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{b.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400 text-sm">{b.tasa}</td>
                    <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">{b.plazo}</td>
                    <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">{b.enganche}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BANCOS.map((b) => (
              <div key={b.nombre}
                className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Building2 size={14} strokeWidth={1.5} className="text-zinc-500" />
                  </div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">{b.nombre}</p>
                </div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">{b.tasa}</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">{b.plazo} · Enganche {b.enganche}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-3">
            * Las tasas son referenciales y pueden variar según el perfil crediticio del solicitante.
          </p>
        </div>

        {/* Requisitos */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-6">
              Documentos requeridos
            </p>
            <ul className="space-y-3">
              {REQUISITOS.map((r) => (
                <li key={r} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} strokeWidth={2} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-zinc-950 dark:bg-zinc-900 border border-zinc-800 p-8">
            <h2 className="text-xl font-bold text-white mb-2">¿Listo para solicitar?</h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Contáctanos y uno de nuestros asesores te guiará en el proceso de solicitud de crédito.
            </p>
            <Link href="/contacto"
              className="inline-flex items-center gap-2 bg-white text-zinc-900 px-6 py-3 rounded-full font-semibold text-sm hover:bg-zinc-100 transition-colors">
              Solicitar financiamiento
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
