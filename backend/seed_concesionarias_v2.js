// backend/seed_concesionarias_v2.js
// Ejecutar: cd backend && node seed_concesionarias_v2.js

const strapi_url = 'http://localhost:1337';
const TOKEN = '';

const headers = {
  'Content-Type': 'application/json',
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

const concesionarias = [
  {
    nombre: 'AutoPremium Tapachula',
    ciudad: 'Tapachula',
    Estado: 'Chiapas',
    direccion: 'Blvd. Díaz Ordaz 450, Col. Centro',
    telefono: '962 625 8900',
    contacto: 'ventas@autopremiumtapachula.com',
  },
  {
    nombre: 'Elite Motors San Cristóbal',
    ciudad: 'San Cristóbal de las Casas',
    Estado: 'Chiapas',
    direccion: 'Periférico Sur 1200, Barrio de Guadalupe',
    telefono: '967 674 3200',
    contacto: 'info@elitemotorssancris.com',
  },
  {
    nombre: 'Tuxcar Comitán',
    ciudad: 'Comitán de Domínguez',
    Estado: 'Chiapas',
    direccion: 'Av. Central Oriente 890, Col. Centro',
    telefono: '963 632 1100',
    contacto: 'ventas@tuxcarcomitan.com',
  },
];

async function seed() {
  console.log('🏢 Insertando 3 nuevas concesionarias...\n');

  for (const c of concesionarias) {
    try {
      const res = await fetch(`${strapi_url}/api/concesionarias`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data: c }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.log(`  ✗ ${c.nombre}: ${err}`);
        continue;
      }

      const json = await res.json();
      console.log(`  ✓ ${c.nombre} — ${c.ciudad} (ID: ${json.data?.id})`);

      // Publicar
      if (json.data?.documentId) {
        await fetch(`${strapi_url}/api/concesionarias/${json.data.documentId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ data: c }),
        });
      }
    } catch (e) {
      console.log(`  ✗ ${c.nombre}: ${e.message}`);
    }
  }

  console.log('\n✅ Concesionarias creadas');
}

seed();
