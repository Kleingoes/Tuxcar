// seed_nuevas_colecciones.js
// Agrega datos de prueba para: Cotizacion, Cita, Lead, Financiamiento, OrdenServicio
// REQUISITO: Ya debes tener corrido el seed.js original primero.

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

  // Cargar IDs existentes
  const clientes     = await get('clientes?pagination[limit]=10');
  const vehiculos    = await get('vehiculos?pagination[limit]=10');
  const empleados    = await get('empleados?pagination[limit]=10');
  const concesionarias = await get('concesionarias?pagination[limit]=5');
  const ventas       = await get('ventas?pagination[limit]=10');
  const refacciones  = await get('refaccions?pagination[limit]=10');

  if (!clientes.length || !vehiculos.length) {
    console.error('❌ No hay clientes o vehículos. Corre seed.js primero.');
    process.exit(1);
  }

  console.log(`   Encontrados: ${clientes.length} clientes, ${vehiculos.length} vehículos, ${ventas.length} ventas\n`);

  // ─── 1. COTIZACIONES ─────────────────────────────────────────────────
  console.log('📋 Insertando cotizaciones...');
  const cotizaciones = await Promise.all([
    post('cotizaciones', {
      fecha: '2024-02-10',
      vigencia: '2024-02-24',
      total: 285000,
      descuento: 5000,
      estatus: 'aceptada',
      notas: 'Cliente interesado, negoció descuento de $5,000',
      cliente: rel(clientes[0]?.id),
      vehiculo: rel(vehiculos[0]?.id),
      empleado: rel(empleados[1]?.id)
    }),
    post('cotizaciones', {
      fecha: '2024-03-20',
      vigencia: '2024-04-03',
      total: 520000,
      descuento: 0,
      estatus: 'enviada',
      notas: 'Empresa solicita factura a nombre de razón social',
      cliente: rel(clientes[2]?.id),
      vehiculo: rel(vehiculos[1]?.id),
      empleado: rel(empleados[0]?.id)
    }),
    post('cotizaciones', {
      fecha: '2024-04-15',
      vigencia: '2024-04-29',
      total: 398000,
      descuento: 8000,
      estatus: 'rechazada',
      notas: 'Cliente decidió buscar otras opciones',
      cliente: rel(clientes[3]?.id),
      vehiculo: rel(vehiculos[7]?.id),
      empleado: rel(empleados[1]?.id)
    }),
    post('cotizaciones', {
      fecha: '2024-05-01',
      vigencia: '2024-05-15',
      total: 355000,
      descuento: 3000,
      estatus: 'borrador',
      notas: 'Pendiente confirmación de disponibilidad',
      cliente: rel(clientes[4]?.id),
      vehiculo: rel(vehiculos[6]?.id),
      empleado: rel(empleados[4]?.id)
    }),
    post('cotizaciones', {
      fecha: '2024-01-08',
      vigencia: '2024-01-22',
      total: 490000,
      descuento: 10000,
      estatus: 'expirada',
      notas: 'Cliente no respondió en tiempo',
      cliente: rel(clientes[5]?.id),
      vehiculo: rel(vehiculos[4]?.id),
      empleado: rel(empleados[0]?.id)
    }),
  ]);
  console.log(`   ✅ ${cotizaciones.filter(Boolean).length} cotizaciones creadas`);

  // ─── 2. CITAS ─────────────────────────────────────────────────────────
  console.log('📅 Insertando citas...');
  const citas = await Promise.all([
    post('citas', {
      fecha: '2024-03-12',
      hora: '10:00',
      tipo: 'test_drive',
      estatus: 'completada',
      notas: 'Cliente quedó satisfecho con el manejo',
      cliente: rel(clientes[0]?.id),
      vehiculo: rel(vehiculos[0]?.id),
      empleado: rel(empleados[1]?.id),
      concesionaria: rel(concesionarias[0]?.id)
    }),
    post('citas', {
      fecha: '2024-04-18',
      hora: '12:30',
      tipo: 'consulta',
      estatus: 'completada',
      notas: 'Empresa evaluó opciones de flotilla',
      cliente: rel(clientes[2]?.id),
      vehiculo: rel(vehiculos[1]?.id),
      empleado: rel(empleados[0]?.id),
      concesionaria: rel(concesionarias[0]?.id)
    }),
    post('citas', {
      fecha: '2024-06-10',
      hora: '09:00',
      tipo: 'entrega',
      estatus: 'completada',
      notas: 'Entrega del vehículo con revisión final',
      cliente: rel(clientes[1]?.id),
      vehiculo: rel(vehiculos[2]?.id),
      empleado: rel(empleados[1]?.id),
      concesionaria: rel(concesionarias[0]?.id)
    }),
    post('citas', {
      fecha: '2024-07-20',
      hora: '11:00',
      tipo: 'test_drive',
      estatus: 'programada',
      notas: 'Primera visita, interesado en SUV',
      cliente: rel(clientes[3]?.id),
      vehiculo: rel(vehiculos[5]?.id),
      empleado: rel(empleados[3]?.id),
      concesionaria: rel(concesionarias[1]?.id)
    }),
    post('citas', {
      fecha: '2024-05-25',
      hora: '16:00',
      tipo: 'servicio',
      estatus: 'cancelada',
      notas: 'Cliente canceló por viaje de trabajo',
      cliente: rel(clientes[4]?.id),
      vehiculo: rel(vehiculos[3]?.id),
      empleado: rel(empleados[4]?.id),
      concesionaria: rel(concesionarias[1]?.id)
    }),
    post('citas', {
      fecha: '2024-08-05',
      hora: '10:30',
      tipo: 'test_drive',
      estatus: 'no_asistio',
      notas: 'No se presentó sin avisar',
      cliente: rel(clientes[5]?.id),
      vehiculo: rel(vehiculos[6]?.id),
      empleado: rel(empleados[5]?.id),
      concesionaria: rel(concesionarias[2]?.id)
    }),
  ]);
  console.log(`   ✅ ${citas.filter(Boolean).length} citas creadas`);

  // ─── 3. LEADS ─────────────────────────────────────────────────────────
  console.log('📣 Insertando leads...');
  const leads = await Promise.all([
    post('leads', {
      nombre: 'Diego Ramírez Castro',
      correo: 'diego.ramirez@gmail.com',
      telefono: '9611234999',
      mensaje: 'Me interesa el Mazda 3, ¿tienen financiamiento disponible?',
      estatus: 'nuevo',
      fecha_contacto: '2024-07-15T14:30:00.000Z',
      vehiculo_interes: rel(vehiculos[6]?.id),
      concesionaria: rel(concesionarias[2]?.id),
      empleado_asignado: rel(empleados[5]?.id)
    }),
    post('leads', {
      nombre: 'Laura Mendoza Silva',
      correo: 'laura.mendoza@hotmail.com',
      telefono: '9619876001',
      mensaje: 'Busco una SUV para familia, presupuesto $400,000',
      estatus: 'contactado',
      fecha_contacto: '2024-07-20T10:00:00.000Z',
      vehiculo_interes: rel(vehiculos[5]?.id),
      concesionaria: rel(concesionarias[0]?.id),
      empleado_asignado: rel(empleados[1]?.id)
    }),
    post('leads', {
      nombre: 'Empresa Constructora del Sur SA',
      correo: 'compras@constructorasur.com',
      telefono: '9613344888',
      mensaje: 'Necesitamos 3 pickups para nuestra obra, ¿qué descuento nos dan?',
      estatus: 'convertido',
      fecha_contacto: '2024-06-01T09:00:00.000Z',
      vehiculo_interes: rel(vehiculos[1]?.id),
      concesionaria: rel(concesionarias[0]?.id),
      empleado_asignado: rel(empleados[0]?.id)
    }),
    post('leads', {
      nombre: 'Roberto Trujillo Vega',
      correo: 'r.trujillo@yahoo.com',
      telefono: '9617788111',
      mensaje: 'Vi el Corolla en su página, ¿está disponible para test drive?',
      estatus: 'descartado',
      fecha_contacto: '2024-05-10T16:00:00.000Z',
      vehiculo_interes: rel(vehiculos[8]?.id),
      concesionaria: rel(concesionarias[1]?.id),
      empleado_asignado: rel(empleados[3]?.id)
    }),
    post('leads', {
      nombre: 'Sofía Herrera Pérez',
      correo: 'sofia.herrera@gmail.com',
      telefono: '9625566111',
      mensaje: 'Primera vez que compro un auto, ¿me pueden asesorar?',
      estatus: 'nuevo',
      fecha_contacto: '2024-08-10T11:00:00.000Z',
      vehiculo_interes: rel(vehiculos[3]?.id),
      concesionaria: rel(concesionarias[2]?.id),
      empleado_asignado: rel(empleados[5]?.id)
    }),
  ]);
  console.log(`   ✅ ${leads.filter(Boolean).length} leads creados`);

  // ─── 4. FINANCIAMIENTOS ───────────────────────────────────────────────
  console.log('💳 Insertando financiamientos...');
  const financiamientos = await Promise.all([
    post('financiamientos', {
      institucion: 'BBVA México',
      monto_financiado: 230000,
      enganche: 55000,
      plazo_meses: 48,
      tasa_interes: 12.5,
      mensualidad: 6142,
      fecha_inicio: '2024-03-20',
      fecha_fin: '2028-03-20',
      estatus: 'activo',
      venta: ventas[0] ? rel(ventas[0].id) : null,
      cliente: rel(clientes[0]?.id)
    }),
    post('financiamientos', {
      institucion: 'Banorte',
      monto_financiado: 420000,
      enganche: 100000,
      plazo_meses: 60,
      tasa_interes: 11.9,
      mensualidad: 9280,
      fecha_inicio: '2024-04-25',
      fecha_fin: '2029-04-25',
      estatus: 'activo',
      venta: ventas[1] ? rel(ventas[1].id) : null,
      cliente: rel(clientes[2]?.id)
    }),
    post('financiamientos', {
      institucion: 'Scotiabank',
      monto_financiado: 400000,
      enganche: 90000,
      plazo_meses: 36,
      tasa_interes: 13.0,
      mensualidad: 13450,
      fecha_inicio: null,
      fecha_fin: null,
      estatus: 'solicitado',
      venta: ventas[3] ? rel(ventas[3].id) : null,
      cliente: rel(clientes[3]?.id)
    }),
  ]);
  console.log(`   ✅ ${financiamientos.filter(Boolean).length} financiamientos creados`);

  // ─── 5. ÓRDENES DE SERVICIO ───────────────────────────────────────────
  console.log('🔧 Insertando órdenes de servicio...');
  const ordenes = await Promise.all([
    post('orden-servicios', {
      fecha_entrada: '2024-05-02',
      fecha_salida: '2024-05-04',
      descripcion_problema: 'Cambio de aceite y revisión de frenos delanteros',
      diagnostico: 'Aceite vencido, pastillas desgastadas al 20%',
      mano_obra: 800,
      total: 2250,
      kilometraje_entrada: 48500,
      estatus: 'entregado',
      notas: 'Se reemplazaron pastillas y filtro de aceite',
      cliente: rel(clientes[1]?.id),
      vehiculo: rel(vehiculos[3]?.id),
      empleado: rel(empleados[2]?.id),
      concesionaria: rel(concesionarias[0]?.id),
      refacciones: refacciones[0] && refacciones[1]
        ? { connect: [{ id: refacciones[0].id }, { id: refacciones[1].id }] }
        : undefined
    }),
    post('orden-servicios', {
      fecha_entrada: '2024-06-15',
      fecha_salida: null,
      descripcion_problema: 'Ruido en suspensión delantera al pasar topes',
      diagnostico: 'Amortiguadores desgastados, se requiere reemplazo',
      mano_obra: 1200,
      total: 3600,
      kilometraje_entrada: 32100,
      estatus: 'en_proceso',
      notas: 'Esperando refacción de proveedor',
      cliente: rel(clientes[0]?.id),
      vehiculo: rel(vehiculos[2]?.id),
      empleado: rel(empleados[2]?.id),
      concesionaria: rel(concesionarias[0]?.id),
      refacciones: refacciones[2]
        ? { connect: [{ id: refacciones[2].id }] }
        : undefined
    }),
    post('orden-servicios', {
      fecha_entrada: '2024-07-08',
      fecha_salida: '2024-07-08',
      descripcion_problema: 'Batería descargada, no enciende',
      diagnostico: 'Batería agotada por 3 años de uso',
      mano_obra: 200,
      total: 2000,
      kilometraje_entrada: 65200,
      estatus: 'entregado',
      notas: 'Reemplazo de batería en el día',
      cliente: rel(clientes[4]?.id),
      vehiculo: rel(vehiculos[8]?.id),
      empleado: rel(empleados[5]?.id),
      concesionaria: rel(concesionarias[2]?.id),
      refacciones: refacciones[3]
        ? { connect: [{ id: refacciones[3].id }] }
        : undefined
    }),
    post('orden-servicios', {
      fecha_entrada: '2024-08-01',
      fecha_salida: null,
      descripcion_problema: 'Revisión general previa a viaje largo',
      diagnostico: null,
      mano_obra: 500,
      total: null,
      kilometraje_entrada: 18200,
      estatus: 'recibido',
      notas: 'Diagnóstico pendiente',
      cliente: rel(clientes[3]?.id),
      vehiculo: rel(vehiculos[7]?.id),
      empleado: rel(empleados[2]?.id),
      concesionaria: rel(concesionarias[1]?.id)
    }),
  ]);
  console.log(`   ✅ ${ordenes.filter(Boolean).length} órdenes de servicio creadas`);

  // ─── RESUMEN ──────────────────────────────────────────────────────────
  console.log('\n✅ Seed de nuevas colecciones completado!');
  console.log('─────────────────────────────────────────');
  console.log(`   Cotizaciones      : ${cotizaciones.filter(Boolean).length}`);
  console.log(`   Citas             : ${citas.filter(Boolean).length}`);
  console.log(`   Leads             : ${leads.filter(Boolean).length}`);
  console.log(`   Financiamientos   : ${financiamientos.filter(Boolean).length}`);
  console.log(`   Órdenes servicio  : ${ordenes.filter(Boolean).length}`);
  console.log('─────────────────────────────────────────');
  console.log('🚗 Revisa los datos en tu Strapi Admin!');
}

seed().catch(console.error);
