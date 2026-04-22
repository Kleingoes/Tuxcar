'use client';
// components/vehiculo-card.tsx — Tarjeta de vehículo con imagen y dark mode
import Link from 'next/link';
import Image from 'next/image';
import { Vehiculo } from '@/lib/types';
import { getImagenUrl } from '@/lib/api-extended';

const TIPO: Record<string, string> = {
  sedan: 'Sedán', suv: 'SUV', pickup: 'Pickup',
  hatchback: 'Hatchback', coupe: 'Coupé', van: 'Van',
};

export default function VehiculoCard({ v }: { v: Vehiculo }) {
  const imgUrl = getImagenUrl(v.Imagen);
  const ok = v.disponible !== false;

  return (
    <Link href={`/vehiculos/${v.documentId}`} className="group block">
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow overflow-hidden">

        {/* Imagen */}
        <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800">
          {imgUrl ? (
            <Image src={imgUrl} alt={v.nombre} fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300 dark:text-gray-600">🚗</div>
          )}
          <span className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-full ${
            ok ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
               : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
          }`}>
            {ok ? 'Disponible' : 'Vendido'}
          </span>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-2">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:underline leading-tight">
              {v.nombre}
            </h2>
            {v.tipo && (
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                {TIPO[v.tipo] ?? v.tipo}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
            <span> {v.marca}</span>
            <span> {v.anio}</span>
            <span> {v.transmision}</span>
            <span> {v.combustible}</span>
            {v.kilometraje != null && (
              <span className="col-span-2"> {v.kilometraje.toLocaleString('es-MX')} km</span>
            )}
          </div>
          {v.concesionaria && (
            <p className="text-xs text-gray-400 truncate">📍 {v.concesionaria.nombre}</p>
          )}
          <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">
            {v.precio != null ? `$${v.precio.toLocaleString('es-MX')} MXN` : 'Consultar precio'}
          </p>
        </div>
      </div>
    </Link>
  );
}
