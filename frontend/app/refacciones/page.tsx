// app/refacciones/page.tsx
import Navbar from '@/components/navbar';
import { getRefacciones } from '@/lib/api-extended';
import { Package, Search, Shield, Truck, Wrench } from 'lucide-react';

export default async function RefaccionesPage() {
  const refacciones = await getRefacciones();

  const categorias = [...new Set(refacciones.map((r: any) => r.categoria).filter(Boolean))];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(194,154,108,0.1),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <p className="text-[11px] font-semibold tracking-[0.35em] uppercase text-amber-600 mb-4">
            Repuestos originales
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">Refacciones</h1>
          <p className="text-zinc-400 text-lg max-w-xl leading-relaxed">
            Contamos con un amplio catálogo de refacciones originales y compatibles para todas las marcas que manejamos. Calidad garantizada y disponibilidad inmediata.
          </p>
        </div>
      </section>

      {/* Ventajas */}
      <section className="border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3">
          {[
            { Icon: Shield, title: 'Garantía de origen', desc: 'Todas nuestras refacciones cuentan con certificación de calidad y garantía del fabricante.' },
            { Icon: Truck,  title: 'Disponibilidad inmediata', desc: 'Stock en sucursal para las piezas más solicitadas. Pedidos especiales en 3-5 días hábiles.' },
            { Icon: Wrench, title: 'Instalación profesional', desc: 'Nuestros técnicos certificados realizan la instalación con equipo de última generación.' },
          ].map(({ Icon, title, desc }, i) => (
            <div key={title}
              className={`p-8 ${i < 2 ? 'sm:border-r border-zinc-800/50' : ''} ${i < 2 ? 'border-b sm:border-b-0' : ''}`}>
              <div className="w-10 h-10 rounded-lg bg-amber-600/10 flex items-center justify-center mb-4">
                <Icon size={18} strokeWidth={1.5} className="text-amber-500" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1.5">{title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-12">

        {/* Conteo */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-zinc-600">{refacciones.length} refacciones en catálogo</p>
          {categorias.length > 0 && (
            <p className="text-xs text-zinc-600">{categorias.length} categorías</p>
          )}
        </div>

        {refacciones.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-14 h-14 border border-zinc-800 flex items-center justify-center mx-auto mb-5">
              <Package size={20} strokeWidth={1} className="text-zinc-600" />
            </div>
            <p className="text-zinc-500 text-sm">No hay refacciones registradas todavía.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block border border-zinc-800 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-zinc-900/50 border-b border-zinc-800">
                    {['Refacción', 'No. Parte', 'Categoría', 'Marca', 'Stock', 'Precio'].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {refacciones.map((r: any) => (
                    <tr key={r.documentId} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-white text-sm">{r.nombre}</p>
                        {r.descripcion && (
                          <p className="text-[11px] text-zinc-600 mt-0.5 line-clamp-1">{r.descripcion}</p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-zinc-500 font-mono">{r.numero_refaccion}</td>
                      <td className="px-5 py-4">
                        <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">{r.categoria}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-zinc-400">{r.marca}</td>
                      <td className="px-5 py-4">
                        <span className={`text-sm font-bold ${r.stock > 5 ? 'text-emerald-400' : r.stock > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                          {r.stock}
                        </span>
                        <span className="text-[10px] text-zinc-600 ml-1">uds</span>
                      </td>
                      <td className="px-5 py-4 font-bold text-white text-sm">
                        ${r.precio?.toLocaleString('es-MX')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {refacciones.map((r: any) => (
                <div key={r.documentId}
                  className="p-4 border border-zinc-800 bg-zinc-900/30">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-white text-sm">{r.nombre}</p>
                      <p className="text-[11px] text-zinc-600 font-mono mt-0.5">{r.numero_refaccion}</p>
                    </div>
                    <p className="font-bold text-white text-sm">${r.precio?.toLocaleString('es-MX')}</p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                    <span className="uppercase tracking-wide">{r.categoria}</span>
                    <span>{r.marca}</span>
                    <span className={`font-bold ${r.stock > 5 ? 'text-emerald-400' : r.stock > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                      {r.stock} uds
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
