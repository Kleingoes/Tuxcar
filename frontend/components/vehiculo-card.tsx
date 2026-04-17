// components/vehiculo-card.tsx
import Link from "next/link";
import { Vehiculo } from "@/lib/types";

interface Props {
  vehiculo: Vehiculo;
}

// Etiqueta de color según tipo de vehículo
const TIPO_LABEL: Record<string, string> = {
  sedan: "Sedán",
  suv: "SUV",
  pickup: "Pickup",
  hatchback: "Hatchback",
  coupe: "Coupé",
  van: "Van",
};

export default function VehiculoCard({ vehiculo: v }: Props) {
  const disponible = v.disponible !== false;

  return (
    <Link href={`/vehiculos/${v.id}`} className="group block">
      <div className="border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col gap-3">

        {/* Encabezado */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-semibold leading-tight group-hover:underline">
            {v.nombre}
          </h2>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
              disponible
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {disponible ? "Disponible" : "Vendido"}
          </span>
        </div>

        {/* Tipo */}
        {v.tipo && (
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {TIPO_LABEL[v.tipo] ?? v.tipo}
          </span>
        )}

        {/* Detalles */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
          <span>🏷️ {v.marca}</span>
          <span>📅 {v.anio}</span>
          <span>⚙️ {v.transmision}</span>
          <span>⛽ {v.combustible}</span>
          <span>🎨 {v.color}</span>
          <span>🚪 {v.puertas} puertas</span>
          {v.kilometraje != null && (
            <span className="col-span-2">
              🛣️ {v.kilometraje.toLocaleString("es-MX")} km
            </span>
          )}
        </div>

        {/* Concesionaria */}
        {v.concesionaria && (
          <p className="text-xs text-gray-400 truncate">
            📍 {v.concesionaria.nombre} — {v.concesionaria.ciudad}
          </p>
        )}

        {/* Precio */}
        <p className="text-xl font-bold text-green-600 mt-auto">
          {v.precio != null
            ? `$${v.precio.toLocaleString("es-MX")} MXN`
            : "Precio no disponible"}
        </p>
      </div>
    </Link>
  );
}
