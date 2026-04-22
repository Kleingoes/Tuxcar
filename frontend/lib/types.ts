// lib/types.ts
// Tipos para Strapi v5 — campos directamente en el objeto (sin .attributes)

export interface Vehiculo {
  id: number;
  documentId: string;
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
  estatus: string;
  disponible: boolean;
  numero_serie: string;
  descripcion?: string;
  Imagen?: { id: number; url: string; name: string } | null;
  concesionaria?: Concesionaria;
}

export interface Concesionaria {
  id: number;
  documentId: string;
  nombre: string;
  ciudad: string;
  Estado: string;
  direccion: string;
  telefono: string;
  contacto: string;
}

export interface Refaccion {
  id: number;
  documentId: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  marca: string;
  categoria: string;
  numero_refaccion: string;
  concesionaria?: Concesionaria;
}
