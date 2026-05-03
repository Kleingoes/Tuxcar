'use client';
// lib/export-excel.ts
// Genera archivos CSV compatibles con Excel (sin dependencias externas)

export function exportarCSV(datos: any[], columnas: { key: string; label: string }[], filename: string) {
  // BOM para UTF-8 en Excel
  const BOM = '\uFEFF';

  // Header
  const header = columnas.map((c) => `"${c.label}"`).join(',');

  // Rows
  const rows = datos.map((item) =>
    columnas.map((c) => {
      let val = item[c.key];
      if (val === null || val === undefined) val = '';
      if (typeof val === 'object') val = val.nombre ?? val.correo ?? JSON.stringify(val);
      val = String(val).replace(/"/g, '""');
      return `"${val}"`;
    }).join(',')
  );

  const csv = BOM + [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportarVehiculos(vehiculos: any[]) {
  exportarCSV(vehiculos, [
    { key: 'nombre', label: 'Nombre' },
    { key: 'marca', label: 'Marca' },
    { key: 'modelo', label: 'Modelo' },
    { key: 'anio', label: 'Año' },
    { key: 'color', label: 'Color' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'transmision', label: 'Transmisión' },
    { key: 'combustible', label: 'Combustible' },
    { key: 'precio', label: 'Precio (MXN)' },
    { key: 'kilometraje', label: 'Kilometraje' },
    { key: 'puertas', label: 'Puertas' },
    { key: 'numero_serie', label: 'No. Serie' },
    { key: 'estatus', label: 'Estatus' },
    { key: 'disponible', label: 'Disponible' },
  ], 'tuxcar_vehiculos');
}

export function exportarCotizaciones(cotizaciones: any[]) {
  const datos = cotizaciones.map((c) => ({
    ...c,
    cliente_nombre: c.cliente?.nombre ?? '',
    cliente_correo: c.cliente?.correo ?? '',
    vehiculo_nombre: c.vehiculo?.nombre ?? '',
  }));
  exportarCSV(datos, [
    { key: 'fecha', label: 'Fecha' },
    { key: 'cliente_nombre', label: 'Cliente' },
    { key: 'cliente_correo', label: 'Correo cliente' },
    { key: 'vehiculo_nombre', label: 'Vehículo' },
    { key: 'total', label: 'Total (MXN)' },
    { key: 'descuento', label: 'Descuento' },
    { key: 'estatus', label: 'Estatus' },
    { key: 'vigencia', label: 'Vigencia' },
    { key: 'notas', label: 'Notas' },
  ], 'tuxcar_cotizaciones');
}

export function exportarLeads(leads: any[]) {
  exportarCSV(leads, [
    { key: 'nombre', label: 'Nombre' },
    { key: 'correo', label: 'Correo' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'mensaje', label: 'Mensaje' },
    { key: 'createdAt', label: 'Fecha' },
  ], 'tuxcar_contactos');
}

export function exportarRefacciones(refacciones: any[]) {
  exportarCSV(refacciones, [
    { key: 'nombre', label: 'Nombre' },
    { key: 'numero_refaccion', label: 'No. Parte' },
    { key: 'marca', label: 'Marca' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'precio', label: 'Precio (MXN)' },
    { key: 'stock', label: 'Stock' },
    { key: 'descripcion', label: 'Descripción' },
  ], 'tuxcar_refacciones');
}
