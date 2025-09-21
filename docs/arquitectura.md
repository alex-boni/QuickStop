# Arquitectura 

```mermaid
graph LR
  subgraph User
    U[User]
  end
  subgraph Frontend["Frontend / PWA"]
    FE[React/Vite]
  end
  subgraph Backend["Backend / Spring Boot"]
    API[REST + WS]
    DB[(PostgreSQL/PostGIS)]
  end

  U --> FE
  FE --> API
  API --> DB

%%--------Styles
  style Frontend fill:#0d47a1,stroke:#42a5f5,stroke-width:2px,color:#ffffff,rx:15px,ry:15px
  style Backend  fill:#e65100,stroke:#ffb74d,stroke-width:2px,color:#ffffff,rx:15px,ry:15px
  style User     fill:#212121,stroke:#9e9e9e,stroke-width:2px,color:#ffffff,rx:15px,ry:15px
