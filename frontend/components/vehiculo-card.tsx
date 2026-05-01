'use client';
// components/vehiculo-card.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Gauge, Fuel, Settings2, ArrowRight } from 'lucide-react';
import { getImagenUrl } from '@/lib/api-extended';

interface Props {
  v: any;
}

export default function VehiculoCard({ v }: Props) {
  const imgUrl = getImagenUrl(v.Imagen);
  const disponible = v.disponible !== false;

  return (
    <Link href={`/vehiculos/${v.documentId}`}
      className="group block bg-zinc-900 border border-zinc-800/60 hover:border-zinc-700 transition-all duration-300 overflow-hidden">

      {/* Imagen */}
      <div className="relative w-full aspect-[16/10] bg-zinc-800 overflow-hidden">
        {imgUrl ? (
          <Image src={imgUrl} alt={v.nombre} fill className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-zinc-700 text-xs tracking-widest uppercase">Sin imagen</span>
          </div>
        )}

        {/* Badge de tipo */}
        {v.tipo && (
          <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 bg-zinc-950/80 backdrop-blur-sm text-zinc-300 border border-zinc-700/50">
            {v.tipo}
          </span>
        )}

        {/* Badge estatus */}
        {!disponible && (
          <div className="absolute inset-0 bg-zinc-950/60 flex items-center justify-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Vendido</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">{v.marca} · {v.anio}</p>
          <h3 className="font-semibold text-white text-base group-hover:text-amber-400 transition-colors">
            {v.nombre}
          </h3>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 mb-5 text-zinc-500">
          {v.kilometraje != null && (
            <div className="flex items-center gap-1.5">
              <Gauge size={13} strokeWidth={1.5} />
              <span className="text-[11px]">{v.kilometraje.toLocaleString('es-MX')} km</span>
            </div>
          )}
          {v.combustible && (
            <div className="flex items-center gap-1.5">
              <Fuel size={13} strokeWidth={1.5} />
              <span className="text-[11px] capitalize">{v.combustible}</span>
            </div>
          )}
          {v.transmision && (
            <div className="flex items-center gap-1.5">
              <Settings2 size={13} strokeWidth={1.5} />
              <span className="text-[11px] capitalize">{v.transmision}</span>
            </div>
          )}
        </div>

        {/* Precio + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-0.5">Precio</p>
            <p className="text-lg font-bold text-white">
              {v.precio != null ? `$${v.precio.toLocaleString('es-MX')}` : 'Consultar'}
            </p>
          </div>
          <div className="w-9 h-9 flex items-center justify-center border border-zinc-700 text-zinc-500 group-hover:border-amber-600 group-hover:text-amber-500 transition-colors">
            <ArrowRight size={14} strokeWidth={2} />
          </div>
        </div>
      </div>
    </Link>
  );
}
