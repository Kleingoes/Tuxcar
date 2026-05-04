// lib/api-empleados.ts

const API_URL   = process.env.NEXT_PUBLIC_API_URL   ?? 'http://localhost:1337';
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN ?? '';

function headers(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
  };
}

export async function getEmpleados(): Promise<any[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/empleados?populate=*&sort=nombre:asc&pagination[limit]=100`,
      { headers: headers(), cache: 'no-store' }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch { return []; }
}

export async function crearEmpleado(data: {
  nombre: string; puesto: string; telefono: string;
  correo: string; fecha_ingreso: string; activo: boolean;
}): Promise<{ ok: boolean; documentId?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/empleados`, {
      method: 'POST', headers: headers(),
      body: JSON.stringify({ data }),
    });
    if (!res.ok) return { ok: false };
    const json = await res.json();
    return { ok: true, documentId: json.data?.documentId };
  } catch { return { ok: false }; }
}

export async function editarEmpleado(documentId: string, data: Record<string, any>): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/empleados/${documentId}`, {
      method: 'PUT', headers: headers(),
      body: JSON.stringify({ data }),
    });
    return res.ok;
  } catch { return false; }
}

export async function eliminarEmpleado(documentId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/empleados/${documentId}`, {
      method: 'DELETE', headers: headers(),
    });
    return res.ok;
  } catch { return false; }
}

export async function getConcesionarias(): Promise<any[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/concesionarias?sort=nombre:asc&pagination[limit]=50`,
      { headers: headers(), cache: 'no-store' }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch { return []; }
}
