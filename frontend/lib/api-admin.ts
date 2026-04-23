// lib/api-admin.ts
// Funciones administrativas para el dashboard

const API_URL   = process.env.NEXT_PUBLIC_API_URL   ?? 'http://localhost:1337';
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN ?? '';

function headers(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
  };
}

// ─── LEADS ────────────────────────────────────────────────────────────────────

export async function getLeads(): Promise<any[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/leads?sort=createdAt:desc&pagination[limit]=100`,
      { headers: headers(), cache: 'no-store' }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch (e) {
    console.error('getLeads:', e);
    return [];
  }
}

// ─── COTIZACIONES ─────────────────────────────────────────────────────────────

export async function getCotizaciones(): Promise<any[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/cotizaciones?populate=*&sort=createdAt:desc&pagination[limit]=100`,
      { headers: headers(), cache: 'no-store' }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch (e) {
    console.error('getCotizaciones:', e);
    return [];
  }
}

// ─── VEHÍCULOS ────────────────────────────────────────────────────────────────

export async function getVehiculosAdmin(): Promise<any[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/vehiculos?populate=*&sort=createdAt:desc&pagination[limit]=100`,
      { headers: headers(), cache: 'no-store' }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch (e) {
    console.error('getVehiculosAdmin:', e);
    return [];
  }
}

export async function crearVehiculo(data: {
  nombre: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  precio: number;
  kilometraje: number;
  tipo: string;
  transmision: string;
  combustible: string;
  puertas: number;
  numero_serie: string;
  descripcion?: string;
  estatus?: string;
  disponible?: boolean;
}): Promise<{ ok: boolean; documentId?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/vehiculos`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        data: {
          ...data,
          estatus: data.estatus ?? 'disponible',
          disponible: data.disponible ?? true,
        },
      }),
    });
    if (!res.ok) return { ok: false };
    const json = await res.json();
    return { ok: true, documentId: json.data?.documentId };
  } catch (e) {
    console.error('crearVehiculo:', e);
    return { ok: false };
  }
}

export async function subirImagenVehiculo(file: File, vehiculoId: number): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('ref', 'api::vehiculo.vehiculo');
    formData.append('refId', String(vehiculoId));
    formData.append('field', 'Imagen');

    const res = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      },
      body: formData,
    });
    return res.ok;
  } catch (e) {
    console.error('subirImagenVehiculo:', e);
    return false;
  }
}
