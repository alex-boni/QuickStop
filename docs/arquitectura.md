# Arquitectura 

## Vista general 
```mermaid
graph LR
  subgraph User
    U[Usuario]
  end
  subgraph Frontend[PWA]
    FE[React/Vite]
  end
  subgraph Backend[API Spring Boot]
    API[REST + WS]
    DB[(PostgreSQL/PostGIS)]
  end

  U --> FE
  FE --> API
  API --> DB
