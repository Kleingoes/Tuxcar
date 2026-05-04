'use client';
// components/boton-comparar.tsx
import Link from 'next/link';
import { GitCompareArrows } from 'lucide-react';

export default function BotonComparar() {
  return (
    <Link href="/vehiculos/comparar"
      className="inline-flex items-center gap-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider border border-zinc-800 text-zinc-400 hover:border-amber-600 hover:text-amber-500 transition-colors">
      <GitCompareArrows size={14} strokeWidth={1.5} />
      Comparar vehículos
    </Link>
  );
}
