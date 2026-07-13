# Arrow Maze — Backend

![CI](https://github.com/Georopeza/BackEnd-ArrowMaze/actions/workflows/ci.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Node](https://img.shields.io/badge/Node-20.x-green)
![Tests](https://img.shields.io/badge/tests-unit%20%2B%20integration-brightgreen)
![License](https://img.shields.io/badge/license-Academic-lightgrey)

## Description

REST API backend for **Arrow Maze**, a puzzle game where the player extracts arrows
from a board by moving them in the direction they point, without collisions. This
repository owns level definitions, user accounts, player progress and the global
leaderboard, following **Clean Architecture** and **SOLID** principles.

All four layers are implemented and covered by tests: JWT authentication, level
CRUD with solvability validation, bidirectional progress sync (push on victory,
pull on login), collectible unlock sync, a global leaderboard, and persistence
(SQLite or Postgres) that survives process restarts.

## Architecture

Four **concentric** Clean Architecture layers (onion model, L4⊃L3⊃L2⊃L1): **DOMAIN** at the
center; each outer ring may depend on inner rings only — never the reverse. Ports
(`I*Repository`, `I*Service`) live in domain/application; adapters (mappers, repository
implementations, route handlers) sit in the **INTERFACE ADAPTERS** ring; Express, DB drivers
and AOP middlewares form the outermost **FRAMEWORKS & DRIVERS** ring. Components are **white
boxes** with a colored border per layer; arrows connect **component → component** with English
labels and point inward. Dashed arrows show **implements (DIP)** — adapters fulfilling ports
defined in inner layers. The domain layer imports nothing (no Express, SQLite, or pg).

```mermaid
flowchart TB
    %% BackEnd ArrowMaze — Clean Architecture (concentric onion · English)
    %% Dependency rule: arrows point toward the center only

    subgraph Legend["Legend"]
        direction LR
        legDom["🔴 DOMAIN"] ~~~ legApp["🟡 APPLICATION"] ~~~ legAdp["🟢 INTERFACE ADAPTERS"] ~~~ legFw["🔵 FRAMEWORKS & DRIVERS"] ~~~ legExt["⬜ component"] ~~~ legDip["- - implements (DIP)"]
    end

    subgraph L4["🔵 FRAMEWORKS & DRIVERS"]
        direction TB
        Express["Express HTTP server<br/><i>src/infrastructure/http/server.ts</i>"]
        AOP["AOP middlewares<br/><i>requestLogger · errorHandler · auth · notFound</i>"]
        Drivers["DB drivers<br/><i>better-sqlite3 · pg Pool</i>"]
        CatalogWatch["Level catalog watcher<br/><i>LevelCatalogFileSubject · UpsertObserver · chokidar</i>"]
        Swagger["Swagger UI<br/><i>infrastructure/http/openapi/</i>"]
        LevelFiles["Level JSON files<br/><i>levels/level-*.json</i>"]

        subgraph L3["🟢 INTERFACE ADAPTERS"]
            direction TB
            RoutesAuth["auth.routes<br/><i>infrastructure/http/routes/auth.routes.ts</i>"]
            RoutesLevels["levels.routes<br/><i>infrastructure/http/routes/levels.routes.ts</i>"]
            RoutesProgress["progress.routes<br/><i>infrastructure/http/routes/progress.routes.ts</i>"]
            RoutesLeader["leaderboard.routes<br/><i>infrastructure/http/routes/leaderboard.routes.ts</i>"]
            RoutesHealth["health.routes<br/><i>infrastructure/http/routes/health.routes.ts</i>"]
            Mapper["LevelJsonMapper<br/><i>infrastructure/mappers/LevelJsonMapper.ts</i>"]
            CompRoot["createContainer / AppContainer<br/><i>infrastructure/http/container.ts</i>"]
            AdpLevelRepo["SqliteLevelRepository<br/>PostgresLevelRepository<br/><i>infrastructure/persistence/</i>"]
            AdpUserRepo["SqliteUserRepository<br/>PostgresUserRepository<br/><i>infrastructure/persistence/</i>"]
            AdpProgressRepo["SqliteProgressRepository<br/>PostgresProgressRepository<br/><i>infrastructure/persistence/</i>"]
            AdpCollectRepo["SqliteCollectibleRepository<br/>PostgresCollectibleRepository<br/><i>infrastructure/persistence/</i>"]
            Bcrypt["BcryptPasswordHasher<br/><i>infrastructure/security/</i>"]
            JwtSvc["JwtTokenService<br/><i>infrastructure/security/</i>"]
            SeedCatalog["seedLevelCatalog<br/><i>persistence/seed/seedLevelCatalog.ts</i>"]

            subgraph L2["🟡 APPLICATION"]
                direction TB
                UC_Register["RegisterUserUseCase<br/><i>application/use-cases/</i>"]
                UC_Login["LoginUserUseCase<br/><i>application/use-cases/</i>"]
                UC_ListLevels["ListLevelsUseCase<br/><i>application/use-cases/</i>"]
                UC_GetLevel["GetLevelUseCase<br/><i>application/use-cases/</i>"]
                UC_Upsert["UpsertLevelUseCase<br/><i>application/use-cases/</i>"]
                UC_SyncProg["SyncProgressUseCase<br/><i>application/use-cases/</i>"]
                UC_SyncColl["SyncCollectiblesUseCase<br/><i>application/use-cases/</i>"]
                UC_GetProg["GetPlayerProgressUseCase<br/><i>application/use-cases/</i>"]
                UC_Leader["GetLeaderboardUseCase<br/><i>application/use-cases/</i>"]
                PortToken["«port» ITokenService<br/><i>application/ports/ITokenService.ts</i>"]
                PortMapper["«port» ILevelJsonMapper<br/><i>application/ports/ILevelJsonMapper.ts</i>"]

                subgraph L1["🔴 DOMAIN"]
                    direction TB
                    Ent_Board["Board<br/><i>domain/aggregates/Board.ts</i>"]
                    Ent_Cells["Cell · ArrowCell · WallCell<br/>EmptyCell · ExitCell<br/><i>domain/entities/</i>"]
                    Ent_Level["LevelDefinition<br/><i>domain/entities/LevelDefinition.ts</i>"]
                    Ent_User["User<br/><i>domain/entities/User.ts</i>"]
                    Ent_Progress["PlayerProgress<br/><i>domain/entities/PlayerProgress.ts</i>"]
                    VO_Core["Direction · Position · ArrowId<br/>BoardDimensions<br/><i>domain/value-objects/</i>"]
                    Dom_Build["CellFactory · LevelBuilder<br/><i>domain/factories · domain/builders</i>"]
                    Dom_Validator["LevelSolvabilityValidator<br/><i>domain/services/</i>"]
                    PortLevel["«port» ILevelRepository<br/><i>domain/repositories/</i>"]
                    PortUser["«port» IUserRepository<br/><i>domain/repositories/</i>"]
                    PortProgress["«port» IProgressRepository<br/><i>domain/repositories/</i>"]
                    PortCollect["«port» ICollectibleRepository<br/><i>domain/repositories/</i>"]
                    PortHash["«port» IPasswordHasher<br/><i>domain/services/</i>"]
                    DomainNote["Domain imports nothing<br/><i>no Express · no SQLite · no pg</i>"]
                end
            end
        end
    end

    %% ── L4 → L3: frameworks route into adapters ──
    Express -->|"routes HTTP requests"| RoutesAuth
    Express -->|"routes HTTP requests"| RoutesLevels
    Express -->|"routes HTTP requests"| RoutesProgress
    Express -->|"routes HTTP requests"| RoutesLeader
    Express -->|"exposes"| RoutesHealth
    Express -->|"serves docs"| Swagger
    AOP -->|"intercepts / validates JWT"| RoutesLevels
    AOP -->|"intercepts / validates JWT"| RoutesProgress
    AOP -->|"intercepts / validates JWT"| RoutesLeader
    AOP -->|"validates token via"| JwtSvc
    Drivers -->|"persists to DB"| AdpLevelRepo
    Drivers -->|"persists to DB"| AdpUserRepo
    Drivers -->|"persists to DB"| AdpProgressRepo
    Drivers -->|"persists to DB"| AdpCollectRepo
    LevelFiles -->|"watched by"| CatalogWatch

    %% ── L4 → L2: catalog hot-reload ──
    CatalogWatch -->|"triggers on file change"| UC_Upsert

    %% ── L3 → L2: adapters execute use cases ──
    RoutesAuth -->|"POST /register"| UC_Register
    RoutesAuth -->|"POST /login"| UC_Login
    RoutesLevels -->|"GET /levels"| UC_ListLevels
    RoutesLevels -->|"GET /levels/:id"| UC_GetLevel
    RoutesLevels -->|"PUT /levels/:id"| UC_Upsert
    RoutesProgress -->|"POST /progress/sync"| UC_SyncProg
    RoutesProgress -->|"POST /collectibles/sync"| UC_SyncColl
    RoutesProgress -->|"GET /progress"| UC_GetProg
    RoutesLeader -->|"GET /leaderboard/:id"| UC_Leader
    CompRoot -->|"wires / injects"| UC_Register
    CompRoot -->|"wires / injects"| UC_Login
    CompRoot -->|"wires / injects"| UC_ListLevels
    CompRoot -->|"wires / injects"| UC_Upsert
    CompRoot -->|"wires / injects"| UC_SyncProg
    CompRoot -->|"wires / injects"| UC_Leader
    CompRoot -->|"instantiates adapters"| AdpLevelRepo
    CompRoot -->|"instantiates adapters"| Bcrypt
    CompRoot -->|"instantiates adapters"| JwtSvc
    CompRoot -->|"instantiates adapters"| Mapper
    CompRoot -->|"runs on startup"| SeedCatalog
    SeedCatalog -->|"loads initial JSON"| UC_Upsert
    UC_ListLevels -->|"invokes mapper"| Mapper
    UC_GetLevel -->|"invokes mapper"| Mapper
    UC_Upsert -->|"invokes mapper"| Mapper

    %% ── L3 → L1: mapper builds domain objects ──
    Mapper -->|"deserializes to"| Ent_Level
    Mapper -->|"builds cells"| Ent_Cells
    Mapper -->|"builds board"| Ent_Board
    Mapper -->|"uses factory/builder"| Dom_Build

    %% ── L2 → L1: use cases depend on domain ──
    UC_Register -->|"creates entity"| Ent_User
    UC_Register -->|"queries / persists via"| PortUser
    UC_Register -->|"hashes password via"| PortHash
    UC_Login -->|"validates credentials"| Ent_User
    UC_Login -->|"queries user via"| PortUser
    UC_Login -->|"compares hash via"| PortHash
    UC_Login -->|"issues JWT via"| PortToken
    UC_ListLevels -->|"queries catalog via"| PortLevel
    UC_ListLevels -->|"serializes via"| PortMapper
    UC_ListLevels -->|"reads definitions"| Ent_Level
    UC_GetLevel -->|"fetches by id via"| PortLevel
    UC_GetLevel -->|"serializes via"| PortMapper
    UC_Upsert -->|"validates solvability"| Dom_Validator
    UC_Upsert -->|"persists definition via"| PortLevel
    UC_Upsert -->|"manipulates"| Ent_Level
    UC_SyncProg -->|"updates aggregate"| Ent_Progress
    UC_SyncProg -->|"persists via"| PortProgress
    UC_SyncProg -->|"validates level via"| PortLevel
    UC_SyncColl -->|"syncs IDs via"| PortCollect
    UC_GetProg -->|"queries progress via"| PortProgress
    UC_GetProg -->|"queries collectibles via"| PortCollect
    UC_Leader -->|"queries ranking via"| PortProgress

    %% ── DIP: adapters implement ports (dashed) ──
    AdpLevelRepo -.->|"implements"| PortLevel
    AdpUserRepo -.->|"implements"| PortUser
    AdpProgressRepo -.->|"implements"| PortProgress
    AdpCollectRepo -.->|"implements"| PortCollect
    Bcrypt -.->|"implements"| PortHash
    JwtSvc -.->|"implements"| PortToken
    Mapper -.->|"implements"| PortMapper

    classDef nodeL1 fill:#ffffff,stroke:#b71c1c,stroke-width:2px,color:#212121
    classDef nodeL2 fill:#ffffff,stroke:#f57f17,stroke-width:2px,color:#212121
    classDef nodeL3 fill:#ffffff,stroke:#2e7d32,stroke-width:2px,color:#212121
    classDef nodeL4 fill:#ffffff,stroke:#1565c0,stroke-width:2px,color:#212121
    classDef note fill:#fff8e1,stroke:#f57f17,stroke-width:1px,color:#424242,font-size:11px
    classDef legend fill:#f5f5f5,stroke:#616161,color:#212121

    class Ent_Board,Ent_Cells,Ent_Level,Ent_User,Ent_Progress,VO_Core,Dom_Build,Dom_Validator,PortLevel,PortUser,PortProgress,PortCollect,PortHash nodeL1
    class UC_Register,UC_Login,UC_ListLevels,UC_GetLevel,UC_Upsert,UC_SyncProg,UC_SyncColl,UC_GetProg,UC_Leader,PortToken,PortMapper nodeL2
    class RoutesAuth,RoutesLevels,RoutesProgress,RoutesLeader,RoutesHealth,Mapper,CompRoot,AdpLevelRepo,AdpUserRepo,AdpProgressRepo,AdpCollectRepo,Bcrypt,JwtSvc,SeedCatalog nodeL3
    class Express,AOP,Drivers,CatalogWatch,Swagger,LevelFiles nodeL4
    class DomainNote note
    class legDom,legApp,legAdp,legFw,legExt,legDip legend

    style L1 fill:#ffcdd2,stroke:#b71c1c,stroke-width:3px
    style L2 fill:#fff59d,stroke:#f57f17,stroke-width:3px
    style L3 fill:#a5d6a7,stroke:#2e7d32,stroke-width:3px
    style L4 fill:#90caf9,stroke:#1565c0,stroke-width:3px
```

![Clean Architecture layers (static export)](docs/architecture/clean-architecture.png)

Source: [`docs/architecture/clean-architecture.mmd`](docs/architecture/clean-architecture.mmd) (editable). Regenerate README embeds with `python scripts/sync-readme-diagrams.py`.

| Layer | Responsibility | Status |
|---|---|---|
| **Domain** | Entities, value objects, factories, repository interfaces (ports) | ✅ Implemented |
| **Application** | Use cases: auth, progress sync (push + pull), leaderboard, levels | ✅ Implemented |
| **Interface Adapters** | Route handlers, `LevelJsonMapper`, SQLite/Postgres repository implementations, `AppContainer`, security adapters | ✅ Implemented |
| **Infrastructure** | Express, AOP middlewares, DB drivers (`pg`, `better-sqlite3`), catalog seed/Observer | ✅ Implemented |

### Domain layer

```
src/domain/
├── aggregates/      # Board (the only active Aggregate Root for gameplay)
├── entities/        # ArrowCell, WallCell, EmptyCell, ExitCell, LevelDefinition, User, PlayerProgress
├── value-objects/   # Direction, Position, LeaderBoardEntry
├── factories/        # CellFactory (Factory Method)
├── builders/         # LevelBuilder (Builder)
├── services/         # LevelSolvabilityValidator, LevelActionService, LevelToBoardMapper
├── rules/            # BaseLevelProcessor (Template Method), FireArrowLevelProcessor
├── repositories/     # ILevelRepository, IUserRepository, IProgressRepository, ICollectibleRepository (ports)
└── tests/            # BoardTestBuilder, BoardObjectMother, BoardTestingApi (test-only helpers)
```

### Contract with the frontend

Level definitions are exchanged with the [Arrow-Maze-Escape-Puzzle](https://github.com/Mianjoy/Arrow-Maze-Escape-Puzzle)
frontend using the shared `StructuredLevelJsonDto` contract:
[`docs/contract/level.contract.ts`](docs/contract/level.contract.ts). `LevelJsonMapper`
(`src/infrastructure/mappers/LevelJsonMapper.ts`) translates it into a `LevelDefinition`
using the existing `LevelBuilder`/`CellFactory`, and validates solvability
(`LevelSolvabilityValidator`) before a level can be persisted.

### Class Diagram

Main classes across all four layers (color-coded), their relationships
(inheritance, interface implementation, association/composition), and the
design patterns applied. Low-level test helpers are omitted for readability.
Editable source: [`docs/architecture/class-diagram.mmd`](docs/architecture/class-diagram.mmd). Regenerate README embeds with `python scripts/sync-readme-diagrams.py`.

```mermaid
classDiagram
    direction TB

    %% ============================================================
    %% Arrow Maze Backend — Class Diagram
    %% Colors indicate Clean Architecture layer (see legend below).
    %% Patterns shown: Factory Method (CellFactory), Builder
    %% (LevelBuilder), Template Method (BaseLevelProcessor), Adapter
    %% (LevelJsonMapper), Repository/DIP (I*Repository ports).
    %% ============================================================

    %% ----- Domain: Board aggregate & cell hierarchy -----
    class Cell {
        <<abstract>>
    }
    class ArrowCell
    class ArrowBodyCell
    class WallCell
    class EmptyCell
    class ExitCell
    Cell <|-- ArrowCell
    Cell <|-- ArrowBodyCell
    Cell <|-- WallCell
    Cell <|-- EmptyCell
    Cell <|-- ExitCell

    class Board {
        -Cell[][] grid
        -Arrow[] arrows
        +addArrow(arrow) void
        +findArrowAt(position) Arrow
        +clearPositions(positions) void
        +removeArrowById(id) void
        +getCellAt(row, col) Cell
        +isSolved() bool
    }
    class Arrow {
        +ArrowId id
        +Position headPosition
        +Direction direction
        +Position[] occupiedPositions
    }
    Board "1" o-- "0..*" Arrow : arrows
    Board "1" *-- "many" Cell : grid (walls only)
    Arrow "1" *-- "1..*" Position : headPosition, occupiedPositions
    Arrow --> Direction

    %% ----- Domain: level & scoring -----
    class Difficulty {
        <<enumeration>>
        EASY
        MEDIUM
        HARD
        EXPERT
    }
    class LevelDefinition {
        +string id
        +int levelNumber
        +Difficulty difficulty
        +Cell[][] board
        +int maxMoves
        +int maxTimeInSeconds
        +calculateScore(strategy, movements, time) int
    }
    LevelDefinition "1" *-- "many" Cell : board
    LevelDefinition --> Difficulty

    class IScoreStrategy {
        <<interface>>
        +calculateScore(movements, time) int
    }
    LevelDefinition ..> IScoreStrategy : uses (Strategy)

    %% ----- Domain: user & progress -----
    class User {
        -string passwordHash
        +string id
        +string username
        +verifyPassword(password, hasher) bool
        +toPersistenceRecord() Record
    }
    class PlayerProgress {
        +string id
        +string userId
        +string levelId
        +int highScore
        +int minMoves
        +int minTimeInSeconds
        +bool isCompleted
        +updateScore(score, moves, time, completed) PlayerProgress
    }
    class LeaderBoardEntry {
        +string username
        +int highScore
        +int minMoves
        +int minTimeInSeconds
    }
    class Direction {
        <<enumeration>>
        UP
        DOWN
        LEFT
        RIGHT
    }
    class Position {
        +int row
        +int col
    }

    %% ----- Domain: repository ports (DIP) -----
    class ILevelRepository {
        <<interface>>
        +findById(id) LevelDefinition
        +findByLevelNumber(n) LevelDefinition
        +listAll() LevelDefinition[]
        +save(level) void
        +update(level) void
    }
    class IUserRepository {
        <<interface>>
        +findById(id) User
        +findByUsername(username) User
        +save(user) void
    }
    IUserRepository ..> User
    class IProgressRepository {
        <<interface>>
        +findByUserAndLevel(userId, levelId) PlayerProgress
        +findAllByUser(userId) PlayerProgress[]
        +save(progress) void
        +getLeaderboardByLevel(levelId, limit) LeaderBoardEntry[]
    }
    IProgressRepository ..> LeaderBoardEntry
    class IPasswordHasher {
        <<interface>>
        +hash(password) string
        +compare(password, hash) bool
    }
    class ITokenService {
        <<interface>>
        +sign(payload) string
        +verify(token) Payload
    }
    class ICollectibleRepository {
        <<interface>>
        +findAllByUser(userId) string[]
        +mergeForUser(userId, collectibleIds) string[]
    }

    %% ----- Domain: factories, builders, rules, services -----
    class CellFactory {
        +register(type, factoryFn) void
        +createCell(type) Cell
    }
    CellFactory ..> Cell : creates (Factory Method)

    class LevelBuilder {
        +withId(id) LevelBuilder
        +withDimensions(h, w) LevelBuilder
        +addCell(row, col, cell) LevelBuilder
        +addArrow(row, col, dir, id, body) LevelBuilder
        +withConstraints(maxMoves, maxTime) LevelBuilder
        +build() LevelDefinition
    }
    LevelBuilder ..> LevelDefinition : builds (Builder)
    LevelBuilder ..> CellFactory

    class BaseLevelProcessor {
        <<abstract>>
        +processAction() void
        #validateAction()*
        #executeMovement()*
    }
    class FireArrowLevelProcessor
    BaseLevelProcessor <|-- FireArrowLevelProcessor

    class LevelSolvabilityValidator {
        +isPlayable(dto) bool
        +solve(dto) bool
    }
    class LevelActionService {
        +interactWithCell(board, position) void
    }
    LevelActionService ..> Board
    FireArrowLevelProcessor ..> LevelActionService : delegates

    %% ----- Application: use cases -----
    class RegisterUserUseCase {
        +execute(dto) User
    }
    class LoginUserUseCase {
        +execute(dto) AuthResult
    }
    class SyncProgressUseCase {
        +execute(dto) ProgressResultDto
    }
    class GetPlayerProgressUseCase {
        +execute(userId) PlayerProgressListDto
    }
    class GetLeaderboardUseCase {
        +execute(query) LeaderBoardEntry[]
    }
    class ListLevelsUseCase {
        +execute() LevelDto[]
    }
    class GetLevelUseCase {
        +execute(id) LevelDto
    }
    class UpsertLevelUseCase {
        +execute(dto) LevelDto
    }
    class SyncCollectiblesUseCase {
        +execute(userId, collectibleIds) CollectiblesSyncResultDto
    }
    SyncCollectiblesUseCase ..> ICollectibleRepository

    RegisterUserUseCase ..> IUserRepository
    RegisterUserUseCase ..> IPasswordHasher
    LoginUserUseCase ..> IUserRepository
    LoginUserUseCase ..> IPasswordHasher
    LoginUserUseCase ..> ITokenService
    SyncProgressUseCase ..> IProgressRepository
    SyncProgressUseCase ..> ILevelRepository
    SyncProgressUseCase ..> PlayerProgress
    GetPlayerProgressUseCase ..> IProgressRepository
    GetLeaderboardUseCase ..> IProgressRepository
    ListLevelsUseCase ..> ILevelRepository
    GetLevelUseCase ..> ILevelRepository
    UpsertLevelUseCase ..> ILevelRepository
    UpsertLevelUseCase ..> LevelSolvabilityValidator

    %% ----- Infrastructure: SQLite adapters -----
    class SqliteUserRepository
    class SqliteLevelRepository
    class SqliteProgressRepository
    class SqliteCollectibleRepository
    class BcryptPasswordHasher
    class JwtTokenService
    class LevelJsonMapper {
        +toLevelDefinition(dto) LevelDefinition
        +toDto(level) StructuredLevelJsonDto
    }

    IUserRepository <|.. SqliteUserRepository
    ILevelRepository <|.. SqliteLevelRepository
    IProgressRepository <|.. SqliteProgressRepository
    ICollectibleRepository <|.. SqliteCollectibleRepository
    IPasswordHasher <|.. BcryptPasswordHasher
    ITokenService <|.. JwtTokenService
    SqliteLevelRepository ..> LevelJsonMapper : uses (Adapter)
    ListLevelsUseCase ..> LevelJsonMapper
    UpsertLevelUseCase ..> LevelJsonMapper

    %% ----- Infrastructure: composition root -----
    class AppContainer {
        <<composition root>>
        +createContainer(jwtSecret, dbPath) AppContainer
    }
    AppContainer ..> SqliteUserRepository
    AppContainer ..> SqliteLevelRepository
    AppContainer ..> SqliteProgressRepository
    AppContainer ..> SqliteCollectibleRepository
    AppContainer ..> RegisterUserUseCase
    AppContainer ..> LoginUserUseCase
    AppContainer ..> SyncProgressUseCase
    AppContainer ..> SyncCollectiblesUseCase
    AppContainer ..> GetPlayerProgressUseCase
    AppContainer ..> GetLeaderboardUseCase
    AppContainer ..> ListLevelsUseCase
    AppContainer ..> GetLevelUseCase
    AppContainer ..> UpsertLevelUseCase

    %% ============================================================
    %% Layer legend (fill colors)
    %% ============================================================
    classDef domain fill:#e8f4ea,stroke:#2e7d32,color:#1b3a1e
    classDef application fill:#e8eef8,stroke:#1565c0,color:#0d2a4d
    classDef infrastructure fill:#f8e8ee,stroke:#ad1457,color:#4d0d24

    cssClass "Cell,ArrowCell,ArrowBodyCell,WallCell,EmptyCell,ExitCell,Board,Arrow,Difficulty,LevelDefinition,IScoreStrategy,User,PlayerProgress,LeaderBoardEntry,Direction,Position,ILevelRepository,IUserRepository,IProgressRepository,ICollectibleRepository,IPasswordHasher,ITokenService,CellFactory,LevelBuilder,BaseLevelProcessor,FireArrowLevelProcessor,LevelSolvabilityValidator,LevelActionService" domain
    cssClass "RegisterUserUseCase,LoginUserUseCase,SyncProgressUseCase,SyncCollectiblesUseCase,GetPlayerProgressUseCase,GetLeaderboardUseCase,ListLevelsUseCase,GetLevelUseCase,UpsertLevelUseCase" application
    cssClass "SqliteUserRepository,SqliteLevelRepository,SqliteProgressRepository,SqliteCollectibleRepository,BcryptPasswordHasher,JwtTokenService,LevelJsonMapper,AppContainer" infrastructure
```

![Class diagram (static export)](docs/architecture/class-diagram.png)

## Design Patterns

| Pattern | Category | Where | Why |
|---|---|---|---|
| **Factory Method** | Creational | [`CellFactory.createCell()`](src/domain/factories/CellFactory.ts) | New cell types register themselves without the caller ever instantiating a concrete class |
| **Builder** | Creational | [`LevelBuilder`](src/domain/builders/LevelBuilder.ts) | Assembles a `LevelDefinition` step by step (dimensions, cells, arrows, constraints) from a JSON/YAML-style source |
| **Adapter** | Structural | [`LevelJsonMapper`](src/infrastructure/mappers/LevelJsonMapper.ts) | Translates the external wire contract (`StructuredLevelJsonDto`) to/from the internal `LevelDefinition` aggregate, isolating domain from transport format |
| **Repository (DIP)** | Structural | [`ILevelRepository`](src/domain/repositories/ILevelRepository.ts), `IUserRepository`, `IProgressRepository` | Use cases depend on these ports, never on the concrete SQLite implementations |
| **Strategy** | Behavioral | [`IScoreStrategy`](src/domain/entities/LevelDefinition.ts) (used by `LevelDefinition.calculateScore`) | Swappable scoring algorithm without touching `LevelDefinition` |
| **Template Method** | Behavioral | [`BaseLevelProcessor.processAction()`](src/domain/rules/BaseLevelProcessor.ts) | Fixes the step order (validate → execute → score → check win); `FireArrowLevelProcessor` fills in the concrete steps |
| **Observer** | Behavioral | [`LevelCatalogFileSubject`](src/infrastructure/persistence/seed/observers/LevelCatalogFileSubject.ts) + [`LevelCatalogUpsertObserver`](src/infrastructure/persistence/seed/observers/LevelCatalogUpsertObserver.ts) | Hot-reloads `levels/*.json` into the server catalog without restarting the process |

## SOLID Principles

- **SRP** — [`RegisterUserUseCase`](src/application/use-cases/RegisterUserUseCase.ts) only
  orchestrates registration (check uniqueness, hash password, persist); it doesn't know
  about HTTP status codes or JWT — that's `auth.routes.ts` and `JwtTokenService`'s job:
  ```ts
  export class RegisterUserUseCase {
    constructor(
      private readonly userRepository: IUserRepository,
      private readonly passwordHasher: IPasswordHasher,
    ) {}

    public async execute(dto: RegisterUserDto): Promise<User> {
      const existing = await this.userRepository.findByUsername(dto.username);
      if (existing) throw new UserAlreadyExistsError(dto.username);
      const passwordHash = await this.passwordHasher.hash(dto.password);
      const user = new User(randomUUID(), dto.username, passwordHash, new Date());
      await this.userRepository.save(user);
      return user;
    }
  }
  ```
- **OCP** — [`CellFactory`](src/domain/factories/CellFactory.ts) exposes `.register()`;
  adding a new cell type means calling that method somewhere else, never editing the
  factory's internals.
- **LSP** — every `Cell` subclass (`ArrowCell`, `WallCell`, `EmptyCell`, `ExitCell`) can be
  used anywhere a `Cell` is expected (`CellFactory.createCell(): Cell`), with no subclass
  narrowing the contract.
- **ISP** — repository ports are split by aggregate (`ILevelRepository`, `IUserRepository`,
  `IProgressRepository`) instead of one large repository interface — no implementation is
  forced to satisfy methods it doesn't need.
- **DIP** — see the `RegisterUserUseCase` snippet above: it depends on `IUserRepository`/
  `IPasswordHasher` interfaces, never on `SqliteUserRepository`/`BcryptPasswordHasher`
  directly. The composition root ([`src/infrastructure/http/container.ts`](src/infrastructure/http/container.ts))
  is the only place that wires concrete classes — swapping SQLite for another database
  means changing that one file, not the use cases.

## AOP

Cross-cutting concerns are implemented as Express middlewares, registered once in
[`src/infrastructure/http/server.ts`](src/infrastructure/http/server.ts) so every route
gets them for free, without any use case importing a logger or an auth check itself:

1. **Logging** — [`requestLoggerMiddleware`](src/infrastructure/http/middlewares/requestLogger.middleware.ts)
   logs method, path, status code and duration for every request.
2. **Centralized exception handling** — [`errorHandlerMiddleware`](src/infrastructure/http/middlewares/errorHandler.middleware.ts)
   turns any `ApplicationError` (or unexpected error) into a consistent JSON error
   response, instead of each route handler repeating its own try/catch.
3. **Authorization** — [`auth.middleware.ts`](src/infrastructure/http/middlewares/auth.middleware.ts)
   verifies the JWT and attaches `req.auth` before protected routes run (`POST
   /progress/sync`, `GET /progress`, `PUT /levels/:id`); public routes (`GET /levels`,
   `/auth/*`, `/health`) skip it entirely.

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev      # starts the Express server (default: http://localhost:3000)
```

`GET /health` should respond `{ "status": "ok" }`. Interactive API docs (Swagger UI)
are served at `/docs`. Data persists to `data/arrowmaze.db` (SQLite) by default — set
`DB_PATH` in `.env` to change the location, or `:memory:` for an ephemeral run.

## Running Tests

```bash
npm test    # Jest: unit + integration tests, with coverage
npm run lint
npm run build
```

The suite covers all four layers: domain unit tests (`tests/unit/domain/`), use-case
unit tests with mocked repositories (`tests/unit/application/`), HTTP integration tests
with supertest (`tests/integration/`, including auth, levels, progress/leaderboard, and
SQLite persistence across simulated process restarts), and an end-to-end catalog
playability test (`tests/e2e/`). CI (`.github/workflows/ci.yml`) runs lint, build, test
(`--maxWorkers=2`, to match the runner's 2 vCPUs and avoid the level-catalog seeding in
several integration tests starving other parallel workers of CPU) and a final step that
verifies the shared contract fixtures under `docs/contract/fixtures/` are still in sync
with the frontend repo (`scripts/check-contract-fixtures-sync.sh`), on every PR/push to
`main` and `develop`.

## AI Usage Documentation

See [AI_USAGE.md](AI_USAGE.md) for the full log of AI-assisted tasks (tool, prompt,
result, team adjustments, lessons learned).

## Contributing

1. Create a branch off `main` (e.g. `feature/<short-description>`).
2. Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit
   messages (enforced via `commitlint` + `husky`).
3. Run `npm run lint && npm run build && npm test` before opening a PR.
4. Open a PR against `main`; CI must pass and at least one teammate must approve
   before merging.

## License

Academic project for Desarrollo de Software (UCAB). No license has been chosen yet;
all rights reserved by the team until one is added.
