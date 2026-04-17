// lib/api.ts
// Cliente para consumir la API de Strapi desde Next.js

import { Vehiculo, Concesionaria, StrapiResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337";
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN ?? "";

// Headers base con autenticación
function getHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
  };
}

// ─── VEHÍCULOS ────────────────────────────────────────────────────────────────

export interface FiltrosVehiculo {
  tipo?: string;         // "sedan" | "suv" | "pickup" | ...
  marca?: string;
  precioMax?: number;
  disponible?: boolean;
  pagina?: number;
  limite?: number;
}

export async function getVehiculos(
  filtros: FiltrosVehiculo = {}
): Promise<Vehiculo[]> {
  try {
    const params = new URLSearchParams();

    // Populate para traer la concesionaria relacionada
    params.set("populate", "*");

    // Filtros opcionales
    if (filtros.tipo) {
      params.set("filters[tipo][$eq]", filtros.tipo);
    }
    if (filtros.marca) {
      params.set("filters[marca][$containsi]", filtros.marca);
    }
    if (filtros.precioMax) {
      params.set("filters[precio][$lte]", String(filtros.precioMax));
    }
    if (filtros.disponible !== undefined) {
      params.set("filters[disponible][$eq]", String(filtros.disponible));
    }

    // Paginación
    params.set("pagination[start]", String((filtros.pagina ?? 0) * (filtros.limite ?? 100)));
    params.set("pagination[limit]", String(filtros.limite ?? 100));

    const res = await fetch(`${API_URL}/api/vehiculos?${params.toString()}`, {
      headers: getHeaders(),
      // En Next.js App Router: no cachear para tener datos siempre frescos en dev
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Error Strapi vehiculos:", res.status, res.statusText);
      return [];
    }

    const json: StrapiResponse<Vehiculo> = await res.json();
    return json.data ?? [];
  } catch (error) {
    console.error("getVehiculos error:", error);
    return [];
  }
}

export async function getVehiculoPorId(id: number): Promise<Vehiculo | null> {
  try {
    const res = await fetch(
      `${API_URL}/api/vehiculos/${id}?populate=*`,
      { headers: getHeaders(), cache: "no-store" }
    );

    if (!res.ok) return null;

    const json = await res.json();
    return json.data ?? null;
  } catch (error) {
    console.error("getVehiculoPorId error:", error);
    return null;
  }
}

// ─── CONCESIONARIAS ───────────────────────────────────────────────────────────

export async function getConcesionarias(): Promise<Concesionaria[]> {
  try {
    const res = await fetch(`${API_URL}/api/concesionarias?populate=*`, {
      headers: getHeaders(),
      cache: "no-store",
    });

    if (!res.ok) return [];

    const json: StrapiResponse<Concesionaria> = await res.json();
    return json.data ?? [];
  } catch (error) {
    console.error("getConcesionarias error:", error);
    return [];
  }
}
