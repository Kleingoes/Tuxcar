// backend/seed_vehiculos_v2.js
// Ejecutar: cd backend && node seed_vehiculos_v2.js

const strapi_url = 'http://localhost:1337';
const TOKEN = ''; // Pon tu API token aquí si lo necesitas

const headers = {
  'Content-Type': 'application/json',
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

// 20 vehículos nuevos con variedad de marcas, tipos y precios
const vehiculos = [
  // ── SEDANES ──────────────────────────────────────────────
  {
    nombre: 'Honda Civic 2023',
    marca: 'Honda', modelo: 'Civic', anio: 2023,
    color: 'Gris Oscuro', precio: 395000, kilometraje: 5000,
    tipo: 'sedan', transmision: 'automatica', combustible: 'gasolina',
    puertas: 4, numero_serie: 'VIN-HC2023-011', estatus: 'disponible', disponible: true,
    imagen_url: 'https://images.unsplash.com/photo-1679508056685-3b9bff1d8680?w=800',
    descripcion: 'Honda Civic sedán en excelente estado. Motor 1.5T con 180 hp. Interior en piel sintética, pantalla táctil de 9 pulgadas con Apple CarPlay y Android Auto.',
  },
  {
    nombre: 'Hyundai Elantra 2022',
    marca: 'Hyundai', modelo: 'Elantra', anio: 2022,
    color: 'Blanco', precio: 335000, kilometraje: 12000,
    tipo: 'sedan', transmision: 'automatica', combustible: 'gasolina',
    puertas: 4, numero_serie: 'VIN-HE2022-012', estatus: 'disponible', disponible: true,
    imagen_url: 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=800',
    descripcion: 'Hyundai Elantra con diseño aerodinámico y tecnología de seguridad avanzada. Motor 2.0L con transmisión IVT.',
  },
  {
    nombre: 'Toyota Camry 2021',
    marca: 'Toyota', modelo: 'Camry', anio: 2021,
    color: 'Negro', precio: 420000, kilometraje: 28000,
    tipo: 'sedan', transmision: 'automatica', combustible: 'hibrido',
    puertas: 4, numero_serie: 'VIN-TC2021-013', estatus: 'disponible', disponible: true,
    imagen_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
    descripcion: 'Toyota Camry Hybrid. Combinación de motor eléctrico y gasolina para máxima eficiencia. Interiores premium con asientos en piel.',
  },
  {
    nombre: 'Kia Forte 2023',
    marca: 'Kia', modelo: 'Forte', anio: 2023,
    color: 'Rojo', precio: 340000, kilometraje: 8000,
    tipo: 'sedan', transmision: 'automatica', combustible: 'gasolina',
    puertas: 4, numero_serie: 'VIN-KF2023-014', estatus: 'disponible', disponible: true,
    imagen_url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800',
    descripcion: 'Kia Forte GT Line con paquete deportivo. Pantalla dual de 10.25 pulgadas, asistente de carril y frenado autónomo de emergencia.',
  },

  // ── SUVs ─────────────────────────────────────────────────
  {
    nombre: 'Mazda CX-5 2023',
    marca: 'Mazda', modelo: 'CX-5', anio: 2023,
    color: 'Rojo Cristal', precio: 480000, kilometraje: 6000,
    tipo: 'suv', transmision: 'automatica', combustible: 'gasolina',
    puertas: 4, numero_serie: 'VIN-MC2023-015', estatus: 'disponible', disponible: true,
    imagen_url: 'https://images.unsplash.com/photo-1622463553614-89e3ec103021?w=800',
    descripcion: 'Mazda CX-5 Signature con motor turbo 2.5L de 256 hp. AWD inteligente, interiores en piel Nappa y acabados en madera real.',
  },
  {
    nombre: 'Hyundai Tucson 2023',
    marca: 'Hyundai', modelo: 'Tucson', anio: 2023,
    color: 'Azul', precio: 465000, kilometraje: 10000,
    tipo: 'suv', transmision: 'automatica', combustible: 'gasolina',
    puertas: 4, numero_serie: 'VIN-HT2023-016', estatus: 'disponible', disponible: true,
    imagen_url: 'https://images.unsplash.com/photo-1637700093261-c95f7ca360e4?w=800',
    descripcion: 'Hyundai Tucson con diseño futurista y tecnología BlueLink. Pantalla táctil de 10.25 pulgadas, techo panorámico y asientos ventilados.',
  },
  {
    nombre: 'Toyota RAV4 2022',
    marca: 'Toyota', modelo: 'RAV4', anio: 2022,
    color: 'Plata', precio: 450000, kilometraje: 20000,
    tipo: 'suv', transmision: 'automatica', combustible: 'gasolina',
    puertas: 4, numero_serie: 'VIN-TR2022-017', estatus: 'disponible', disponible: true,
    imagen_url: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800',
    descripcion: 'Toyota RAV4 Adventure. Motor 2.5L Dynamic Force con 203 hp. Sistema Multi-Terrain Select y suspensión reforzada.',
  },
  {
    nombre: 'Chevrolet Tracker 2023',
    marca: 'Chevrolet', modelo: 'Tracker', anio: 2023,
    color: 'Blanco', precio: 385000, kilometraje: 4000,
    tipo: 'suv', transmision: 'automatica', combustible: 'gasolina',
    puertas: 4, numero_serie: 'VIN-CT2023-018', estatus: 'disponible', disponible: true,
    imagen_url: 'https://images.unsplash.com/photo-1606611013016-969c19ba27d5?w=800',
    descripcion: 'Chevrolet Tracker Premier con turbo 1.2L. Wi-Fi integrado, OnStar y sistema de infoentretenimiento con pantalla de 8 pulgadas.',
  },
  {
    nombre: 'Nissan X-Trail 2022',
    marca: 'Nissan', modelo: 'X-Trail', anio: 2022,
    color: 'Gris', precio: 510000, kilometraje: 15000,
    tipo: 'suv', transmision: 'automatica', combustible: 'gasolina',
    puertas: 4, numero_serie: 'VIN-NX2022-019', estatus: 'disponible', disponible: true,
    imagen_url: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
    descripcion: 'Nissan X-Trail Exclusive con 3 filas de asientos. Motor VC-Turbo de 1.5L con 204 hp. ProPILOT Assist y cámara 360°.',
  },

  // ── PICKUPS ──────────────────────────────────────────────
  {
    nombre: 'Chevrolet Silverado 2022',
    marca: 'Chevrolet', modelo: 'Silverado', anio: 2022,
    color: 'Negro', precio: 750000, kilometraje: 25000,
    tipo: 'pickup', transmision: 'automatica', combustible: 'gasolina',
    puertas: 4, numero_serie: 'VIN-CS2022-020', estatus: 'disponible', disponible: true,
    imagen_url: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800',
    descripcion: 'Chevrolet Silverado LTZ con motor V8 5.3L de 355 hp. Caja de 6.5 pies, tracción 4x4, asientos con calefacción y ventilación.',
  },
  {
    nombre: 'Toyota Tacoma 2023',
    marca: 'Toyota', modelo: 'Tacoma', anio: 2023,
    color: 'Verde Militar', precio: 680000, kilometraje: 3000,
    tipo: 'pickup', transmision: 'automatica', combustible: 'gasolina',
    puertas: 4, numero_serie: 'VIN-TT2023-021', estatus: 'disponible', disponible: true,
    imagen_url: 'https://images.unsplash.com/photo-1625231334168-3fa073792da0?w=800',
    descripcion: 'Toyota Tacoma TRD Off-Road. Motor V6 3.5L con 278 hp, diferencial trasero bloqueante y sistema Crawl Control para todo terreno.',
  },
  {
    nombre: 'Ram 700 2023',
    marca: 'Ram', modelo: '700', anio: 2023,
    color: 'Blanco', precio: 295000, kilometraje: 7000,
    tipo: 'pickup', transmision: 'manual', combustible: 'gasolina',
    puertas: 2, numero_serie: 'VIN-R7-2023-022', estatus: 'disponible', disponible: true,
    imagen_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
    descripcion: 'Ram 700 SLT Club Cab. Pickup compacta ideal para trabajo y ciudad. Motor 1.6L con capacidad de carga de 725 kg.',
  },

  // ── HATCHBACKS ───────────────────────────────────────────
  {
    nombre: 'Mazda 3 HB 2023',
    marca: 'Mazda', modelo: '3 Hatchback', anio: 2023,
    color: 'Gris Polímero', precio: 410000, kilometraje: 2000,
    tipo: 'hatchback', transmision: 'automatica', combustible: 'gasolina',
    puertas: 4, numero_serie: 'VIN-M3H2023-023', estatus: 'disponible', disponible: true,
    imagen_url: 'https://images.unsplash.com/photo-1590362891710-889b4d2c088e?w=800',
    descripcion: 'Mazda 3 Hatchback Grand Touring con motor 2.5L Skyactiv-G de 194 hp. Diseño Kodo, Bose de 12 bocinas y Head-Up Display.',
  },
  {
    nombre: 'Volkswagen Golf 2022',
    marca: 'Volkswagen', modelo: 'Golf', anio: 2022,
    color: 'Azul', precio: 440000, kilometraje: 14000,
    tipo: 'hatchback', transmision: 'automatica', combustible: 'gasolina',
    puertas: 4, numero_serie: 'VIN-VG2022-024', estatus: 'disponible', disponible: true,
    imagen_url: 'https://images.unsplash.com/photo-1471444928062-babd5d17660e?w=800',
    descripcion: 'Volkswagen Golf Highline con motor TSI 1.4T de 150 hp. Digital Cockpit, Climatronic bizona y faros LED IQ.Light.',
  },
  {
    nombre: 'Suzuki Swift 2023',
    marca: 'Suzuki', modelo: 'Swift', anio: 2023,
    color: 'Amarillo', precio: 265000, kilometraje: 1500,
    tipo: 'hatchback', transmision: 'manual', combustible: 'gasolina',
    puertas: 4, numero_serie: 'VIN-SS2023-025', estatus: 'disponible', disponible: true,
    imagen_url: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800',
    descripcion: 'Suzuki Swift Sport Boosterjet con turbo 1.4L de 140 hp. Solo 970 kg de peso para una experiencia de manejo deportiva y ágil.',
  },

  // ── VANS ─────────────────────────────────────────────────
  {
    nombre: 'Nissan Urvan 2022',
    marca: 'Nissan', modelo: 'Urvan', anio: 2022,
    color: 'Blanco', precio: 550000, kilometraje: 30000,
    tipo: 'van', transmision: 'manual', combustible: 'diesel',
    puertas: 4, numero_serie: 'VIN-NU2022-026', estatus: 'disponible', disponible: true,
    imagen_url: 'https://images.unsplash.com/photo-1532581140115-3e355d1ed1de?w=800',
    descripcion: 'Nissan Urvan Panel Amplia con capacidad para 15 pasajeros o carga. Motor diésel 2.5L de 129 hp. Ideal para transporte comercial.',
  },

  // ── VENDIDOS (para variedad de estatus) ──────────────────
  {
    nombre: 'Honda HR-V 2021',
    marca: 'Honda', modelo: 'HR-V', anio: 2021,
    color: 'Azul', precio: 360000, kilometraje: 35000,
    tipo: 'suv', transmision: 'automatica', combustible: 'gasolina',
    puertas: 4, numero_serie: 'VIN-HH2021-027', estatus: 'vendido', disponible: false,
    imagen_url: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800',
    descripcion: 'Honda HR-V Prime. SUV subcompacta con motor 1.8L i-VTEC de 141 hp. Magic Seat y gran espacio de carga.',
  },
  {
    nombre: 'Ford Escape 2020',
    marca: 'Ford', modelo: 'Escape', anio: 2020,
    color: 'Gris', precio: 380000, kilometraje: 45000,
    tipo: 'suv', transmision: 'automatica', combustible: 'gasolina',
    puertas: 4, numero_serie: 'VIN-FE2020-028', estatus: 'vendido', disponible: false,
    imagen_url: 'https://images.unsplash.com/photo-1551830820-330a71b99659?w=800',
    descripcion: 'Ford Escape Titanium con motor EcoBoost 2.0L de 250 hp. AWD inteligente, Co-Pilot360 y SYNC 3 con navegación.',
  },
  {
    nombre: 'Kia Rio 2021',
    marca: 'Kia', modelo: 'Rio', anio: 2021,
    color: 'Plata', precio: 245000, kilometraje: 40000,
    tipo: 'sedan', transmision: 'automatica', combustible: 'gasolina',
    puertas: 4, numero_serie: 'VIN-KR2021-029', estatus: 'vendido', disponible: false,
    imagen_url: 'https://images.unsplash.com/photo-1609856878074-cf31b21e42c9?w=800',
    descripcion: 'Kia Rio LX+ con motor 1.6L de 120 hp. Económico en combustible y con garantía de 7 años / 150,000 km.',
  },
  {
    nombre: 'Volkswagen Tiguan 2023',
    marca: 'Volkswagen', modelo: 'Tiguan', anio: 2023,
    color: 'Blanco', precio: 560000, kilometraje: 9000,
    tipo: 'suv', transmision: 'automatica', combustible: 'gasolina',
    puertas: 4, numero_serie: 'VIN-VT2023-030', estatus: 'disponible', disponible: true,
    imagen_url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    descripcion: 'Volkswagen Tiguan R-Line con motor TSI 2.0T de 228 hp. Techo panorámico, Digital Cockpit Pro y 3 filas de asientos.',
  },
];

async function seed() {
  console.log('🚗 Insertando 20 nuevos vehículos...\n');

  for (const v of vehiculos) {
    const { imagen_url, descripcion, ...data } = v;

    try {
      // Crear vehículo
      const res = await fetch(`${strapi_url}/api/vehiculos`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data: { ...data, descripcion } }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.log(`  ✗ ${v.nombre}: ${err}`);
        continue;
      }

      const json = await res.json();
      const vehiculoId = json.data?.id;
      const docId = json.data?.documentId;
      console.log(`  ✓ ${v.nombre} (ID: ${vehiculoId})`);

      // Publicar
      if (docId) {
        await fetch(`${strapi_url}/api/vehiculos/${docId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ data: { ...data, descripcion } }),
        });
      }

      // Subir imagen desde Unsplash
      if (imagen_url && vehiculoId) {
        try {
          const imgRes = await fetch(imagen_url);
          const imgBuffer = await imgRes.arrayBuffer();
          const blob = new Blob([imgBuffer], { type: 'image/jpeg' });

          const formData = new FormData();
          const filename = `${v.marca.toLowerCase()}-${v.modelo.toLowerCase().replace(/\s/g, '-')}-${v.anio}.jpg`;
          formData.append('files', blob, filename);
          formData.append('ref', 'api::vehiculo.vehiculo');
          formData.append('refId', String(vehiculoId));
          formData.append('field', 'Imagen');

          const uploadHeaders = {};
          if (TOKEN) uploadHeaders['Authorization'] = `Bearer ${TOKEN}`;

          const uploadRes = await fetch(`${strapi_url}/api/upload`, {
            method: 'POST',
            headers: uploadHeaders,
            body: formData,
          });

          if (uploadRes.ok) {
            console.log(`    📷 Imagen subida: ${filename}`);
          } else {
            console.log(`    ⚠ Error subiendo imagen`);
          }
        } catch (imgErr) {
          console.log(`    ⚠ Error descargando imagen: ${imgErr.message}`);
        }
      }
    } catch (e) {
      console.log(`  ✗ ${v.nombre}: ${e.message}`);
    }
  }

  console.log('\n✅ Seed completado');
}

seed();
