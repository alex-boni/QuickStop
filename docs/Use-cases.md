```mermaid

flowchart LR
  Owner([🏠 Owner])
  Client([👤 Client])

  subgraph OwnerUseCases
    O1((Register account))
    O2((Add parking))
    O3((Edit parking))
    O4((Delete parking))
    O5((View reservation requests))
    O6((Accept reservation request))
    O7((Cancel reservation request))
  end

  subgraph ClientUseCases
    C1((Register account))
    C2((Search parking))
    C3((View parking details))
    C4((Request reservation))
    C5((Cancel reservation))
    C6((Check reservation status))
  end

  Owner --> O1
  Owner --> O2
  Owner --> O3
  Owner --> O4
  Owner --> O5
  Owner --> O6
  Owner --> O7

  Client --> C1
  Client --> C2
  Client --> C3
  Client --> C4
  Client --> C5
  Client --> C6
