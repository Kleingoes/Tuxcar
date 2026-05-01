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
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(194,154,108,0.1),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <p className="text-[11px] font-semibold tracking-[0.35em] uppercase text-amber-600 mb-4">
            Opciones de crédito
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">Financiamiento</h1>
          <p className="text-zinc-400 text-lg max-w-xl leading-relaxed">
            Trabajamos con las principales instituciones bancarias del país para ofrecerte el plan de crédito que mejor se adapte a tu situación.
          </p>
        </div>
      </section>

      {/* Proceso */}
      <section className="border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <p className="text-[11px] font-semibold tracking-[0.35em] uppercase text-amber-600 mb-8">
            Proceso de compra
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-zinc-800">
            {PASOS.map((p, i) => (
              <div key={p.num}
                className={`p-7 ${i < 3 ? 'lg:border-r border-zinc-800' : ''} ${i < 2 ? 'sm:border-r' : ''} ${i < 2 ? 'border-b sm:border-b lg:border-b-0' : i === 2 ? 'border-b lg:border-b-0' : ''}`}>
                <p className="text-5xl font-bold text-zinc-800 mb-4 leading-none">{p.num}</p>
                <h3 className="font-semibold text-white text-sm mb-1.5">{p.titulo}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bancos */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <p className="text-[11px] font-semibold tracking-[0.35em] uppercase text-amber-600 mb-8">
          Instituciones financieras
        </p>

        <div className="hidden md:block border border-zinc-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-zinc-800">
                {['Banco', 'Tasa anual', 'Plazo máximo', 'Enganche mínimo'].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {BANCOS.map((b) => (
                <tr key={b.nombre} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border border-zinc-800 flex items-center justify-center">
                        <Building2 size={14} strokeWidth={1.5} className="text-zinc-500" />
                      </div>
                      <span className="font-semibold text-white text-sm">{b.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-amber-400 text-sm">{b.tasa}</td>
                  <td className="px-6 py-4 text-sm text-zinc-400">{b.plazo}</td>
                  <td className="px-6 py-4 text-sm text-zinc-400">{b.enganche}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BANCOS.map((b) => (
            <div key={b.nombre} className="p-5 border border-zinc-800 bg-zinc-900/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 border border-zinc-800 flex items-center justify-center">
                  <Building2 size={14} strokeWidth={1.5} className="text-zinc-500" />
                </div>
                <p className="font-semibold text-white text-sm">{b.nombre}</p>
              </div>
              <p className="text-2xl font-bold text-amber-400 mb-1">{b.tasa}</p>
              <p className="text-xs text-zinc-500">{b.plazo} · Enganche {b.enganche}</p>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-zinc-700 mt-4">
          * Las tasas son referenciales y pueden variar según el perfil crediticio del solicitante.
        </p>
      </section>

      {/* Requisitos + CTA */}
      <section className="border-t border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.35em] uppercase text-amber-600 mb-6">
              Documentos requeridos
            </p>
            <ul className="space-y-3">
              {REQUISITOS.map((r) => (
                <li key={r} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-amber-600/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} strokeWidth={2} className="text-amber-500" />
                  </div>
                  <span className="text-sm text-zinc-400">{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 border border-zinc-800 bg-zinc-900/30">
            <h2 className="text-xl font-bold text-white mb-2">¿Listo para solicitar?</h2>
            <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
              Contáctanos y uno de nuestros asesores te guiará en el proceso de solicitud de crédito.
            </p>
            <Link href="/contacto"
              className="inline-flex items-center gap-3 bg-amber-600 text-white px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-amber-500 transition-colors">
              Solicitar financiamiento
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
