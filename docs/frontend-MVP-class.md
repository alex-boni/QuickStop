```mermaid
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

    class UserRoutes {
      <<Routing>>
    }

    class ParkingRoutes {
      <<Routing>>
    }

    class ReservationRoutes {
      <<Routing>>
    }

    class RealeseRoutes {
      <<Routing>>
    }
    
    Main --> App : create
    Main --> ServiceWorker : register
    AppRoutes --> UserRoutes : add routes of
    AppRoutes --> ParkingRoutes : add routes of
    AppRoutes --> ReservationRoutes : add routes of
    AppRoutes --> RealeseRoutes : add routes of

    %%======== Views =================
    class LoginPage {
        <<View>>
      +render(): ReactElement
    }

    class RegisterPage {
        <<View>>
      +render(): ReactElement
    }

    class UserPage {
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
    AppRoutes --> UserPage : render("/profile")
    AppRoutes --> LoginPage : render("/login")
    AppRoutes --> RegisterPage : render("/register")

    %%=================== User =====================
    class UserIndex {
      <<façade>>
      +components
      +hooks
      +controller
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

    class UserController {
      <<Controller>>
    }

    class UserService {
      <<Service>>
    }


    UserPage --> UserIndex : use
    RegisterPage --> UserIndex : use
    LoginPage --> UserIndex : use
    UserIndex --> UserController : access
    UserIndex --> LoginForm : contains
    UserIndex --> RegisterForm : contains
    UserIndex --> hook1 : contains
    UserController --> UserService : calls
    UserService --> ApiClient : uses


    %%=================== Parking =====================


    class RealeseIndex {
      <<Façade>>
      +components
      +hooks
      +controller
    }

    class RealeseController{
      <<Controller>>
    }

    class RealeseService {
      <<Service>>
    }
    RealeseIndex --> RealeseController : access
    RealeseController --> RealeseService : calls
    RealeseService --> ApiClient : uses

    class ReservationIndex {
      <<façade>>
      +components
      +hooks
      +controller
    }

    class ReservationController{
      <<Controller>>
    }

    class ReservationService {
      <<Service>>
    }
    MapPage --> ParkingIndex : uses
    MapPage --> RealeseIndex : uses
    MapPage --> ReservationIndex : uses
    ReservationIndex --> ReservationController : access
    ReservationController --> ReservationService : calls
    ReservationService --> ApiClient : uses

    class ParkingIndex {
      <<Façade>>
      +components
      +hooks
      +controller
    }

    class ParkingController {
      <<Controller>>
      -radiusMeters: number
      -parkings: Parking[]
      +ParkingController(coords: Coordinates): Parking[]
    }

    class ParkingService {
      <<Service>>
      +getNearby(coords: Coordinates, radius: number): Parking[]
    }

    class MyGeolocation  {
        <<hooks>>
      +coords: Coordinates
    }
    ParkingIndex --> ParkingController : access
    ParkingIndex --> MyGeolocation : contains
    ParkingController --> ParkingService : calls
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

    ParkingIndex --> MapContainer : passes {center, markers}

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

    %% ======= Realtime (WebSockets) =======
    class WebsocketService {
      +configure(opts): void
      +connect(topicId: string): void
      +subsribe(topic, handler)
      +unsubsribe(topic, handler)
      +disconnect(): void
      +onMessage(cb: function): void
    }

    WebsocketService ..> MapPage : dispatches UI updates
    MapPage -- WebsocketService : mount/unmount

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
      +WS /user/queue/updates
    }

    ApiClient --> BackendAPI : HTTPS
    WebsocketService --> BackendAPI : STOMP over WS
