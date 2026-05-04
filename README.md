# 🚗 Tuxcar

**Sistema Web de Gestión y Comercialización de Vehículos Multimarcas**

Plataforma web fullstack para la gestión integral de una red de concesionarias automotrices en el estado de Chiapas. Permite la administración de inventario vehicular, refacciones, cotizaciones con cálculo financiero, gestión de leads y control de empleados con sistema de roles diferenciados.

> Proyecto Final — Universidad Autónoma de Chiapas (UNACH)  
> Facultad de Contaduría y Administración C-I  
> Licenciatura en Ingeniería en Desarrollo y Tecnologías de Software  
> 8° Semestre · Grupo N · Equipo 4  
> Materia: Cómputo Distribuido

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Stack Tecnológico](#-stack-tecnológico)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Variables de Entorno](#-variables-de-entorno)
- [Ejecución](#-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Base de Datos](#-base-de-datos)
- [Sistema de Roles](#-sistema-de-roles)
- [Funcionalidades](#-funcionalidades)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Equipo](#-equipo)

---

## ✨ Características

### Portal del Cliente
- Catálogo de vehículos con filtros avanzados (tipo, marca, precio, año, km, transmisión, combustible)
- Buscador en tiempo real por nombre, marca, modelo o color
- Comparador de hasta 3 vehículos con tabla de especificaciones
- Calculadora de financiamiento con amortización francesa
- Generación de cotizaciones en PDF con folio único
- Catálogo de refacciones con indicador de stock
- Formulario de contacto con pre-llenado automático desde Clerk
- Página de concesionarias con mapa y filtro por ciudad
- Autenticación progresiva (navegación libre, login solo para cotizar)

### Dashboard Administrativo
- Panel de estadísticas con KPIs (inventario, cotizaciones, leads, valor)
- Distribución por marca y tipo de vehículo con barras visuales
- Gestión de vehículos (CRUD completo para Super Admin)
- Gestión de refacciones (CRUD completo para Super Admin)
- Gestión de empleados (solo Super Admin)
- Visualización de cotizaciones recibidas
- Visualización de leads/contactos
- Exportación de datos a CSV/Excel
- Sistema de notificaciones (últimos 7 días)
- Sistema de roles: Super Admin vs Empleado

### Diseño
- Tema oscuro cinematográfico estilo Cupra
- Paleta: zinc-950, amber-600 (cobre/bronce), emerald para éxito
- Diseño responsive (desktop y móvil)
- Iconografía consistente con Lucide Icons
- Sin emojis — solo iconos profesionales

---

## 🏗 Arquitectura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   FRONTEND      │────▶│   BACKEND       │────▶│  BASE DE DATOS  │
│   Next.js 16    │ API │   Strapi v5     │ SQL │  Supabase       │
│   React 19      │ REST│   Node.js       │     │  PostgreSQL 15  │
│   Tailwind v4   │     │   Headless CMS  │     │  Cloud          │
│                 │     │                 │     │                 │
└────────┬────────┘     └─────────────────┘     └─────────────────┘
         │
         │ IDaaS
┌────────▼────────┐
│                 │
│   AUTH          │
│   Clerk v7      │
│   SOC 2 / GDPR │
│                 │
└─────────────────┘
```

**Separación de responsabilidades (SoC):**
- **Clerk** → Identidad y autenticación (correos, contraseñas, sesiones JWT)
- **Strapi** → Lógica de negocio y APIs REST (Content Types, Media Library)
- **Supabase** → Persistencia de datos (PostgreSQL distribuido en la nube)
- **Next.js** → Presentación e interfaz de usuario (SSR, App Router)

---

## 🛠 Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | Next.js (App Router + Turbopack) | 16.2.3 |
| UI Library | React | 19.2.4 |
| Estilos | Tailwind CSS | v4 |
| Componentes | shadcn/ui + Lucide Icons | — |
| Auth | Clerk | v7.2.2 |
| Backend | Strapi (Headless CMS) | v5 |
| Runtime | Node.js | 20+ |
| Base de datos | Supabase (PostgreSQL) | 15 |
| PDF | jsPDF + jspdf-autotable | — |
| Lenguaje | TypeScript | 5.x |

---

## 📦 Requisitos Previos

- **Node.js** v20 o superior
- **npm** v10 o superior
- **Git**
- Cuenta en [Clerk](https://clerk.com) (plan gratuito)
- Cuenta en [Supabase](https://supabase.com) (plan gratuito)

---

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Kleingoes/Tuxcar.git
cd Tuxcar

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

---

## 🔐 Variables de Entorno

### Backend (`backend/.env`)
```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=<generadas-por-strapi>
API_TOKEN_SALT=<generada>
ADMIN_JWT_SECRET=<generada>
TRANSFER_TOKEN_SALT=<generada>
JWT_SECRET=<generada>
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://<usuario>:<password>@<host>:<port>/<db>
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:1337
NEXT_PUBLIC_API_TOKEN=<tu-api-token-de-strapi>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/
```

---

## ▶ Ejecución

Abrir **dos terminales**:

```bash
# Terminal 1 — Backend (Strapi)
cd backend
npm run develop
# → http://localhost:1337/admin

# Terminal 2 — Frontend (Next.js)
cd frontend
npm run dev
# → http://localhost:3000
```

---

## 📁 Estructura del Proyecto

```
Tuxcar/
├── backend/                    # Strapi v5
│   ├── src/
│   │   └── api/               # Content Types (11 colecciones)
│   ├── public/uploads/        # Imágenes de vehículos
│   ├── seed.js                # Seed datos iniciales
│   ├── seed_vehiculos_v2.js   # Seed vehículos expandido
│   └── seed_concesionarias_v2.js
│
├── frontend/                   # Next.js 16
│   ├── app/
│   │   ├── page.tsx           # Home (hero + catálogo destacado)
│   │   ├── vehiculos/         # Catálogo + filtros + comparador
│   │   ├── refacciones/       # Catálogo de refacciones
│   │   ├── servicio/          # Servicios del taller
│   │   ├── financiamiento/    # Info de crédito + bancos
│   │   ├── concesionarias/    # Mapa + cards de sucursales
│   │   ├── contacto/          # Formulario → Lead en Strapi
│   │   ├── favoritos/         # Placeholder
│   │   ├── (auth)/            # Sign-in / Sign-up (Clerk)
│   │   └── (routes)/dashboard/ # Panel admin con roles
│   ├── components/            # Componentes reutilizables
│   ├── lib/
│   │   ├── admin.ts           # Configuración de roles
│   │   ├── api-extended.ts    # Funciones API públicas
│   │   ├── api-admin.ts       # Funciones API admin (CRUD)
│   │   ├── api-empleados.ts   # Funciones API empleados
│   │   ├── export-excel.ts    # Exportación CSV
│   │   ├── pdf-generator.ts   # Generador de PDF
│   │   └── types.ts           # Tipos TypeScript
│   └── middleware.ts          # Clerk middleware
│
└── README.md
```

---

## 🗄 Base de Datos

### Colecciones en Strapi (11 Content Types)

| Colección | Campos principales | Relaciones |
|-----------|-------------------|------------|
| **Vehiculo** | nombre, marca, modelo, año, precio, tipo, transmisión, combustible, km, estatus, Imagen | → Concesionaria, ← Venta, ← Cotización |
| **Concesionaria** | nombre, ciudad, Estado, dirección, teléfono | ← Vehiculo, ← Empleado, ← Refacción |
| **Cliente** | nombre, correo, teléfono, dirección, tipo | ← Venta, ← Cotización |
| **Cotización** | fecha, vigencia, total, descuento, estatus, notas | → Cliente, → Vehiculo, → Empleado |
| **Venta** | fecha, total, estatus, método_pago, cantidad | → Cliente, → Vehiculo |
| **Empleado** | nombre, puesto, teléfono, correo, activo | → Concesionaria |
| **Refacción** | nombre, precio, stock, categoría, no_parte | → Concesionaria |
| **Lead** | nombre, correo, teléfono, mensaje, estatus | — |
| **Cita** | fecha, hora, tipo, estatus | → Cliente, → Concesionaria |
| **Financiamiento** | monto, plazo, tasa, mensualidad | → Cliente, → Vehiculo |
| **OrdenServicio** | fecha, descripción, costo, estatus | → Cliente, → Vehiculo |

### Distribución de datos
- **29 vehículos** distribuidos en 6 concesionarias
- **6 concesionarias** en 4 ciudades de Chiapas
- Relaciones vía tablas intermedias `_lnk` (Strapi v5)

---

## 👥 Sistema de Roles

| Rol | Correo | Permisos |
|-----|--------|----------|
| **Super Admin** | `` | CRUD completo en vehículos, refacciones y empleados. Eliminar cotizaciones y leads. Acceso a estadísticas y exportación. |
| **Empleado** | `` | Ver inventario, crear vehículos y refacciones. Ver cotizaciones y leads. Sin editar, eliminar ni gestionar empleados. |
| **Cliente** | Cualquier otro correo | Navegar catálogo, solicitar cotizaciones, calculadora financiera, generar PDF, formulario de contacto. |

La autenticación se maneja con **Clerk (IDaaS)** y los roles se verifican en el frontend (`lib/admin.ts`). Staff es redirigido automáticamente al dashboard al iniciar sesión.

---

## 🔧 Funcionalidades Detalladas

### Cotización con Cálculo Financiero
1. Cliente selecciona vehículo disponible
2. Inicia sesión con Clerk (autenticación progresiva)
3. Calculadora: enganche (slider), plazo (12-60 meses), tasa anual (5-25%)
4. Fórmula de amortización francesa: `M = P × [r(1+r)^n] / [(1+r)^n - 1]`
5. Envío a Strapi → busca/crea Cliente → crea Cotización
6. Genera PDF con jsPDF (folio COT-XXXXXXXX)

### Comparador de Vehículos
- Selección de hasta 3 vehículos con buscador modal
- Tabla comparativa de 10 especificaciones
- Indicador visual del mejor valor (menor precio, más nuevo, menos km)

### Exportación de Datos
- CSV compatible con Excel (BOM UTF-8)
- Disponible para: vehículos, cotizaciones, leads, refacciones

---

## 📸 Capturas de Pantalla

> Agregar capturas del sistema en funcionamiento

---

## 👨‍💻 Equipo

| Nombre | Matrícula |
|--------|-----------|
| Ballinas Moreno Alberto | 100000350 |
| Lopez Gomez Apolinar Klein | 100004763 |
| Perez Vicente Carlos Isaías | A210272 |

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos para la Universidad Autónoma de Chiapas (UNACH).

---

<p align="center">
  <strong>Tuxcar</strong> · Concesionaria Multimarca · Chiapas, México · 2026
</p>