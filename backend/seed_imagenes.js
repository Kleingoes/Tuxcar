// seed_imagenes.js - Compatible con Strapi v5 (usa documentId)
// Ejecutar con: node seed_imagenes.js

const BASE_URL = 'http://localhost:1337';
const API_TOKEN = '39c9e973e5781028caa096b8fee9847ba2ab1e58fd5c1e51bacd4467522882e626a308c37feceddec66ae5e0736b972cedeb811eccc0343b3dc4472d2c83f2fc2a84a08682c5e49e2f67535a2af1bf94c4bfe820728fe170637adceb8bc42e472eb8b03ab06a29e8f09b59340bac1f6cc03045757f4030f5b2118be3791044c2';

const IMAGENES = {
  'Nissan Sentra 2022':     'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
  'Toyota Hilux 2023':      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'Volkswagen Jetta 2021':  'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800',
  'Chevrolet Aveo 2020':    'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
  'Ford Ranger 2023':       'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
  'Honda CR-V 2022':        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
  'Mazda 3 2023':           'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
  'Kia Sportage 2022':      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
  'Toyota Corolla 2019':    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
  'Nissan NP300 2021':      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
};

async function getVehiculos() {
  const res = await fetch(`${BASE_URL}/api/vehiculos?pagination[limit]=20`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` }
  });
  const json = await res.json();
  return json.data ?? [];
}

async function subirImagenDesdeUrl(url, nombreArchivo) {
  console.log(`   📥 Descargando: ${nombreArchivo}...`);
  const imgRes = await fetch(url);
  if (!imgRes.ok) throw new Error(`No se pudo descargar: ${url}`);
  const blob = await imgRes.blob();

  const form = new FormData();
  form.append('files', blob, `${nombreArchivo}.jpg`);

  const uploadRes = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_TOKEN}` },
    body: form
  });

  const uploadJson = await uploadRes.json();
  if (!Array.isArray(uploadJson) || !uploadJson[0]?.id) {
    console.error(`   ❌ Error subiendo imagen:`, JSON.stringify(uploadJson));
    return null;
  }
  return uploadJson[0].id;
}

async function actualizarImagenVehiculo(documentId, imagenId) {
  // Strapi v5: usar documentId en la URL, no el id numérico
  const res = await fetch(`${BASE_URL}/api/vehiculos/${documentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`
    },
    body: JSON.stringify({ data: { Imagen: imagenId } })
  });
  const json = await res.json();
  if (!json.data) {
    console.error(`   ❌ Error al vincular (status ${res.status}):`, JSON.stringify(json));
    return null;
  }
  return json.data;
}

async function seed() {
  if (API_TOKEN === 'PON_AQUÍ_TU_TOKEN') {
    console.error('❌ Configura tu API_TOKEN primero.');
    process.exit(1);
  }

  console.log('🖼️  Iniciando subida de imágenes a Strapi v5...\n');

  const vehiculos = await getVehiculos();
  if (!vehiculos.length) {
    console.error('❌ No hay vehículos. Corre seed.js primero.');
    process.exit(1);
  }

  // Mostrar estructura del primer vehículo para diagnóstico
  const primer = vehiculos[0];
  console.log(`ℹ️  Estructura detectada:`);
  console.log(`   id         : ${primer.id}`);
  console.log(`   documentId : ${primer.documentId}`);
  console.log(`   nombre     : ${primer.nombre ?? primer.attributes?.nombre}`);
  console.log('');

  let exitosos = 0;
  let fallidos = 0;

  for (const vehiculo of vehiculos) {
    // Strapi v5: campos directamente en el objeto
    // Strapi v4: campos en vehiculo.attributes
    const nombre     = vehiculo.nombre ?? vehiculo.attributes?.nombre;
    const documentId = vehiculo.documentId ?? vehiculo.id;

    const urlImagen = IMAGENES[nombre];
    if (!urlImagen) {
      console.log(`   ⚠️  Sin imagen definida para: ${nombre}`);
      continue;
    }

    try {
      const imagenId = await subirImagenDesdeUrl(
        urlImagen,
        nombre.toLowerCase().replace(/\s+/g, '-')
      );
      if (!imagenId) { fallidos++; continue; }

      const actualizado = await actualizarImagenVehiculo(documentId, imagenId);
      if (actualizado) {
        console.log(`   ✅ ${nombre} (documentId: ${documentId})`);
        exitosos++;
      } else {
        fallidos++;
      }

      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.error(`   ❌ Error con ${nombre}:`, err.message);
      fallidos++;
    }
  }

  console.log('\n─────────────────────────────────────────');
  console.log(`   ✅ Vinculadas exitosamente : ${exitosos}`);
  console.log(`   ❌ Fallidas               : ${fallidos}`);
  console.log('─────────────────────────────────────────');
  console.log('🚗 Revisa en Strapi Admin → Content Manager → Vehiculo');
}

seed().catch(console.error);
