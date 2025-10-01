```mermaid

flowchart LR
  Owner([🏠 Owner])
  Driver([👤 Client])

  subgraph OwnerUseCases
    O1((registerAccount))
    O2((addParking))
    O3((editParking))
    O4((deleteParking))
    O5((viewReservationRequests))
    O6((acceptReservationRequest))
    O7((cancelReservationRequest))
  end

  subgraph ClientUseCases
    C1((registerAccount))
    C2((searchParking))
    C3((viewParkingDetails))
    C4((requestReservation))
    C5((cancelReservation))
    C6((checkReservationStatus))
  end

  Owner --> O1
  Owner --> O2
  Owner --> O3
  Owner --> O4
  Owner --> O5
  Owner --> O6
  Owner --> O7

  Driver --> C1
  Driver --> C2
  Driver --> C3
  Driver --> C4
  Driver --> C5
  Driver --> C6
