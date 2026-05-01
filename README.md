# 🚗 QuickStop: PWA de Búsqueda y Gestión de Parkings en Tiempo Real

Quickstop es una **Aplicación Web Progresiva (PWA)** desarrollada como Proyecto de Fin de Grado de Ingeniería en Software en la Universidad Complutense de Madrid. Ha sido diseñada bajo el modelo de economía colaborativa. Permite a los usuarios **buscar plazas libres en tiempo real mediante cartografía 3D**, **gestionar reservas**, y a los propietarios **monetizar sus espacios vacíos**. 

Todo el desarrollo se ha estructurado bajo una arquitectura moderna, escalable y centrada en el usuario, garantizando el cumplimiento estricto de la **normativa europea de accesibilidad (EAA 2025)**, siendo esta la principal prioridad en el desarrollo, brindar una aplicación accesible.

## 🧱 Arquitectura General
| Capa | Tecnología Principal | Herramientas Adicionales |
|------|----------------------|--------------------------|
| **Frontend** | React + Vite (PWA) | Tailwind CSS, Mapbox GL JS (`react-map-gl`), |
| **Backend** | Spring Boot 3 | REST API, Spring Security (JWT) |
| **Base de Datos** | PostgreSQL | PostGIS (Consultas espaciales), Hibernate Spatial |


## 📂 Estructura del Monorepo
El proyecto utiliza `npm workspaces` para gestionar tanto el cliente como la API desde un único repositorio.
```
root/
├── package.json
├── app/           ← Frontend (React + Vite + PWA)
├    ├── public/                     # Archivos estáticos (íconos, manifest.json, assets)
│    │   ├── manifest.webmanifest    # Requerido para PWA
│    │   └── icons/                  # Íconos de aplicación
|    |
├    └── src/
│         ├── assets/                 # Imágenes, fuentes (no dinámicas)
│         ├── components/             # Componentes de UI reutilizables (Modales, Ilustraciones)
│         ├── features/               # Servicios y componentes agrupadas por dominio (Auth, Parking, Owner, Driver) 
│         ├── layouts/                # # Estructuras maestras (ej. AuthLayout asimétrico, AppLayout)
│         ├── pages/                  # # Vistas ruteables (MapPage con renderizado 3D, Login, Register)
│         ├── services/               # Lógica global no ligada a un dominio específico
│         │   ├── apiClient.js        # Instancia de Axios para backend (a traves del proxy de Vite)
│         │   └── mapService.js       # Conexion con Mapbox (mapa)
│         ├── utils/                  # Configuraciones (ej. layers.js para Mapbox)
│         ├── context/                # Contextos globales de React (ej: AuthContext)
│         └── main.jsx                # Punto de entrada de la aplicación (Router, Providers)
│         
│         
├── api/src/main/java/es/quickstop         ← Backend (Spring Boot + PostGIS)
│    ├── common/                  # Elementos generales o reutilizables          
│    ├── config/                  # Archivos de configuración de Spring (CORS)
│    ├── auth/                   # DOMINIO: Autenticación y Usuarios
│    │   ├── dto/                 # RegisterRequestDTO, LoginRequestDTO, AuthResponseDTO
│    │   └──  Auth*.java          # Controller, Service y Mapper (Lógica de registro/login)
│    ├── parking/                # DOMINIO: Búsqueda y Gestión de Parkings
│    │   ├── controller.java      # Endpoints (GET /parkings, POST /parkings)
│    │   ├── service.java         # Lógica de negocio con PostGIS
│    │   ├── mapper.java          # Transformación de DTOs a Entities
│    │   ├── repository.java      # Acceso a base de datos
│    │   ├── model/               # Entidades(@Entity con PostGIS Geometry)
│    │   └── dto/                 # ParkingDTO, ParkingCreationRequest
│    │
│    ├── user/                   # DOMINIO: Búsqueda y Gestión de Users
│    │   ├── controller.java      # Endpoints (GET /users, POST /users)
│    │   ├── service.java         # Lógica de negocio con PostGIS
│    │   ├── mapper.java          # Transformación de DTOs a Entities
│    │   ├── repository.java      # Acceso a base de datos
│    │   ├── model/               # Entidades (@Entity con PostGIS Geometry)
│    │   └── dto/                 # UserDTO, UserCreationRequest
│    │
│    └── reservation/             # DOMINIO: Busqueda y Gestión de reservas
│        ├── controller.java      # Endpoints (GET /users, POST /users)
│        ├── service.java         # Lógica de negocio con PostGIS
│        ├── mapper.java          # Transformación de DTOs a Entities
│        ├── repository.java      # Acceso a base de datos
│        ├── model/               # Entidades (@Entity con PostGIS Geometry)
│        └── dto/                 # ReservationDTO
│
└── README.md
    
```

## 🎯 Funcionalidades Principales Implementadas

### 👨‍✈️ Perfil Conductor
*   **Cartografía 3D Interactiva:** Visualización del entorno urbano con volumetría de edificios usando Mapbox GL.
*   **Geolocalización In-App:** Búsqueda dinámica de plazas en un radio cercano (`ST_DWithin`).
*   **Agrupación de Datos (Clustering):** Manejo eficiente de múltiples marcadores en el mapa para evitar saturación visual.
*   **Reservas en Tiempo Real:** Bloqueo de plazas y actualización de disponibilidad instantánea.

### 🏢 Perfil Propietario 
*   **Gestión de Inventario:** Publicación ágil de plazas individuales o múltiples en una misma ubicación (autocompletado contextual).
*   **Geoposicion de Control:** Visualización de plazas activas y ofertas de otros usuarios.

### ⚙️ Características Transversales
*   **Experiencia PWA:** Instalable en dispositivos móviles, cacheo de recursos (Service Workers) y diseño "Mobile-First".
*   **Diseño Accesible (EAA 2025):** Contraste optimizado, navegación por teclado y estructura semántica.
*   **Autenticación Segura:** Sistema de login/registro diferenciado por roles con diseño asimétrico de doble panel y avatares vectoriales.

---
## 🗃️ Modelo de Base de Datos Espacial

QuickStop utiliza **PostgreSQL con la extensión PostGIS** para resolver cálculos de distancias directamente en el motor de base de datos, optimizando el rendimiento.

*   **Tablas Principales:** `user`, `owner`, `driver`, `parking`, `reservation`.
*   **Geometría:** Uso del tipo `Point` con el sistema de referencia de coordenadas **SRID 4326** (WGS 84).
*   **Índices:** Implementación de índices **GiST** en columnas espaciales para acelerar las búsquedas por radio.

---


## ♿ Accesibilidad Verificada (EAA 2025)
- WCAG 2.2 AA
- Navegación por teclado
- Roles ARIA
- Contraste adecuado
- Focus visible
- Formularios accesibles
- Aria-live para avisos
- Testing con axe, Lighthouse
---

## 🚀 Futuro
- Chat usuarios
- Pagos
- Filtros avanzados
- Panel admin
- Push notifications
---
## ⚙️ Despliegue y Ejecución

Para levantar el entorno de desarrollo local, asegúrate de configurar las variables de entorno:
1. Crea un archivo `.env` en la raíz del proyecto basándote en el entorno proporcionado (incluye `VITE_API_MAP_BOX_KEY` y credenciales de BD).
2. Asegúrate de tener **Docker Desktop** (para Windows/Mac) o el servicio Docker (Linux) en ejecución.

**Instalación de dependencias:**
```bash
git clone https://github.com/alex-boni/QuickStop.git
cd QuickStop
npm install
```
**Ejecución en entorno Linux/macOS:**
```bash
npm run dev
```
**Ejecución en entorno Windows:**
```bash
npm run dev:windows
```
---


## 🗺️ Roadmap
Hitos Completados
1. Definición de casos de uso y modelado PostGIS.
2. Configuración de arquitectura Monorepo.
3. Implementación de funciones principales.
3. Comprobación de Accesibilidad.


---
**Autor:**  
- [Alex Guillermo Bonilla Taco – Ingeniero de Software](https://github.com/alex-boni)
- [Airam Martín Soto - Ingeniero de Software](https://github.com/airamsoto)
