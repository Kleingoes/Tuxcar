// lib/api-extended.ts
// Funciones adicionales para el backend de Tuxcar
// El api.ts original del proyecto NO fue modificado

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
    if (filtros.tipo)
      params.set('filters[tipo][$eq]', filtros.tipo);
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

// ─── HELPER IMAGEN ────────────────────────────────────────────────────────────

export function getImagenUrl(imagen?: { url: string } | null): string | null {
  if (!imagen?.url) return null;
  if (imagen.url.startsWith('http')) return imagen.url;
  return `${API_URL}${imagen.url}`;
}
