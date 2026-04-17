// seed.js - Script de datos de prueba para Tuxcar
// Ejecutar con: node seed.js

const BASE_URL = 'http://localhost:1337/api';


// Settings → API Tokens → Create new API Token (Full access)
const API_TOKEN = '39c9e973e5781028caa096b8fee9847ba2ab1e58fd5c1e51bacd4467522882e626a308c37feceddec66ae5e0736b972cedeb811eccc0343b3dc4472d2c83f2fc2a84a08682c5e49e2f67535a2af1bf94c4bfe820728fe170637adceb8bc42e472eb8b03ab06a29e8f09b59340bac1f6cc03045757f4030f5b2118be3791044c2';


async function post(endpoint, data) {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`
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

// Helper para relaciones Strapi v4
function rel(id) {
  if (!id) return null;
  return { connect: [{ id }] };
}

async function seed() {
  if (API_TOKEN === 'PON_AQUÍ_TU_TOKEN') {
    console.error('❌ Debes configurar tu API_TOKEN antes de correr el seed.');
    console.error('   Ve a Strapi Admin → Settings → API Tokens → Create new API Token (Full access)');
    process.exit(1);
  }

  console.log('🌱 Iniciando seed de Tuxcar...\n');

  // ─── 1. CONCESIONARIAS ───────────────────────────────────────────────
  console.log('📍 Insertando concesionarias...');
  const concesionarias = await Promise.all([
    post('concesionarias', {
      nombre: 'AutoChiapas Tuxcar',
      ciudad: 'Tuxtla Gutiérrez',
      Estado: 'Chiapas',
      direccion: 'Blvd. Andrés Serra Rojas 1200, Col. Centro',
      telefono: '9611234567',
      contacto: 'ventas@autochiapas.com'
    }),
    post('concesionarias', {
      nombre: 'Motores del Sureste',
      ciudad: 'San Cristóbal de las Casas',
      Estado: 'Chiapas',
      direccion: 'Av. General Utrilla 450, Col. Centro',
      telefono: '9678765432',
      contacto: 'info@motoressureste.com'
    }),
    post('concesionarias', {
      nombre: 'Chiapas Motors',
      ciudad: 'Tapachula',
      Estado: 'Chiapas',
      direccion: 'Calle Central Norte 890, Col. Centro',
      telefono: '9622345678',
      contacto: 'contacto@chiaspasmotors.com'
    }),
  ]);
  const [conc1, conc2, conc3] = concesionarias;
  console.log(`   ✅ ${concesionarias.filter(Boolean).length} concesionarias creadas`);

  // ─── 2. CLIENTES ─────────────────────────────────────────────────────
  console.log('👤 Insertando clientes...');
  const clientes = await Promise.all([
    post('clientes', { nombre: 'Carlos Hernández Ruiz', correo: 'carlos.hernandez@gmail.com', Telefono: '9611112233', direccion: 'Calle Central Oriente 45, Tuxtla Gutiérrez', fecha_registro: '2024-01-15T10:00:00.000Z', tipo: 'individual' }),
    post('clientes', { nombre: 'María López Gómez', correo: 'maria.lopez@hotmail.com', Telefono: '9619876543', direccion: 'Av. 5 de Mayo 230, Tuxtla Gutiérrez', fecha_registro: '2024-02-20T10:00:00.000Z', tipo: 'individual' }),
    post('clientes', { nombre: 'Transportes Chiapas SA de CV', correo: 'admin@transporteschiapas.com', Telefono: '9613344556', direccion: 'Blvd. Belisario Domínguez 1500, Tuxtla Gutiérrez', fecha_registro: '2024-03-10T10:00:00.000Z', tipo: 'empresa' }),
    post('clientes', { nombre: 'José Pérez Torres', correo: 'jose.perez@yahoo.com', Telefono: '9617788990', direccion: 'Calle 3 Sur Oriente 78, San Cristóbal de las Casas', fecha_registro: '2024-04-05T10:00:00.000Z', tipo: 'individual' }),
    post('clientes', { nombre: 'Ana González Méndez', correo: 'ana.gonzalez@gmail.com', Telefono: '9625566778', direccion: 'Av. Hidalgo 320, Tapachula', fecha_registro: '2024-05-12T10:00:00.000Z', tipo: 'individual' }),
    post('clientes', { nombre: 'Grupo Empresarial Olmeca', correo: 'compras@grupoelmeca.com', Telefono: '9614455667', direccion: 'Blvd. Andrés Serra Rojas 890, Tuxtla Gutiérrez', fecha_registro: '2024-06-01T10:00:00.000Z', tipo: 'empresa' }),
  ]);
  console.log(`   ✅ ${clientes.filter(Boolean).length} clientes creados`);

  // ─── 3. EMPLEADOS ─────────────────────────────────────────────────────
  console.log('👔 Insertando empleados...');
  const empleados = await Promise.all([
    post('empleados', { nombre: 'Roberto Morales Castillo', puesto: 'gerente', telefono: '9611234001', correo: 'roberto.morales@autochiapas.com', fecha_ingreso: '2022-01-10', activo: true, concesionaria: rel(conc1?.id) }),
    post('empleados', { nombre: 'Lucía Ramírez Díaz', puesto: 'vendedor', telefono: '9611234002', correo: 'lucia.ramirez@autochiapas.com', fecha_ingreso: '2022-06-15', activo: true, concesionaria: rel(conc1?.id) }),
    post('empleados', { nombre: 'Miguel Ángel Cruz López', puesto: 'mecanico', telefono: '9611234003', correo: 'miguel.cruz@autochiapas.com', fecha_ingreso: '2023-02-01', activo: true, concesionaria: rel(conc1?.id) }),
    post('empleados', { nombre: 'Sandra Villanueva Torres', puesto: 'gerente', telefono: '9678765001', correo: 'sandra.villanueva@motoressureste.com', fecha_ingreso: '2021-08-20', activo: true, concesionaria: rel(conc2?.id) }),
    post('empleados', { nombre: 'Fernando Ochoa Jiménez', puesto: 'vendedor', telefono: '9678765002', correo: 'fernando.ochoa@motoressureste.com', fecha_ingreso: '2023-05-10', activo: true, concesionaria: rel(conc2?.id) }),
    post('empleados', { nombre: 'Patricia Solís Ruiz', puesto: 'administrativo', telefono: '9622345001', correo: 'patricia.solis@chiaspasmotors.com', fecha_ingreso: '2022-11-01', activo: true, concesionaria: rel(conc3?.id) }),
  ]);
  console.log(`   ✅ ${empleados.filter(Boolean).length} empleados creados`);

  // ─── 4. VEHÍCULOS ─────────────────────────────────────────────────────
  console.log('🚗 Insertando vehículos...');
  const vehiculos = await Promise.all([
    post('vehiculos', { nombre: 'Nissan Sentra 2022', marca: 'Nissan', modelo: 'Sentra', anio: 2022, color: 'Blanco', precio: 285000, kilometraje: 15000, tipo: 'sedan', transmision: 'automatica', combustible: 'gasolina', puertas: 4, estatus: 'disponible', disponible: true, numero_serie: 'VIN-NS2022-001', concesionaria: rel(conc1?.id) }),
    post('vehiculos', { nombre: 'Toyota Hilux 2023', marca: 'Toyota', modelo: 'Hilux', anio: 2023, color: 'Gris', precio: 520000, kilometraje: 5000, tipo: 'pickup', transmision: 'manual', combustible: 'diesel', puertas: 4, estatus: 'disponible', disponible: true, numero_serie: 'VIN-TH2023-002', concesionaria: rel(conc1?.id) }),
    post('vehiculos', { nombre: 'Volkswagen Jetta 2021', marca: 'Volkswagen', modelo: 'Jetta', anio: 2021, color: 'Negro', precio: 310000, kilometraje: 32000, tipo: 'sedan', transmision: 'automatica', combustible: 'gasolina', puertas: 4, estatus: 'disponible', disponible: true, numero_serie: 'VIN-VJ2021-003', concesionaria: rel(conc1?.id) }),
    post('vehiculos', { nombre: 'Chevrolet Aveo 2020', marca: 'Chevrolet', modelo: 'Aveo', anio: 2020, color: 'Rojo', precio: 185000, kilometraje: 48000, tipo: 'sedan', transmision: 'manual', combustible: 'gasolina', puertas: 4, estatus: 'disponible', disponible: true, numero_serie: 'VIN-CA2020-004', concesionaria: rel(conc2?.id) }),
    post('vehiculos', { nombre: 'Ford Ranger 2023', marca: 'Ford', modelo: 'Ranger', anio: 2023, color: 'Azul', precio: 490000, kilometraje: 8000, tipo: 'pickup', transmision: 'automatica', combustible: 'diesel', puertas: 4, estatus: 'disponible', disponible: true, numero_serie: 'VIN-FR2023-005', concesionaria: rel(conc2?.id) }),
    post('vehiculos', { nombre: 'Honda CR-V 2022', marca: 'Honda', modelo: 'CR-V', anio: 2022, color: 'Plata', precio: 420000, kilometraje: 22000, tipo: 'suv', transmision: 'automatica', combustible: 'gasolina', puertas: 4, estatus: 'disponible', disponible: true, numero_serie: 'VIN-HC2022-006', concesionaria: rel(conc2?.id) }),
    post('vehiculos', { nombre: 'Mazda 3 2023', marca: 'Mazda', modelo: '3', anio: 2023, color: 'Rojo', precio: 355000, kilometraje: 3000, tipo: 'sedan', transmision: 'automatica', combustible: 'gasolina', puertas: 4, estatus: 'disponible', disponible: true, numero_serie: 'VIN-MZ2023-007', concesionaria: rel(conc3?.id) }),
    post('vehiculos', { nombre: 'Kia Sportage 2022', marca: 'Kia', modelo: 'Sportage', anio: 2022, color: 'Blanco', precio: 398000, kilometraje: 18000, tipo: 'suv', transmision: 'automatica', combustible: 'gasolina', puertas: 4, estatus: 'disponible', disponible: true, numero_serie: 'VIN-KS2022-008', concesionaria: rel(conc3?.id) }),
    post('vehiculos', { nombre: 'Toyota Corolla 2019', marca: 'Toyota', modelo: 'Corolla', anio: 2019, color: 'Gris', precio: 210000, kilometraje: 65000, tipo: 'sedan', transmision: 'automatica', combustible: 'gasolina', puertas: 4, estatus: 'vendido', disponible: false, numero_serie: 'VIN-TC2019-009', concesionaria: rel(conc1?.id) }),
    post('vehiculos', { nombre: 'Nissan NP300 2021', marca: 'Nissan', modelo: 'NP300', anio: 2021, color: 'Blanco', precio: 340000, kilometraje: 40000, tipo: 'pickup', transmision: 'manual', combustible: 'diesel', puertas: 2, estatus: 'disponible', disponible: true, numero_serie: 'VIN-NN2021-010', concesionaria: rel(conc3?.id) }),
  ]);
  console.log(`   ✅ ${vehiculos.filter(Boolean).length} vehículos creados`);

  // ─── 5. REFACCIONES ───────────────────────────────────────────────────
  console.log('🔧 Insertando refacciones...');
  const refacciones = await Promise.all([
    post('refaccions', { nombre: 'Filtro de aceite Nissan', precio: 180, stock: 25, marca: 'Nissan', categoria: 'motor', numero_refaccion: 'REF-NIS-001', concesionaria: rel(conc1?.id) }),
    post('refaccions', { nombre: 'Pastillas de freno Toyota', precio: 650, stock: 15, marca: 'Toyota', categoria: 'frenos', numero_refaccion: 'REF-TOY-002', concesionaria: rel(conc1?.id) }),
    post('refaccions', { nombre: 'Amortiguador delantero VW', precio: 1200, stock: 8, marca: 'Volkswagen', categoria: 'suspension', numero_refaccion: 'REF-VW-003', concesionaria: rel(conc2?.id) }),
    post('refaccions', { nombre: 'Batería 12V Bosch', precio: 1800, stock: 12, marca: 'Bosch', categoria: 'electrico', numero_refaccion: 'REF-BSC-004', concesionaria: rel(conc2?.id) }),
    post('refaccions', { nombre: 'Llanta 195/65 R15', precio: 1400, stock: 20, marca: 'Bridgestone', categoria: 'otro', numero_refaccion: 'REF-BRD-005', concesionaria: rel(conc3?.id) }),
    post('refaccions', { nombre: 'Bujías NGK set x4', precio: 480, stock: 30, marca: 'NGK', categoria: 'motor', numero_refaccion: 'REF-NGK-006', concesionaria: rel(conc3?.id) }),
    post('refaccions', { nombre: 'Espejo retrovisor derecho Chevrolet', precio: 890, stock: 6, marca: 'Chevrolet', categoria: 'carroceria', numero_refaccion: 'REF-CHV-007', concesionaria: rel(conc1?.id) }),
    post('refaccions', { nombre: 'Filtro de aire Ford', precio: 320, stock: 18, marca: 'Ford', categoria: 'motor', numero_refaccion: 'REF-FRD-008', concesionaria: rel(conc2?.id) }),
  ]);
  console.log(`   ✅ ${refacciones.filter(Boolean).length} refacciones creadas`);

  // ─── 6. VENTAS ────────────────────────────────────────────────────────
  // Enums exactos del schema:
  //   estatus:     "pendiente" | "completada" | "cancelada"
  //   metodo_pago: "efectivo"  | "tarjeta "   | "financiamiento"
  console.log('💰 Insertando ventas...');
  const ventas = await Promise.all([
    post('ventas', { fecha: '2024-03-15', total: 285000, estatus: 'completada', metodo_pago: 'financiamiento', cantidad: 1, notas: 'Cliente pagó con financiamiento BBVA', cliente: rel(clientes[0]?.id), vehiculo: rel(vehiculos[0]?.id) }),
    post('ventas', { fecha: '2024-04-20', total: 520000, estatus: 'completada', metodo_pago: 'efectivo', cantidad: 1, notas: 'Empresa solicitó factura', cliente: rel(clientes[2]?.id), vehiculo: rel(vehiculos[1]?.id) }),
    post('ventas', { fecha: '2024-05-10', total: 310000, estatus: 'completada', metodo_pago: 'efectivo', cantidad: 1, notas: 'Venta directa en sucursal', cliente: rel(clientes[1]?.id), vehiculo: rel(vehiculos[2]?.id) }),
    post('ventas', { fecha: '2024-06-08', total: 490000, estatus: 'pendiente', metodo_pago: 'financiamiento', cantidad: 1, notas: 'Pendiente aprobación de crédito', cliente: rel(clientes[3]?.id), vehiculo: rel(vehiculos[4]?.id) }),
    post('ventas', { fecha: '2024-07-01', total: 420000, estatus: 'completada', metodo_pago: 'efectivo', cantidad: 1, notas: 'Pago recibido', cliente: rel(clientes[5]?.id), vehiculo: rel(vehiculos[5]?.id) }),
    post('ventas', { fecha: '2024-08-14', total: 210000, estatus: 'completada', metodo_pago: 'efectivo', cantidad: 1, notas: '', cliente: rel(clientes[4]?.id), vehiculo: rel(vehiculos[8]?.id) }),
  ]);
  console.log(`   ✅ ${ventas.filter(Boolean).length} ventas creadas`);

  // ─── RESUMEN ──────────────────────────────────────────────────────────
  console.log('\n✅ Seed completado exitosamente!');
  console.log('─────────────────────────────────────────');
  console.log(`   Concesionarias : ${concesionarias.filter(Boolean).length}`);
  console.log(`   Clientes       : ${clientes.filter(Boolean).length}`);
  console.log(`   Empleados      : ${empleados.filter(Boolean).length}`);
  console.log(`   Vehículos      : ${vehiculos.filter(Boolean).length}`);
  console.log(`   Refacciones    : ${refacciones.filter(Boolean).length}`);
  console.log(`   Ventas         : ${ventas.filter(Boolean).length}`);
  console.log('─────────────────────────────────────────');
  console.log('🚗 Ya puedes revisar los datos en Strapi!');
}

seed().catch(console.error);
