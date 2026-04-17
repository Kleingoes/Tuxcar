// app/vehiculos/page.tsx
// Catálogo de vehículos — Server Component (Next.js App Router)

import Navbar from "@/components/navbar";
import VehiculoCard from "@/components/vehiculo-card";
import { getVehiculos } from "@/lib/api";

interface Props {
  searchParams: Promise<{
    tipo?: string;
    marca?: string;
    disponible?: string;
  }>;
}

// Tipos disponibles para el filtro
const TIPOS = [
  { value: "", label: "Todos" },
  { value: "sedan", label: "Sedán" },
  { value: "suv", label: "SUV" },
  { value: "pickup", label: "Pickup" },
  { value: "hatchback", label: "Hatchback" },
];

export default async function VehiculosPage({ searchParams }: Props) {
  const params = await searchParams;

  // Obtener vehículos desde Strapi con filtros opcionales
  const vehiculos = await getVehiculos({
    tipo: params.tipo || undefined,
    marca: params.marca || undefined,
    disponible: params.disponible === "true" ? true : undefined,
  });

  const tipoActivo = params.tipo ?? "";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Catálogo de Vehículos</h1>
          <p className="text-gray-500 mt-1">
            {vehiculos.length} vehículo{vehiculos.length !== 1 ? "s" : ""} encontrado
            {vehiculos.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Filtros por tipo */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TIPOS.map((t) => (
            <a
              key={t.value}
              href={
                t.value
                  ? `/vehiculos?tipo=${t.value}`
                  : "/vehiculos"
              }
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                tipoActivo === t.value
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300 hover:border-black"
              }`}
            >
              {t.label}
            </a>
          ))}

          {/* Filtro: solo disponibles */}
          <a
            href={
              params.disponible === "true"
                ? "/vehiculos"
                : `/vehiculos?disponible=true${params.tipo ? `&tipo=${params.tipo}` : ""}`
            }
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              params.disponible === "true"
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-green-600"
            }`}
          >
            ✅ Solo disponibles
          </a>
        </div>

        {/* Grid de vehículos */}
        {vehiculos.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🚗</p>
            <p className="text-lg">No se encontraron vehículos</p>
            <a href="/vehiculos" className="text-sm underline mt-2 inline-block">
              Ver todos
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {vehiculos.map((v) => (
              <VehiculoCard key={v.id} vehiculo={v} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
