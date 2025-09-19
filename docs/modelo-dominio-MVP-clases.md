
# Diagrama de Clases del Modelo del Dominio MVP
```mermaid
classDiagram
  direction LR

  class Usuario {
    long id - PK Autoincrement
    String nombre
    String email
    String password
    boolean estado
  }

  class Aparcamiento {
    long id - PK Autoincrement
    int longitud
    int latitud
    double precio
    boolean estado
  }


  class Reserva {
    long id - PK Autoincrement
    long usuarioId - FK
    long aparcamientoId - FK
    LocalDate fechaRes
    LocalTime horaRes
    double importe
    boolean estado
  }


  class Liberacion {
    long id - PK Autoincrement
    long usuarioId - FK
    long aparcamientoId - FK
    LocalDate fechaLib
    LocalTime horaLib
    double importe
    boolean estado
  }

  %% Relaciones
  Usuario "1" -- "N" Liberacion : crea
  Reserva "N" -- "1" Usuario : solicita
  Aparcamiento "1" -- "N" Reserva : contiene
  Liberacion "N" -- "1" Aparcamiento : contiene
```
