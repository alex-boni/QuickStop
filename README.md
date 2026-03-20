# 🚗 PWA de Búsqueda y Gestión de Parkings en Tiempo Real

Este proyecto es una **Aplicación Web Progresiva (PWA)** que permite a los usuarios **buscar parkings cercanos**, **ver disponibilidad en tiempo real**, **realizar reservas**, **compartir disponibilidad de tus parkings** y **rebicir cobros y generar pagos**.  
Todo ello cumpliendo con la **normativa europea de accesibilidad (EAA 2025)** y con una arquitectura moderna, escalable y profesional.

## 🧱 Arquitectura General
| Capa | Tecnología |
|------|-------------|
| Frontend | React + Vite (PWA) |
| Backend | Spring Boot (REST + Lombok y decoradores + JPA) |
| Base de datos | PostgreSQL + PostGIS |
| Comunicación | REST (JSON) |
| Monorepo | npm workspaces |

## 📂 Estructura del Monorepo
```
root/
├── package.json
├── app/           ← Frontend (React + Vite + PWA)
├    ├── public/                     # Archivos estáticos (íconos, manifest.json, assets)
│    │   ├── manifest.webmanifest    # Requerido para PWA
│    │   └── icons/                  # Íconos de aplicación
|    |
├    ├── src/
│         ├── assets/                 # Imágenes, fuentes (no dinámicas)
│         │   └── logo.svg
│         │
│         ├── components/             # Componentes de UI reutilizables (Botón, Input, Tarjeta) y que comparten las demas features
│         │   └── shared/             # (Opcional) Elementos muy genéricos
│         │       ├── Button.jsx
│         │       └── Card.jsx
│         │
│         ├── features/               # El núcleo: Lógica y componentes agrupados por dominio
│         │   ├── users/               # Gestión de Login, Registro, Logout, Contraseña
│         │   │   ├── components/     # Componentes específicos de Auth (ej: LoginForm)
│         │   │   ├── hooks/          # Hooks de Auth (ej: useAuth)
│         │   │   └── services/       # Lógica de la API de Auth
│         │   │
│         │   ├── parking/            # Lógica y UI para la búsqueda y gestión de parkings
│         │   │   ├── components/     # ParkingsMap, SearchBarOverlay, ParkingDetailsCard
│         │   │   ├── hooks/          
│         │   │   └── services/       # Conexión con la API de Parkings (REST, WebSockets)
│         │   │
│         │   ├── owner/             
│         │   │   ├── components/     
│         │   │   ├── hooks/          
│         │   │   └── services/      
│         │   ├── driver/            
│         │   │   ├── components/     
│         │   │   ├── hooks/          
│         │   │   └── services/        Parkings (REST, WebSockets)
│         │   └── reservations/       # Gestión de reservas, historial, etc.
│         │   │   ├── components/     
│         │   │   ├── hooks/          
│         │   │   └── services/       
│         │
│         ├── layouts/                # Componentes estructurales de alto nivel
│         │   ├── AppLayout.jsx       # El componente principal que definimos (Header, Main, Footer)
│         │   └── AuthLayout.jsx      # Layout para Login/Registro (centrado, sin nav principal)
│         │
│         ├── pages/                  # Componentes que se mapean directamente a rutas (pages)
│         │   ├── HomePage.jsx        # Muestra el AppLayout con el ParkingMap
│         │   ├── LoginPage.jsx       # Usa el AuthLayout con el LoginForm
│         │   └── RegisterPage.jsx    # Usa el AuthLayout con el RegisterForm
│         │
│         ├── services/               # Lógica global no ligada a un dominio específico
│         │   ├── apiClient.js        # Instancia de Axios o Fetch configurada (para el proxy de Vite)
│         │   └── msWWorker.js        # Configuración de MSW para mocking
│         │
│         ├── hooks/                  # Hooks reutilizables a nivel global (ej: useLocalStorage)
│         │
│         ├── context/                # Contextos globales de React (ej: AuthProvider)
│         │
│         ├── styles/                 # Archivos CSS globales y configuración de Tailwind
│         │   └── index.css           # Punto de entrada de Tailwind
│         │
│         └── main.jsx                # Punto de entrada de la aplicación (Router, Providers)
│         
│         
├── api/src/main/java/es/quickstop         ← Backend (Spring Boot + PostGIS)
│    ├── common/                  # Elementos generales o reutilizables
│    │   ├── dto/                 # DTOs globales (ej. ErrorResponse, TokenResponse)
│    │   ├── exception/           # Excepciones personalizadas (ej. ResourceNotFoundException)
│    │   └── util/                
│    │
│    ├── config/                  # Archivos de configuración de Spring
│    │   ├── SecurityConfig.java  # Configuración de Spring Security (JWT, CORS)
│    │   └── WebSocketConfig.java # Configuración de WebSockets STOMP
│    │
│    ├── auth/                    # DOMINIO: Autenticación y Usuarios
│    │   ├── controller/          # AuthController (Login, Register)
│    │   ├── service/             # AuthService.java (Lógica de registro/login, encriptación)
│    │   ├── repository/          # UserRepository (Spring Data JPA)
│    │   ├── model/               # User.java (@Entity), Role.java (Enum)
│    │   └── dto/                 # RegisterRequestDTO, LoginRequestDTO, AuthResponseDTO
│    │
│    ├── parking/                 # DOMINIO: Búsqueda y Gestión de Parkings
│    │   ├── controller/          # ParkingController (GET /parkings, POST /parkings)
│    │   ├── service/             # ParkingService (Lógica de búsqueda con PostGIS)
│    │   ├── repository/          # ParkingRepository, ParkingSpecification
│    │   ├── model/               # Parking.java (@Entity con PostGIS Geometry)
│    │   └── dto/                 # ParkingDTO, ParkingCreationRequest
│    │
│    ├── user/                 # DOMINIO: Búsqueda y Gestión de Users
│    │   ├── controller/          # UserController (GET /users, POST /users)
│    │   ├── service/             # UserService (Lógica de búsqueda con PostGIS)
│    │   ├── repository/          # UserRepository, UserSpecification
│    │   ├── model/               # User.java (@Entity con PostGIS Geometry)
│    │   └── dto/                 # UserDTO, UserCreationRequest
│    │
│    ├── owner/                 # DOMINIO: Búsqueda y Gestión de Owners
│    │   ├── controller/          # OwnerController (GET /owners, POST /owners)
│    │   ├── service/             # OwnerService (Lógica de búsqueda con PostGIS)
│    │   ├── repository/          # OwnerRepository, OwnerSpecification
│    │   ├── model/               # Owner.java (@Entity con PostGIS Geometry)
│    │   └── dto/                 # OwnerDTO, OwnerCreationRequest
│    │
│    ├── driver/                 # DOMINIO: Búsqueda y Gestión de Drivers
│    │   ├── controller/          # DriverController (GET /drivers, POST /drivers)
│    │   ├── service/             # DriverService (Lógica de búsqueda con PostGIS)
│    │   ├── repository/          # DriverRepository, DriverSpecification
│    │   ├── model/               # Driver.java (@Entity con PostGIS Geometry)
│    │   └── dto/                 # DriverDTO, DriverCreationRequest
│    │
│    └── reservation/             # DOMINIO: Reservas y Tiempo Real
│        ├── controller/          # ReservationController (CRUD)
│        ├── service/             # ReservationService (Lógica de booking, llamadas a WebSocket)
│        ├── repository/          # ReservationRepository
│        └── model/               # Reservation.java
│        └── dto/                 # ReservationDTO
└── README.md
│    
```

## 🎯 Objetivo del Proyecto
Construir una **plataforma estilo “Mini Uber/Cabify de parkings”** que permita:
- Buscar parkings cercanos en un mapa interactivo
- Consultar disponibilidad y precio en tiempo real
- Reservar plazas
- Recibir notificaciones en tiempo real (WebSockets / Push)
- Interactuar con empresas (chat opcional)
- Funcionar offline (PWA)
- Cumplir accesibilidad UE 2025

## 🖥 Frontend – React + Vite (PWA)
- SPA modular (arquitectura por features)
- PWA (manifest, service worker, offline-first, instalación)
- WebSockets para tiempo real
- Mapas (Leaflet / MapLibre / Mapbox)
- Gestión estado global (Redux/Zustand/Context)
- Hooks personalizados
- Testing (unit + e2e)
- Accesibilidad WCAG 2.2 / EAA 2025

## ⚙️ Backend – Spring Boot
- REST API (Spring MVC)
- WebSockets (STOMP)
- Spring Security (JWT, roles: owner, driver, admin)
- Postgres + PostGIS (consultas geoespaciales)
- Spring Data JPA / Hibernate Spatial
- OpenAPI/Swagger (documentación automática)
- Validación (Bean Validation)
- Testing con JUnit + Testcontainers
- Monitoring con Spring Actuator

## 🗃️ Base de datos – PostgreSQL + PostGIS
Tablas:
- user
- owner
- driver
- parking (geom Point, SRID 4326, índice GiST)
- reservation
- notification
- messages (chat opcional)

Consultas:
- ST_DWithin → parkings en radio
- ST_Distance → distancia exacta

## 🔄 Comunicación Front ↔ Back
**REST (HTTP + JSON)**
- POST /api/auth/login
- GET /api/parkings
- POST /api/reservation-requests
- Añadir poco a poco todas

**WebSockets**
- /enterprise/{id}/queue/updates
- /chat/{reservationId}

## ♿ Accesibilidad (EAA 2025)
- WCAG 2.2 AA
- Navegación por teclado
- Roles ARIA
- Contraste adecuado
- Focus visible
- Formularios accesibles
- aria-live para avisos
- Testing con axe, Lighthouse
- Añadir más...

## ✅ MVP (Conductor)
- Registro/login
- Buscar parkings (GPS + PostGIS)
- Ver mapa y lista
- Ver detalles del parking
- Solicitar/cancelar/ver reserva solicitada
- Notificación en tiempo real
- PWA instalable
- Accesibilidad básica

## 🚀 Futuro
- Chat usuarios
- Pagos
- Filtros avanzados
- Panel admin
- Push notifications

## ⚙️ Ejecución (resumen)
- Crear un .env en la raiz del proyecto del codigo con los datos que se encuentran en .env del google drive (dentro la carpeta desarrollo/codigo)

**Linux**
```
git clone https://github.com/alex-boni/QuickStop.git
cd QuickStop
npm install
npm run dev:windows
```

**Windows. Necesita installar docker-desktop**
```
git clone https://github.com/alex-boni/QuickStop.git
cd QuickStop
npm install
npm run dev
```

## ✅ Por qué este stack
- React (UX + PWA)
- Spring Boot (robusto, seguro, WebSockets)
- PostGIS (geolocalización real)
- Arquitectura escalable
- Cumplimiento accesibilidad UE
- Comunicación desacoplada (REST/WebSockets)

## 🗺️ Hemos realizado
1. Definir casos de uso y entidades
2. Definicion de historias de usuario
3. División de HU en tareas
3. Configurar monorepo (npm workspaces)

## 🗺️ Próximos pasos
1. Estimar nuesto backlog del MVP
2. Diseñar contrato OpenAPI inicial
3. Configurar monorepo (npm workspaces)
4. Scaffold frontend y backend
5. Implementar primer corte vertical (parkings)
6. Añadir auth, reservas, tiempo real
7. PWA offline y push
8. Accesibilidad avanzada
9. Testing completo

---
**Autor:**  
- [Alex Guillermo Bonilla Taco – Ingeniero de Software](https://github.com/alex-boni)
- [Airam Martín Soto - Ingeniero de Software](https://github.com/airamsoto)
