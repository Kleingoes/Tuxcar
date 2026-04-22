// app/servicio/page.tsx
import Navbar from '@/components/navbar';

const SERVICIOS = [
  { icon: '🔧', titulo: 'Mantenimiento preventivo', desc: 'Cambio de aceite, filtros y revisión general.' },
  { icon: '🛑', titulo: 'Frenos', desc: 'Revisión y reemplazo de pastillas, discos y sistema hidráulico.' },
  { icon: '⚡', titulo: 'Sistema eléctrico', desc: 'Diagnóstico de batería, alternador y encendido.' },
  { icon: '🔩', titulo: 'Suspensión y dirección', desc: 'Amortiguadores, rótulas y alineación.' },
  { icon: '❄️', titulo: 'Aire acondicionado', desc: 'Recarga de gas y revisión del compresor.' },
  { icon: '🖥️', titulo: 'Diagnóstico computarizado', desc: 'Lectura de códigos de falla con escáner especializado.' },
];

export default function ServicioPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Servicio y Taller</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Técnicos certificados para todas las marcas</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {SERVICIOS.map((s) => (
            <div key={s.titulo} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              <p className="text-3xl mb-3">{s.icon}</p>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{s.titulo}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-black dark:bg-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white dark:text-black mb-2">¿Necesitas agendar una cita?</h2>
          <p className="text-gray-300 dark:text-gray-700 mb-5">Contáctanos y uno de nuestros asesores te atenderá</p>
          <a href="/contacto"
            className="inline-block bg-white dark:bg-black text-black dark:text-white px-6 py-3 rounded-full font-medium hover:opacity-80 transition-opacity">
            Agendar cita
          </a>
        </div>
      </main>
    </div>
  );
}
