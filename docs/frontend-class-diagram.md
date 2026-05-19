```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'background': '#ffffff',
    'primaryColor': '#f3f4f6',
    'primaryTextColor': '#111827',
    'primaryBorderColor': '#4f46e5',
    'lineColor': '#374151',
    'secondaryColor': '#e0e7ff',
    'tertiaryColor': '#ffffff'
  }
}}%%
classDiagram
    %% ======= Core =======

    class Main {
      <<launcher>>

    }
    class App {
      +Layout()
      +ReactAppRoutesDom(): Routes
    }

    class AppRoutes {
      <<Routes>>
      +render(route: string): ReactElement
      +navigate(path: string): void
    }

    class ModuleRoutes {
      <<Routing>>
      +UserRoutes
      +ParkingRoutes
      +ReservationRoutes
    }

    
    Main --> App : create
    Main --> ServiceWorker : register
    AppRoutes --> ModuleRoutes : add routes of


    %%======== Views =================
    class LoginPage {
        <<View>>
      +render(): ReactElement
    }

    class RegisterPage {
        <<View>>
      +render(): ReactElement
    }


    class MapPage {
        <<Principal View>>
      -myCoords: Coordinates
      +render(): ReactElement
    }

    App --> AppRoutes : navigate("/")
    AppRoutes --> MapPage : render("/")
    AppRoutes --> LoginPage : render("/login")
    AppRoutes --> RegisterPage : render("/register")

    %%=================== User =====================
    class UserFeature {
      <<Feature>>
      +components
      +hooks
      +service
    }

    class LoginForm {
      <<Component>>
      +render()
    }
    class RegisterForm {
      <<Component>>
      +render()
    }

    class hook1 {
      <<Hook>>
      +atributtes: Type
      +function()
    }

    class UserService {
      <<Service>>
    }


    RegisterPage --> UserFeature : use
    LoginPage --> UserFeature : use
    UserFeature --> UserService : calls
    UserFeature --> LoginForm : contains
    UserFeature --> RegisterForm : contains
    UserFeature --> hook1 : contains
    UserService --> ApiClient : uses


    %%=================== Parking =====================



    class ReservationService {
      <<Service>>
    }
    MapPage --> ParkingFeature : uses
    ParkingFeature --> ReservationService : calls
    ReservationService --> ApiClient : uses

    class ParkingFeature {
      <<Feature>>
      +components
      +hooks
      +service
    }

    class ParkingService {
      <<Service>>
    }

    class MyGeolocation  {
        <<hooks>>
      +coords: Coordinates
    }
    ParkingFeature --> MyGeolocation : contains
    ParkingFeature --> ParkingService : calls
    ParkingService --> ApiClient : uses
    class ApiClient {
      -baseURL: string
      +get(url: string, params?): Promise
      +post(url: string, params?): Promise
    }

    %% ======= UI (Map) =======
    class MapContainer {
      <<Component>>
      +center: Coordinates
      +markers: Parking[]
      +render(): ReactElement
    }

    ParkingFeature --> MapContainer : passes {center, markers}

    class Parking {
      <<Transfer>>
      +id: string
      +name: string
      +lat: number
      +lng: number
      +pricePerHour: number
      +distanceMeters: number
    }

    class Coordinates {
      <<Transfer>>
      +lat: number
      +lng: number
    }

    MapContainer o--> Parking : displays *
    MyGeolocation --> Coordinates : returns



    %% ======= PWA Layer =======
    class ServiceWorker {
      <<sw>>
      VERSION : const
      CACHE_NAME : const
      appFiles : const[]
      +install()
      +fetch()
      +active()
    }

    ServiceWorker ..> ApiClient : intercepts fetch(/api/parkings) 
    ServiceWorker ..> MapPage : offline status / updates 

    %% ======= Backend Edge =======
    class BackendAPI {
      <<external>>
      +GET /api/parkings
      +POST /api/user/login
    }

    ApiClient --> BackendAPI : HTTPS
