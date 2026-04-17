// lib/types.ts
// Tipos TypeScript para las colecciones de Tuxcar en Strapi

export interface Vehiculo {
  id: number;
  nombre: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  precio: number;
  kilometraje: number;
  tipo: "sedan" | "suv" | "pickup" | "hatchback" | "coupe" | "van";
  transmision: "automatica" | "manual";
  combustible: "gasolina" | "diesel" | "hibrido" | "electrico";
  puertas: number;
  estatus: "disponible" | "vendido" | "reservado";
  disponible: boolean;
  numero_serie: string;
  concesionaria?: Concesionaria;
}

export interface Concesionaria {
  id: number;
  nombre: string;
  ciudad: string;
  Estado: string;
  direccion: string;
  telefono: string;
  contacto: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  correo: string;
  Telefono: string;
  direccion: string;
  fecha_registro: string;
  tipo: "individual" | "empresa";
}

export interface Venta {
  id: number;
  fecha: string;
  total: number;
  estatus: "pendiente" | "completada" | "cancelada";
  metodo_pago: "efectivo" | "tarjeta " | "financiamiento";
  cantidad: number;
  notas: string;
  cliente?: Cliente;
  vehiculo?: Vehiculo;
}

// Respuesta paginada de Strapi
export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      start: number;
      limit: number;
      total: number;
    };
  };
}
