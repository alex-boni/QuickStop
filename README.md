# 🚗 PWA de Búsqueda y Gestión de Parkings en Tiempo Real

Este proyecto es una **Aplicación Web Progresiva (PWA)** que permite a los usuarios **buscar parkings cercanos**, **ver disponibilidad en tiempo real**, **realizar reservas**, **compartir disponibilidad de tus parkings** y **rebicir cobros y generar pagos**.  
Todo ello cumpliendo con la **normativa europea de accesibilidad (EAA 2025)** y con una arquitectura moderna, escalable y profesional.

## 🧱 Arquitectura General
| Capa | Tecnología |
|------|-------------|
| Frontend | React + Vite (PWA) |
| Backend | Spring Boot (REST + WebSockets) |
| Base de datos | PostgreSQL + PostGIS |
| Comunicación | REST (JSON) + WebSockets (STOMP) |
| Monorepo | npm workspaces |

## 📂 Estructura del Monorepo
```
root/
├── package.json
├── app/           ← Frontend (React + Vite + PWA)
├── api/           ← Backend (Spring Boot + PostGIS)
└── README.md
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
**Frontend**
```
cd app
npm install
npm run dev
```

**Backend**
```
cd api
./mvnw spring-boot:run
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
