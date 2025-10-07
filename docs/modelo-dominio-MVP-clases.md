
# Diagrama de Clases del Modelo del Dominio MVP
```mermaid
classDiagram
  direction LR

  class User {
    long id - PK Autoincrement
    String name
    String email
    String password
    String rol
    boolean status
  }

  class Parking {
    long id - PK Autoincrement
    long ownerId - FK
    int longitude
    int latitude
    double price
    boolean status
  }


  class Reservation {
    long id - PK Autoincrement
    long driverId - FK
    long parkingId - FK
    LocalDate reservationDate
    LocalTime reservationTime
    double amount
    boolean status
  }




  %% Relaciones
  User "1" -- "N" Parking : creates
  Reservation "N" -- "1" User : driver request
  Reservation "N" -- "1" User : owner accept/reject
  Parking "1" -- "N" Reservation : contains
```
