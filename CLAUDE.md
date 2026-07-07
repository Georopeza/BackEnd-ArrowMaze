# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Backend for **Arrow Maze**, a puzzle game where a board contains arrows (each occupying a head cell plus optional body cells) pointing in a fixed direction (UP/DOWN/LEFT/RIGHT). Clicking an arrow fires it: if its line of sight to the board edge is clear of other arrows, it exits the board and its cells become empty; otherwise nothing happens. A level is solved when all arrows have been fired out in some valid order.

The repository currently contains **only the domain layer** (Layer 1 of a Clean Architecture / DDD design). There is no HTTP server, controller, use-case/application layer, or persistence implementation yet — only pure TypeScript domain logic (entities, value objects, aggregates, domain services, repository *interfaces*/ports). Anything importing Express, an ORM, or other infrastructure does not belong under `src/domain`.

## Commands

- `npm test` — run the full Jest suite (`ts-jest`, Node environment).
- `npm run test:watch` — Jest in watch mode.
- Run a single test file: `npx jest src/domain/aggregates/Board.test.ts`
- Run tests matching a name: `npx jest -t "should_exit_arrow_successfully"`

There is no build/lint script defined in `package.json`; `tsc` can be invoked directly (`npx tsc --noEmit`) to type-check against `tsconfig.json` (strict mode, ES2022, CommonJS, rootDir `src`, outDir `dist`).

Test files live next to the code they test (`*.test.ts`), matched by `jest.config.js`'s `testMatch: ['**/*.test.ts']`.

## Architecture

### Two parallel/competing designs for the board — know which is current

- **`Board` (`src/domain/aggregates/Board.ts`)** is the **current, active Aggregate Root**. It holds a `Cell[][]` grid plus a separate `arrows: Arrow[]` list. Game logic operates primarily on the `Arrow` list (head position, direction, occupied body positions), not by walking the grid.
- **`BoardComponent` / `BoardGroup`** (`src/domain/entities/`) is a **deprecated Composite-pattern implementation** kept only for reference (per `AI_USAGE.md`). Do not extend it or wire new code through it.

### Cell hierarchy vs. Arrow entity — two different "arrow" representations

- `Cell` (abstract) → `ArrowCell`, `WallCell`, `EmptyCell`, `ExitCell` (`src/domain/entities/`). These are grid-cell *types*, created via `CellFactory` (a registrable factory keyed by string type name — extend by calling `.register()`, not by editing the switch/registry inline). `LevelDefinition`'s `board: Cell[][]` is built from these.
- `Arrow` (`src/domain/entities/Arrow.ts`) is a separate, richer runtime representation used by `Board`/`LevelActionService`: it has an `ArrowId`, a `headPosition`, a `direction`, and a list of `occupiedPositions` (its body). This is what actually gets queried/mutated during gameplay (`Board.findArrowAt`, `Board.clearPositions`, `Board.removeArrowById`).

When working on gameplay mechanics (firing, blocking, clearing), use the `Arrow`/`Board`/`LevelActionService` path. When working on level *authoring/definition* (`LevelDefinition.board`, `LevelBuilder`, `CellFactory`), you're in the `Cell[][]` path. These two models are not currently unified — a `LevelDefinition`'s static `Cell[][]` board is a different data shape than the `Arrow[]` list a `Board` aggregate operates on.

### Core gameplay rule implementations (line-of-sight)

The "can this arrow exit" rule (walk from the arrow outward in its direction; blocked if another arrow's head or body occupies a cell along the path; clear if you reach the board edge first) is implemented **twice, independently**, for two different purposes:

1. `LevelActionService.isPathClear` (`src/domain/services/LevelActionService.ts`) — operates on live `Board`/`Arrow` objects; used to actually execute a single interaction (`interactWithCell`).
2. `LevelSolvabilityValidator.canArrowExit` (`src/domain/services/LevelSolvabilityValidator.ts`) — operates on a plain DTO shape (`StructuredLevelJsonDto`/`ArrowPiece`, matching an external JSON level format) and does full DFS/backtracking (`solve`) over all firing orders to answer "does *any* sequence solve this level" — used for level design/validation, not for live play.

If you change the line-of-sight/blocking rule, check whether both implementations need the same fix.

### Design patterns in play (per `AI_USAGE.md`, still reflected in the code)

- **Factory Method**: `CellFactory` (registrable, extensible without modifying the class).
- **Builder**: `LevelBuilder` — incremental construction of `LevelDefinition` (`withDimensions`, `addCell`, `withConstraints`, `.build()`).
- **Template Method**: `BaseLevelProcessor.processAction` fixes the step order (validate → execute movement → score → check win); subclasses implement `validateAction`/`executeMovement` and may override the scoring/winning hooks. No concrete subclass exists yet in this repo.
- **Strategy**: `IScoreStrategy` passed into `LevelDefinition.calculateScore`.
- **Test-only Builder/Object Mother/API layer** under `src/domain/tests/`: `BoardTestBuilder` (fluent board construction for tests), `BoardObjectMother` (named canned scenarios), `BoardTestingAPI` (wraps `LevelActionService` with `interactAt`/`expectActionToSucceed`/`expectActionToFail`-style assertions). Prefer these over constructing `Board`/`Arrow` by hand in new tests.

### Repository ports (no implementations yet)

`ILevelRepository`, `IUserRepository`, `IProgressRepository` (`src/domain/repositories/`) and `IPasswordHasher` (`src/domain/services/`) are pure interfaces — DIP ports for a future infrastructure layer. Don't add framework/ORM-specific code here; implementations belong outside `src/domain` when that layer is created.

### Entity invariants worth knowing before editing

- `LevelDefinition` constructor validates: non-empty board, uniform row width, `maxMoves`/`maxTimeInSeconds` > 0, at least one `ExitCell`, at least one `ArrowCell`. Any code building a `LevelDefinition` (e.g. `LevelBuilder.build()`) must satisfy all of these or it throws.
- `PlayerProgress.updateScore` returns a *new* instance with the best-of-both values (max score, min moves, min time) — it does not mutate in place.
- `User` keeps `passwordHash` private; verify via `verifyPassword(password, hasher: IPasswordHasher)`, never compare the hash directly.
- `ArrowId` rejects values of length ≤ 1.
- `Board.addArrow` validates every position in the arrow (head + body) against `BoardDimensions` and throws if any are out of bounds.
