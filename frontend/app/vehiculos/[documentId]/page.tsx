// app/vehiculos/[documentId]/page.tsx
import Navbar from '@/components/navbar';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, Mail } from 'lucide-react';
import { getVehiculoPorDocumentId, getImagenUrl } from '@/lib/api-extended';
import { notFound } from 'next/navigation';
import FormCotizacion from './form-cotizacion';

interface Props {
  params: Promise<{ documentId: string }>;
}

const SPECS_LABELS: Record<string, string> = {
  marca: 'Marca', modelo: 'Modelo', anio: 'Año',
  color: 'Color', transmision: 'Transmisión', combustible: 'Combustible',
  puertas: 'Puertas', kilometraje: 'Kilometraje', numero_serie: 'No. de Serie',
};

export default async function VehiculoDetallePage({ params }: Props) {
  const { documentId } = await params;
  const v = await getVehiculoPorDocumentId(documentId);
  if (!v) notFound();

  const imgUrl = getImagenUrl(v.Imagen);
  const disponible = v.disponible !== false;

  const specs = [
    { key: 'marca',        value: v.marca },
    { key: 'modelo',       value: v.modelo },
    { key: 'anio',         value: String(v.anio) },
    { key: 'color',        value: v.color },
    { key: 'transmision',  value: v.transmision },
    { key: 'combustible',  value: v.combustible },
    { key: 'puertas',      value: `${v.puertas} puertas` },
    { key: 'kilometraje',  value: v.kilometraje != null ? `${v.kilometraje.toLocaleString('es-MX')} km` : '—' },
    { key: 'numero_serie', value: v.numero_serie },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-10">

        <Link href="/vehiculos"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-8">
          <ArrowLeft size={14} strokeWidth={1.5} />
          Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          <div>
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
              {imgUrl ? (
                <Image src={imgUrl} alt={v.nombre} fill className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-zinc-300 dark:text-zinc-700 text-sm tracking-widest uppercase">Sin imagen</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full ${
                  disponible
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                }`}>
                  {disponible ? 'Disponible' : 'Vendido'}
                </span>
                {v.tipo && (
                  <span className="text-[11px] font-medium tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
                    {v.tipo}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">{v.nombre}</h1>
              <p className="text-zinc-400 dark:text-zinc-500 text-sm">{v.marca} · {v.modelo} · {v.anio}</p>
            </div>

            <div className="mb-8 pb-8 border-b border-zinc-100 dark:border-zinc-800">
              <p className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">Precio de lista</p>
              <p className="text-4xl font-bold text-zinc-900 dark:text-white">
                {v.precio != null ? `$${v.precio.toLocaleString('es-MX')}` : 'Consultar'}
                <span className="text-lg font-normal text-zinc-400 dark:text-zinc-500 ml-2">MXN</span>
              </p>
            </div>

            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">Especificaciones</p>
              <div className="grid grid-cols-2 gap-0 border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden">
                {specs.map((spec, i) => (
                  <div key={spec.key} className={`
                    px-4 py-3
                    ${i % 2 === 0 ? 'border-r border-zinc-100 dark:border-zinc-800' : ''}
                    ${i < specs.length - 2 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}
                  `}>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-0.5">
                      {SPECS_LABELS[spec.key]}
                    </p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 capitalize">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {v.concesionaria && (
              <div className="mb-8 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">Concesionaria</p>
                <p className="font-semibold text-zinc-900 dark:text-white mb-1">{v.concesionaria.nombre}</p>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <MapPin size={12} strokeWidth={1.5} />
                    <span className="text-xs">{v.concesionaria.direccion}, {v.concesionaria.ciudad}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <Phone size={12} strokeWidth={1.5} />
                    <span className="text-xs">{v.concesionaria.telefono}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <Mail size={12} strokeWidth={1.5} />
                    <span className="text-xs">{v.concesionaria.contacto}</span>
                  </div>
                </div>
              </div>
            )}

            {disponible && (
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <Link href="/contacto"
                  className="flex-1 flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 py-3.5 rounded-full font-semibold text-sm hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors">
                  Contactar asesor
                </Link>
                <Link href="/financiamiento"
                  className="flex-1 flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 py-3.5 rounded-full font-semibold text-sm hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors">
                  Ver financiamiento
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Cotización con calculadora + PDF */}
        {disponible && (
          <div className="mt-16 pt-12 border-t border-zinc-100 dark:border-zinc-800">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
                Cotización personalizada
              </p>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                Calcula tu financiamiento
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">
                Ajusta el enganche, plazo y tasa para ver tu mensualidad estimada. Al generar la cotización podrás descargar un PDF profesional.
              </p>
              <FormCotizacion
                vehiculoDocumentId={documentId}
                vehiculoNombre={v.nombre}
                vehiculoPrecio={v.precio ?? 0}
                vehiculoMarca={v.marca}
                vehiculoModelo={v.modelo}
                vehiculoAnio={v.anio}
              />
            </div>
          </div>
        )}

        {v.descripcion && (
          <div className="mt-12 pt-12 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">Descripción</p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">{v.descripcion}</p>
          </div>
        )}
      </main>
    </div>
  );
}