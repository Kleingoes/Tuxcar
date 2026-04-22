// app/financiamiento/page.tsx
import Navbar from '@/components/navbar';

const BANCOS = [
  { nombre: 'BBVA México', tasa: '12.5%', plazo: 'Hasta 60 meses' },
  { nombre: 'Banorte',     tasa: '11.9%', plazo: 'Hasta 60 meses' },
  { nombre: 'Scotiabank',  tasa: '13.0%', plazo: 'Hasta 48 meses' },
  { nombre: 'HSBC',        tasa: '12.8%', plazo: 'Hasta 60 meses' },
];

const PASOS = [
  { num: '01', titulo: 'Elige tu vehículo', desc: 'Selecciona el auto que más te guste del catálogo.' },
  { num: '02', titulo: 'Solicita tu crédito', desc: 'Llena el formulario con tus datos y preferencias.' },
  { num: '03', titulo: 'Aprobación rápida', desc: 'En 24-48 horas recibes respuesta de tu solicitud.' },
  { num: '04', titulo: 'Estrena tu auto', desc: 'Firma tu contrato y recibe las llaves.' },
];

export default function FinanciamientoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Financiamiento</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">El plan que mejor se adapte a tu presupuesto</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {PASOS.map((p) => (
            <div key={p.num} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              <p className="text-3xl font-bold text-gray-200 dark:text-gray-700 mb-2">{p.num}</p>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{p.titulo}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{p.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Instituciones financieras</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {BANCOS.map((b) => (
            <div key={b.nombre} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 text-center shadow-sm">
              <p className="text-3xl mb-2">🏦</p>
              <p className="font-semibold text-gray-900 dark:text-white">{b.nombre}</p>
              <p className="text-green-600 dark:text-green-400 font-bold text-lg">{b.tasa}</p>
              <p className="text-xs text-gray-400">{b.plazo}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a href="/contacto"
            className="inline-block bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-medium hover:opacity-80 transition-opacity">
            Solicitar financiamiento
          </a>
        </div>
      </main>
    </div>
  );
}
