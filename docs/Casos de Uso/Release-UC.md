```mermaid
flowchart LR
  actorUser([👤 User])

  subgraph UseCases
    U1((createRelease))
    U2((readRelease))
    U3((updateRelease))
    U4((deleteRelease))
    U5((readAllRelease))

  end

  actorUser --> U1
  actorUser --> U2
  actorUser --> U3
  actorUser --> U4
  actorUser --> U5

```
