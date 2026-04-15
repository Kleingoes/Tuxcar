import Navbar from "@/components/navbar";
import { getVehiculos } from "@/lib/api";

export default async function Home() {
  const vehiculos = await getVehiculos();

  return (
    <div>
      <Navbar />

      <main className="p-10">
        <h1 className="text-3xl font-bold mb-6">Vehículos</h1>

        <div className="grid grid-cols-3 gap-6">
          {vehiculos.map((v: any) => (
            <div key={v.id} className="border p-4 rounded-xl shadow">
              <h2 className="text-xl font-semibold">{v.nombre}</h2>
              <p>Marca: {v.marca}</p>
              <p>Modelo: {v.modelo}</p>
              <p className="text-green-600 font-bold">
                ${v.precio ?? "No disponible"}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}