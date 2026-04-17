// seed_solo_citas.js - Solo inserta las citas con formato de hora corregido
// Ejecutar con: node seed_solo_citas.js

const BASE_URL = 'http://localhost:1337/api';
const API_TOKEN = '39c9e973e5781028caa096b8fee9847ba2ab1e58fd5c1e51bacd4467522882e626a308c37feceddec66ae5e0736b972cedeb811eccc0343b3dc4472d2c83f2fc2a84a08682c5e49e2f67535a2af1bf94c4bfe820728fe170637adceb8bc42e472eb8b03ab06a29e8f09b59340bac1f6cc03045757f4030f5b2118be3791044c2'; 

async function get(endpoint) {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` }
  });
  const json = await res.json();
  return json.data ?? [];
}

async function post(endpoint, data) {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`
    },
    body: JSON.stringify({ data })
  });
  const json = await res.json();
  if (!json.data) {
    console.error(`❌ Error en ${endpoint}:`, JSON.stringify(json));
    return null;
  }
  return json.data;
}

function rel(id) {
  if (!id) return null;
  return { connect: [{ id }] };
}

async function seed() {
  if (API_TOKEN === 'PON_AQUÍ_TU_TOKEN') {
    console.error('❌ Configura tu API_TOKEN primero.');
    process.exit(1);
  }

  console.log('🌱 Cargando datos existentes...\n');

  const clientes       = await get('clientes?pagination[limit]=10');
  const vehiculos      = await get('vehiculos?pagination[limit]=10');
  const empleados      = await get('empleados?pagination[limit]=10');
  const concesionarias = await get('concesionarias?pagination[limit]=5');

  console.log('📅 Insertando citas...');
  const citas = await Promise.all([
    post('citas', {
      fecha: '2024-03-12', hora: '10:00:00.000',
      tipo: 'test_drive', estatus: 'completada',
      notas: 'Cliente quedó satisfecho con el manejo',
      cliente: rel(clientes[0]?.id), vehiculo: rel(vehiculos[0]?.id),
      empleado: rel(empleados[1]?.id), concesionaria: rel(concesionarias[0]?.id)
    }),
    post('citas', {
      fecha: '2024-04-18', hora: '12:30:00.000',
      tipo: 'consulta', estatus: 'completada',
      notas: 'Empresa evaluó opciones de flotilla',
      cliente: rel(clientes[2]?.id), vehiculo: rel(vehiculos[1]?.id),
      empleado: rel(empleados[0]?.id), concesionaria: rel(concesionarias[0]?.id)
    }),
    post('citas', {
      fecha: '2024-06-10', hora: '09:00:00.000',
      tipo: 'entrega', estatus: 'completada',
      notas: 'Entrega del vehículo con revisión final',
      cliente: rel(clientes[1]?.id), vehiculo: rel(vehiculos[2]?.id),
      empleado: rel(empleados[1]?.id), concesionaria: rel(concesionarias[0]?.id)
    }),
    post('citas', {
      fecha: '2024-07-20', hora: '11:00:00.000',
      tipo: 'test_drive', estatus: 'programada',
      notas: 'Primera visita, interesado en SUV',
      cliente: rel(clientes[3]?.id), vehiculo: rel(vehiculos[5]?.id),
      empleado: rel(empleados[3]?.id), concesionaria: rel(concesionarias[1]?.id)
    }),
    post('citas', {
      fecha: '2024-05-25', hora: '16:00:00.000',
      tipo: 'servicio', estatus: 'cancelada',
      notas: 'Cliente canceló por viaje de trabajo',
      cliente: rel(clientes[4]?.id), vehiculo: rel(vehiculos[3]?.id),
      empleado: rel(empleados[4]?.id), concesionaria: rel(concesionarias[1]?.id)
    }),
    post('citas', {
      fecha: '2024-08-05', hora: '10:30:00.000',
      tipo: 'test_drive', estatus: 'no_asistio',
      notas: 'No se presentó sin avisar',
      cliente: rel(clientes[5]?.id), vehiculo: rel(vehiculos[6]?.id),
      empleado: rel(empleados[5]?.id), concesionaria: rel(concesionarias[2]?.id)
    }),
  ]);

  console.log(`   ✅ ${citas.filter(Boolean).length} citas creadas`);
  console.log('\n🚗 Listo! Revisa las citas en Strapi Admin.');
}

seed().catch(console.error);
