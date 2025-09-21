
# Diagrama de Clases del Modelo del Dominio Completo
```mermaid
classDiagram
  direction LR

  class User {
    long id - PK Autoincrement
    String name
    String email
    String password
    boolean status
  }

  class Parking {
    long id - PK Autoincrement
    int longitude
    int latitude
    double price
    boolean status
  }

  class Reservation {
    long id - PK Autoincrement
    long userId - FK
    long parkingId - FK
    LocalDate reservationDate
    LocalTime reservationTime
    double amount
    boolean status
  }

  class Release {
    long id - PK Autoincrement
    long userId - FK
    long parkingId - FK
    LocalDate releaseDate
    LocalTime releaseTime
    double amount
    boolean status
  }

  class Transaction {
    long id - PK Autoincrement
    long userId - FK
    LocalDate transactionDate
    LocalTime transactionTime
    double amount
    double remainingBalance
    boolean status
  }

  class Vehicle {
    long id - PK Autoincrement
    long userId - FK
    String plate
    String brand
    String model
    String size
    String type
    boolean disability
    boolean status
  }

  class Admin {
    long userId - FK
    long employeeNumber - unique
  }

  class Normal {
    long userId - FK
    String nationalId - unique
    String address
  }

  class Public {
    long parkingId - FK 
    double generalPrice
  }

  class Private {
    long parkingId - FK 
    double hourlyPrice
    int slots
  }

%% Relationships
  User <|-- Admin
  User <|-- Normal
  Parking <|-- Public
  Parking <|-- Private

  User "1" -- "N" Release : creates
  Reservation "N" -- "1" User : requests
  Parking "1" -- "N" Reservation : contains
  Release "N" -- "1" Parking : contains
  User "1" -- "N" Vehicle : registers
  User "1" -- "N" Transaction : registers

```
