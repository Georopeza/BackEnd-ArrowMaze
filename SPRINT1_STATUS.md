# Arrow Maze — Estado del proyecto (post Sprint 1, backend)

> Lee esto antes de tocar código. Resume qué se hizo, qué falta, y por qué se tomó cada decisión, para que cualquiera del equipo pueda seguir sin tener que re-preguntar el contexto. El plan completo de Sprint 1 (con comandos exactos) está en el historial de commits de `feature/backend-foundations`; este documento es el resumen ejecutivo + lo que sigue.

**Última actualización:** 08-jul-2026 · **Entrega final del proyecto:** 23-jul-2026 (prorrogada; el enunciado original decía 03-jul-2026)

## Contexto rápido

El equipo lleva el proyecto "Arrow Maze" (app Flutter en [Mianjoy/Arrow-Maze-Escape-Puzzle](https://github.com/Mianjoy/Arrow-Maze-Escape-Puzzle) + este backend). Antes de Sprint 1, este repo solo tenía la capa de dominio (Semana 1): entidades, value objects, Factory/Composite — sin framework HTTP, sin auth, sin tests, sin CI. Sprint 1 cerró ese vacío de fundamentos.

## ✅ Qué se hizo en Sprint 1 (rama `feature/backend-foundations`)

Commits, de más antiguo a más reciente:

| Commit | Qué hace |
|---|---|
| `fb7728b` | Destrackea `node_modules/` (estaba comiteado por error desde el "Initial commit", 5000+ archivos) + agrega `.gitignore` |
| `3114b3a` | Elige **Express + TypeScript** como framework (no NestJS, por simplicidad dado el tiempo del equipo). Agrega dependencias, `tsconfig.json`, `jest.config.ts`, `.eslintrc.cjs` |
| `558ea7f` | `src/infrastructure/http/server.ts` (composition root de Express), `GET /health`, y los **2 aspectos AOP** de Sprint 1: `requestLoggerMiddleware` (logging) y `errorHandlerMiddleware` (manejo centralizado de excepciones). Swagger UI en `/docs` |
| `0c02aad` | `InMemoryUserRepository`, `InMemoryLevelRepository`, `InMemoryProgressRepository` — implementan los 3 puertos de repositorio ya existentes, sin comprometerse aún a una BD concreta |
| `b2c9bb1` | `docs/contract/level.contract.ts` (`StructuredLevelJsonDto`, contrato acordado con el equipo de frontend) + `src/infrastructure/mappers/LevelJsonMapper.ts` que lo traduce a `LevelDefinition` real usando `LevelBuilder`/`CellFactory`. También agrega `Difficulty.EXPERT` (faltaba, el frontend ya tiene 4 niveles de dificultad) |
| `5b5d660` | Primeras pruebas: `ArrowCell.spec.ts` (dominio), `LevelJsonMapper.spec.ts` (mapeo del contrato), `health.spec.ts` (integración) |
| `a53c219` | CI: `.github/workflows/ci.yml` (lint + build + test en cada PR/push a `main`) |
| `cb33423`, `1f568a1`, `897701a` | Documentación: `AI_USAGE.md` actualizado, `README.md` completo (12 secciones obligatorias), diagrama de capas Clean Architecture (`docs/architecture/clean-architecture.mmd`, corregido tras un error de sintaxis Mermaid) |

**Todo esto se verificó en vivo, no solo se revisó a mano:** `npm run build`, `npm run lint`, `npm test` (6/6 tests) y `npm run dev` (con `curl http://localhost:3000/health` respondiendo `{"status":"ok"}`) — todos corridos y confirmados en verde antes de comitear.

También se borraron las ramas remotas muertas `app`, `domain`, `infraestructure`, `tests` (eran idénticas a `main`, nunca tuvieron trabajo real).

## 🔲 Qué falta para cerrar Sprint 1

1. **Abrir/revisar/fusionar el PR**: `feature/backend-foundations` → `main`. Link para abrirlo: https://github.com/Georopeza/BackEnd-ArrowMaze/pull/new/feature/backend-foundations
2. **Confirmar CI en verde** en la pestaña Actions del PR (el workflow corre `npm ci && npm run lint && npm run build && npm test`).
3. **Protección de rama en `main`** (status check obligatorio + 1 aprobación) — necesita permisos de admin del repo en GitHub Settings → Branches. Nadie lo ha configurado todavía.

## 🗺️ Qué sigue después (Sprint 2, 12–17 jul)

Con los fundamentos ya puestos, Sprint 2 es donde se construye la funcionalidad real:

- **Casos de uso** en `src/application/use-cases/` (hoy solo tiene un `.gitkeep`): mover/rotar flecha (patrones **State** + **Factory**), registrar usuario, login, guardar progreso.
- **Endpoints**: `POST /auth/register`, `POST /auth/login` (JWT — `jsonwebtoken`/`bcrypt` ya están instalados desde Sprint 1, solo falta usarlos), `GET/POST /progress`, `GET /leaderboard`, `GET /levels` (usando el `LevelJsonMapper` que ya existe y ya está probado).
- **Tercer aspecto AOP**: autorización (guard que valida el JWT en rutas protegidas) — con esto se completan los 3 aspectos exigidos por la rúbrica.
- **Persistencia real**: decidir si se reemplazan los `InMemoryXRepository` por una BD (Postgres/SQLite/Mongo) — no bloquea nada porque todo ya depende de las interfaces `I*Repository`, es un cambio aislado a `infrastructure/persistence/`.
- Actualizar `openapi.json` con los endpoints nuevos.

**Sprint 3** (18–21 jul): integración real con el frontend, cobertura de tests más completa (incluyendo tests de contrato del `LevelJsonMapper` contra niveles reales), diagramas finales.
**Sprint 4** (22–23 jul): build final, documentación pulida, ensayo de defensa individual.

## Cómo arrancar a trabajar en este repo

```bash
git checkout feature/backend-foundations   # o main, una vez fusionado
npm install
cp .env.example .env
npm run dev       # http://localhost:3000, GET /health, Swagger en /docs
npm test          # antes de cada commit
npm run lint
```

## Convenciones que hay que seguir (acordadas para todo el proyecto)

- **Comentarios en español** en cada función/método nuevo, no solo en las complejas.
- **`AI_USAGE.md` se actualiza en el momento**, no se deja acumulado — cada tarea con asistencia de IA se documenta ahí mismo (tarea, herramienta, prompt, resultado, ajustes del equipo, lecciones aprendidas), siguiendo el formato ya usado en las 3 consultas existentes.
- **Conventional Commits** (`feat(scope): ...`, `fix(scope): ...`, `docs: ...`, `test: ...`, `ci: ...`, `chore: ...`) — ya verificado que todos los commits de Sprint 1 lo cumplen.
- El contrato `StructuredLevelJsonDto` (`docs/contract/level.contract.ts`) es la **única fuente de verdad** para el formato de niveles compartido con el frontend — si hay que cambiarlo, avisar al equipo de frontend antes, no solo cambiarlo aquí.

## Decisiones y hallazgos importantes de Sprint 1 (para no repetir la discusión)

- **Express, no NestJS**: decisión explícita por simplicidad/tiempo, no por limitación técnica. Si Sprint 2 se complica mucho con DI manual, se puede reconsiderar, pero implicaría reescribir `server.ts`.
- **`node_modules` estaba comiteado por error** desde el commit inicial (antes de Sprint 1) — ya se corrigió, pero si alguien clona una copia vieja del repo, va a ver ese historial pesado; no hace falta hacer nada al respecto, es solo historia.
- **`Difficulty.EXPERT`** se agregó al backend porque el frontend ya tenía 4 niveles de dificultad (`easy/medium/hard/expert`) y el backend solo tenía 3 — si alguien ve `Difficulty` con 4 valores y se pregunta por qué, es por esto.
- El endpoint HTTP `GET /levels` **todavía no existe** — el `LevelJsonMapper` está listo y probado, pero exponerlo por HTTP es Sprint 2 a propósito (se decidió no adelantar ese trabajo en Sprint 1 para no desviar el foco de "fundamentos").
