'use client';
// app/dashboard/tab-estadisticas.tsx
import { useEffect, useState } from 'react';
import { getVehiculosAdmin, getCotizaciones, getLeads, getRefaccionesAdmin } from '@/lib/api-admin';
import { Car, FileText, MessageSquare, Cog, DollarSign, TrendingUp, Package, Users, Loader2 } from 'lucide-react';

export default function TabEstadisticas() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVehiculos: 0, disponibles: 0, vendidos: 0,
    totalCotizaciones: 0, cotizacionesMes: 0, valorCotizaciones: 0,
    totalLeads: 0, leadsMes: 0,
    totalRefacciones: 0, stockBajo: 0,
    inventarioValor: 0,
    marcas: [] as { marca: string; count: number }[],
    tiposDist: [] as { tipo: string; count: number }[],
    cotizacionesEstatus: [] as { estatus: string; count: number }[],
  });

  useEffect(() => {
    async function cargar() {
      const [vehiculos, cotizaciones, leads, refacciones] = await Promise.all([
        getVehiculosAdmin(), getCotizaciones(), getLeads(), getRefaccionesAdmin(),
      ]);

      const ahora = new Date();
      const mesActual = ahora.getMonth();
      const anioActual = ahora.getFullYear();

      const disponibles = vehiculos.filter((v: any) => v.disponible);
      const vendidos = vehiculos.filter((v: any) => !v.disponible);
      const inventarioValor = disponibles.reduce((sum: number, v: any) => sum + (v.precio || 0), 0);

      const cotizacionesMes = cotizaciones.filter((c: any) => {
        const f = new Date(c.fecha || c.createdAt);
        return f.getMonth() === mesActual && f.getFullYear() === anioActual;
      });

      const valorCotizaciones = cotizaciones.reduce((sum: number, c: any) => sum + (c.total || 0), 0);

      const leadsMes = leads.filter((l: any) => {
        const f = new Date(l.createdAt);
        return f.getMonth() === mesActual && f.getFullYear() === anioActual;
      });

      const stockBajo = refacciones.filter((r: any) => r.stock <= 5);

      // Marcas distribution
      const marcasMap: Record<string, number> = {};
      vehiculos.forEach((v: any) => { marcasMap[v.marca] = (marcasMap[v.marca] || 0) + 1; });
      const marcas = Object.entries(marcasMap).map(([marca, count]) => ({ marca, count })).sort((a, b) => b.count - a.count);

      // Tipos distribution
      const tiposMap: Record<string, number> = {};
      vehiculos.forEach((v: any) => { tiposMap[v.tipo] = (tiposMap[v.tipo] || 0) + 1; });
      const tiposDist = Object.entries(tiposMap).map(([tipo, count]) => ({ tipo, count })).sort((a, b) => b.count - a.count);

      // Cotizaciones por estatus
      const estatusMap: Record<string, number> = {};
      cotizaciones.forEach((c: any) => { estatusMap[c.estatus || 'borrador'] = (estatusMap[c.estatus || 'borrador'] || 0) + 1; });
      const cotizacionesEstatus = Object.entries(estatusMap).map(([estatus, count]) => ({ estatus, count }));

      setStats({
        totalVehiculos: vehiculos.length, disponibles: disponibles.length, vendidos: vendidos.length,
        totalCotizaciones: cotizaciones.length, cotizacionesMes: cotizacionesMes.length, valorCotizaciones,
        totalLeads: leads.length, leadsMes: leadsMes.length,
        totalRefacciones: refacciones.length, stockBajo: stockBajo.length,
        inventarioValor, marcas, tiposDist, cotizacionesEstatus,
      });
      setLoading(false);
    }
    cargar();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 size={20} className="animate-spin text-zinc-600" /></div>;

  const ESTATUS_COLOR: Record<string, string> = {
    borrador: 'bg-zinc-700', enviada: 'bg-blue-500', aceptada: 'bg-emerald-500',
    rechazada: 'bg-red-500', expirada: 'bg-yellow-500',
  };

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Vehículos en inventario', value: stats.totalVehiculos, sub: `${stats.disponibles} disponibles · ${stats.vendidos} vendidos`, Icon: Car, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Valor del inventario', value: `$${stats.inventarioValor.toLocaleString('es-MX')}`, sub: 'Solo vehículos disponibles', Icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Cotizaciones totales', value: stats.totalCotizaciones, sub: `${stats.cotizacionesMes} este mes`, Icon: FileText, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Leads / Contactos', value: stats.totalLeads, sub: `${stats.leadsMes} este mes`, Icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map(({ label, value, sub, Icon, color, bg }) => (
          <div key={label} className="p-5 border border-zinc-800 bg-zinc-900/30">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 ${bg} flex items-center justify-center`}>
                <Icon size={16} strokeWidth={1.5} className={color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
            <p className="text-[11px] text-zinc-500">{label}</p>
            <p className="text-[10px] text-zinc-600 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-5 border border-zinc-800 bg-zinc-900/30">
          <div className="flex items-center gap-2 mb-3">
            <Cog size={14} className="text-pink-400" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Refacciones</p>
          </div>
          <p className="text-xl font-bold text-white">{stats.totalRefacciones}</p>
          <p className="text-[10px] text-zinc-600 mt-1">
            {stats.stockBajo > 0 ? (
              <span className="text-amber-400">{stats.stockBajo} con stock bajo (≤5)</span>
            ) : (
              'Stock saludable en todas'
            )}
          </p>
        </div>

        <div className="p-5 border border-zinc-800 bg-zinc-900/30">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-emerald-400" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Valor cotizaciones</p>
          </div>
          <p className="text-xl font-bold text-white">${stats.valorCotizaciones.toLocaleString('es-MX')}</p>
          <p className="text-[10px] text-zinc-600 mt-1">Suma total de todas las cotizaciones</p>
        </div>

        <div className="p-5 border border-zinc-800 bg-zinc-900/30 col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Package size={14} className="text-cyan-400" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Cotizaciones por estatus</p>
          </div>
          <div className="flex gap-1 h-4 rounded overflow-hidden mb-2">
            {stats.cotizacionesEstatus.map(({ estatus, count }) => (
              <div key={estatus}
                className={`${ESTATUS_COLOR[estatus] || 'bg-zinc-600'}`}
                style={{ flex: count }}
                title={`${estatus}: ${count}`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {stats.cotizacionesEstatus.map(({ estatus, count }) => (
              <span key={estatus} className="text-[10px] text-zinc-500">
                <span className={`inline-block w-2 h-2 rounded-full ${ESTATUS_COLOR[estatus] || 'bg-zinc-600'} mr-1`} />
                {estatus} ({count})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Distribution tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Por marca */}
        <div className="border border-zinc-800 bg-zinc-900/30 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 mb-4">Distribución por marca</p>
          <div className="space-y-2">
            {stats.marcas.map(({ marca, count }) => (
              <div key={marca} className="flex items-center gap-3">
                <span className="text-sm text-white font-medium w-28 truncate">{marca}</span>
                <div className="flex-1 h-2 bg-zinc-800 rounded overflow-hidden">
                  <div className="h-full bg-amber-600 rounded" style={{ width: `${(count / stats.totalVehiculos) * 100}%` }} />
                </div>
                <span className="text-xs text-zinc-500 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Por tipo */}
        <div className="border border-zinc-800 bg-zinc-900/30 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 mb-4">Distribución por tipo</p>
          <div className="space-y-2">
            {stats.tiposDist.map(({ tipo, count }) => (
              <div key={tipo} className="flex items-center gap-3">
                <span className="text-sm text-white font-medium w-28 truncate uppercase">{tipo}</span>
                <div className="flex-1 h-2 bg-zinc-800 rounded overflow-hidden">
                  <div className="h-full bg-blue-500 rounded" style={{ width: `${(count / stats.totalVehiculos) * 100}%` }} />
                </div>
                <span className="text-xs text-zinc-500 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
