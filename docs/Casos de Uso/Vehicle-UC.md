```mermaid
flowchart LR
  actorUser([👤 User])

  subgraph UseCases
    U1((createVehicle))
    U2((readVehicle))
    U3((updateVehicle))
    U4((deleteVehicle))
    U5((readAllVehicles))

  end

  actorUser --> U1
  actorUser --> U2
  actorUser --> U3
  actorUser --> U4
  actorUser --> U5

```
