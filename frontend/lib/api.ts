export async function getVehiculos() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/vehiculos?populate=*`
    );

    if (!res.ok) {
      throw new Error("Error al obtener vehículos");
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}