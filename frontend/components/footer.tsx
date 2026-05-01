// components/footer.tsx
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t border-zinc-800/50 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-sm font-bold text-white tracking-wide">Tuxcar</p>
            <p className="text-[11px] text-zinc-600 mt-0.5">Concesionaria multimarca · Tuxtla Gutiérrez, Chiapas</p>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/vehiculos" className="text-xs text-zinc-500 hover:text-amber-500 transition-colors uppercase tracking-wider">
              Catálogo
            </Link>
            <Link href="/servicio" className="text-xs text-zinc-500 hover:text-amber-500 transition-colors uppercase tracking-wider">
              Servicio
            </Link>
            <Link href="/contacto" className="text-xs text-zinc-500 hover:text-amber-500 transition-colors uppercase tracking-wider">
              Contacto
            </Link>
          </nav>
        </div>
        <div className="mt-8 pt-6 border-t border-zinc-800/50 text-center">
          <p className="text-[11px] text-zinc-700">
            &copy; {new Date().getFullYear()} Tuxcar. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
