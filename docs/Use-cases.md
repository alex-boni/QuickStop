```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'background': '#ffffff',
    'primaryColor': '#f9fafb',
    'primaryTextColor': '#111827',
    'primaryBorderColor': '#4f46e5',
    'lineColor': '#374151',
    'secondaryColor': '#f3f4f6',
    'tertiaryColor': '#ffffff'
  }
}}%%
flowchart LR
    %% ==== Actores ====
    User([👤 Usuario Genérico])
    Owner([🏠 Propietario / Owner])
    Driver([🚗 Conductor / Driver])


    %% ==== Casos de Uso: Conductor ====
    subgraph DriverUseCases [Casos de Uso: Conductor]
        CU10((CU10 - Visualizar Mapa Interactivo))
        CU11((CU11 - Consultar Detalle))
        CU12((CU12 - Confirmar Reserva))
        CU13((CU13 - Consultar mis Reservas))
        CU14((CU14 - Cancelar Reserva))
    end

    %% ==== Casos de Uso: Owner ====
    subgraph OwnerUseCases [Casos de Uso: Propietario]
        CU06((CU06 - Dar de alta Aparcamiento))
        CU07((CU07 - Modificar Aparcamiento))
        CU08((CU08 - Eliminar Aparcamiento))
        CU09((CU09 - Consultar mis Aparcamientos))
    end

    %% ==== Casos de Uso: Usuario Genérico ====
    subgraph GenericUseCases [Casos de Uso: Usuario G.]
        CU01((CU01 - Registrar Usuario))
        CU02((CU02 - Iniciar Sesión))
        CU03((CU03 - Cerrar Sesión))
        CU04((CU04 - Consultar Perfil))
        CU05((CU05 - Editar Perfil))
    end

    %% ==== Conexiones Actores -> Casos de Uso ====
    User --> CU01
    User --> CU02
    User --> CU03
    User --> CU04
    User --> CU05

    Owner --> CU06
    Owner --> CU07
    Owner --> CU08
    Owner --> CU09

    Driver --> CU10
    Driver --> CU11
    Driver --> CU12
    Driver --> CU13
    Driver --> CU14
