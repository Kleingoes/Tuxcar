// app/vehiculos/[documentId]/page.tsx
import Navbar from '@/components/navbar';
import Image from 'next/image';
import { getVehiculoPorDocumentId, getImagenUrl } from '@/lib/api-extended';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ documentId: string }>;
}

export default async function VehiculoDetallePage({ params }: Props) {
  const { documentId } = await params;
  const v = await getVehiculoPorDocumentId(documentId);
  if (!v) notFound();

  const imgUrl = getImagenUrl(v.Imagen);
  const ok = v.disponible !== false;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <a href="/vehiculos" className="text-sm text-gray-500 hover:underline mb-6 inline-block">
          ← Volver al catálogo
        </a>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Imagen */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            {imgUrl ? (
              <Image src={imgUrl} alt={v.nombre} fill className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">🚗</div>
            )}
          </div>

          {/* Datos */}
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{v.nombre}</h1>
              <span className={`inline-block mt-2 text-sm font-medium px-3 py-1 rounded-full ${
                ok ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                   : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
              }`}>
                {ok ? 'Disponible' : 'Vendido'}
              </span>
            </div>

            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {v.precio != null ? `$${v.precio.toLocaleString('es-MX')} MXN` : 'Consultar precio'}
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                ['Marca', v.marca], ['Modelo', v.modelo],
                ['Año', v.anio], ['Color', v.color],
                ['Transmisión', v.transmision], ['Combustible', v.combustible],
                ['Puertas', v.puertas],
                ['Kilometraje', v.kilometraje != null ? `${v.kilometraje.toLocaleString('es-MX')} km` : '—'],
                ['No. Serie', v.numero_serie],
              ].map(([label, value]) => (
                <div key={String(label)}
                  className="bg-white dark:bg-gray-900 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">{value}</p>
                </div>
              ))}
            </div>

            {v.concesionaria && (
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Concesionaria</p>
                <p className="font-medium text-gray-900 dark:text-white">{v.concesionaria.nombre}</p>
                <p className="text-sm text-gray-500">{v.concesionaria.ciudad}, {v.concesionaria.Estado}</p>
                <p className="text-sm text-gray-500">{v.concesionaria.telefono}</p>
              </div>
            )}

            {ok && (
              <a href="/contacto"
                className="w-full text-center bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-medium hover:opacity-80 transition-opacity">
                Solicitar información
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
