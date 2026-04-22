// app/refacciones/page.tsx
import Navbar from '@/components/navbar';
import { getRefacciones } from '@/lib/api-extended';

const CAT_COLOR: Record<string, string> = {
  motor:     'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  frenos:    'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  suspension:'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  electrico: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  carroceria:'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  otro:      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};
const CAT_LABEL: Record<string, string> = {
  motor:'Motor', frenos:'Frenos', suspension:'Suspensión',
  electrico:'Eléctrico', carroceria:'Carrocería', otro:'Otro',
};

export default async function RefaccionesPage() {
  const refacciones = await getRefacciones();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Refacciones</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{refacciones.length} piezas en inventario</p>
        </div>

        {refacciones.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No hay refacciones disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {refacciones.map((r) => (
              <div key={r.documentId}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-3 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">{r.nombre}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full shrink-0 font-medium ${CAT_COLOR[r.categoria] ?? CAT_COLOR.otro}`}>
                    {CAT_LABEL[r.categoria] ?? r.categoria}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <p>🏷️ {r.marca}</p>
                  <p>🔢 {r.numero_refaccion}</p>
                  {r.concesionaria && <p>📍 {r.concesionaria.nombre}</p>}
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
                  <p className="font-bold text-green-600 dark:text-green-400">${r.precio.toLocaleString('es-MX')} MXN</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    r.stock > 0 ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {r.stock > 0 ? `${r.stock} en stock` : 'Sin stock'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
