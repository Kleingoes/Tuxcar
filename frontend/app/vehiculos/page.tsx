// app/vehiculos/page.tsx
import Navbar from '@/components/navbar';
import VehiculoCard from '@/components/vehiculo-card';
import { getVehiculosFiltrados } from '@/lib/api-extended';

const TIPOS = [
  { value: '', label: 'Todos' },
  { value: 'sedan', label: 'Sedán' },
  { value: 'suv', label: 'SUV' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'hatchback', label: 'Hatchback' },
];

interface Props {
  searchParams: Promise<{ tipo?: string; disponible?: string }>;
}

export default async function VehiculosPage({ searchParams }: Props) {
  const params = await searchParams;
  const vehiculos = await getVehiculosFiltrados({
    tipo: params.tipo || undefined,
    disponible: params.disponible === 'true' ? true : undefined,
  });
  const tipoActivo = params.tipo ?? '';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Catálogo de Vehículos</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {vehiculos.length} vehículo{vehiculos.length !== 1 ? 's' : ''} encontrado{vehiculos.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TIPOS.map((t) => (
            <a key={t.value}
              href={t.value ? `/vehiculos?tipo=${t.value}` : '/vehiculos'}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                tipoActivo === t.value
                  ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white'
              }`}>
              {t.label}
            </a>
          ))}
          <a href={params.disponible === 'true' ? '/vehiculos' : '/vehiculos?disponible=true'}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              params.disponible === 'true'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
            }`}>
            ✅ Solo disponibles
          </a>
        </div>

        {vehiculos.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🚗</p>
            <p>No se encontraron vehículos</p>
            <a href="/vehiculos" className="text-sm underline mt-2 inline-block">Ver todos</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {vehiculos.map((v) => <VehiculoCard key={v.documentId} v={v} />)}
          </div>
        )}
      </main>
    </div>
  );
}
