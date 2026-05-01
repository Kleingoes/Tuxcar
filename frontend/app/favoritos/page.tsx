// app/favoritos/page.tsx
import Navbar from '@/components/navbar';
import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';

export default function FavoritosPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-14 h-14 border border-zinc-800 flex items-center justify-center mb-6">
            <Heart size={20} strokeWidth={1} className="text-zinc-600" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Mis favoritos</h1>
          <p className="text-zinc-500 text-sm mb-8 max-w-xs">
            Próximamente podrás guardar y comparar los vehículos de tu interés desde aquí.
          </p>
          <Link href="/vehiculos"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-amber-500 transition-colors">
            Explorar catálogo
            <ArrowRight size={13} strokeWidth={1.5} />
          </Link>
        </div>
      </main>
    </div>
  );
}
