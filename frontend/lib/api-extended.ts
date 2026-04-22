// lib/api-extended.ts
import { Vehiculo, Refaccion } from './types';

const API_URL   = process.env.NEXT_PUBLIC_API_URL   ?? 'http://localhost:1337';
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN ?? '';

function headers(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
  };
}

// ─── VEHÍCULOS ────────────────────────────────────────────────────────────────

export async function getVehiculosFiltrados(filtros: {
  tipo?: string;
  disponible?: boolean;
} = {}): Promise<Vehiculo[]> {
  try {
    const params = new URLSearchParams();
    params.set('populate', '*');
    params.set('pagination[limit]', '100');
    if (filtros.tipo) params.set('filters[tipo][$eq]', filtros.tipo);
    if (filtros.disponible !== undefined)
      params.set('filters[disponible][$eq]', String(filtros.disponible));

    const res = await fetch(`${API_URL}/api/vehiculos?${params}`, {
      headers: headers(), cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch (e) {
    console.error('getVehiculosFiltrados:', e);
    return [];
  }
}

export async function getVehiculoPorDocumentId(documentId: string): Promise<Vehiculo | null> {
  try {
    const res = await fetch(`${API_URL}/api/vehiculos/${documentId}?populate=*`, {
      headers: headers(), cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch (e) {
    console.error('getVehiculoPorDocumentId:', e);
    return null;
  }
}

// ─── REFACCIONES ─────────────────────────────────────────────────────────────

export async function getRefacciones(): Promise<Refaccion[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/refaccions?populate=*&pagination[limit]=100`,
      { headers: headers(), cache: 'no-store' }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch (e) {
    console.error('getRefacciones:', e);
    return [];
  }
}

// ─── LEADS ────────────────────────────────────────────────────────────────────

export async function crearLead(data: {
  nombre: string;
  correo: string;
  telefono?: string;
  mensaje?: string;
}): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/leads`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ data }),
    });
    return res.ok;
  } catch (e) {
    console.error('crearLead:', e);
    return false;
  }
}

// ─── COTIZACIONES ─────────────────────────────────────────────────────────────

export async function crearCotizacion(data: {
  nombre: string;
  correo: string;
  telefono?: string;
  notas?: string;
  vehiculoDocumentId: string;
}): Promise<boolean> {
  try {
    const vehiculo = await getVehiculoPorDocumentId(data.vehiculoDocumentId);
    if (!vehiculo) return false;

    // Buscar cliente por correo
    const clienteRes = await fetch(
      `${API_URL}/api/clientes?filters[correo][$eq]=${encodeURIComponent(data.correo)}`,
      { headers: headers() }
    );
    const clienteJson = await clienteRes.json();
    let clienteId: number | null = clienteJson.data?.[0]?.id ?? null;

    // Crear cliente si no existe
    if (!clienteId) {
      const nuevoCliente = await fetch(`${API_URL}/api/clientes`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          data: {
            nombre: data.nombre,
            correo: data.correo,
            Telefono: data.telefono ?? '',
            fecha_registro: new Date().toISOString(),
            tipo: 'individual',
          }
        }),
      });
      const nuevoClienteJson = await nuevoCliente.json();
      clienteId = nuevoClienteJson.data?.id ?? null;
    }
    if (!clienteId) return false;

    // Crear cotización
    const cotizacion = await fetch(`${API_URL}/api/cotizaciones`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        data: {
          fecha: new Date().toISOString().split('T')[0],
          vigencia: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          total: vehiculo.precio ?? 0,
          descuento: 0,
          estatus: 'borrador',
          notas: data.notas ?? '',
          cliente: { connect: [{ id: clienteId }] },
          vehiculo: { connect: [{ id: vehiculo.id }] },
        }
      }),
    });

    return cotizacion.ok;
  } catch (e) {
    console.error('crearCotizacion:', e);
    return false;
  }
}

// ─── HELPER IMAGEN ────────────────────────────────────────────────────────────

export function getImagenUrl(imagen?: { url: string } | null): string | null {
  if (!imagen?.url) return null;
  if (imagen.url.startsWith('http')) return imagen.url;
  return `${API_URL}${imagen.url}`;
}
