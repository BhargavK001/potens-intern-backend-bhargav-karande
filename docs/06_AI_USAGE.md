# AI Usage Log

This document records the interactions and usage of AI tools (specifically Antigravity, a Gemini 3.5-powered agentic coding assistant) throughout the development of the **Tamper-Evident Append-Only Audit Log System**.

---

## Session Ledger

### Session 1: 2026-07-08
*   **Tasks Conducted**:
    *   Reviewed workspace constraints, custom rules in [.agents/AGENTS.md](file:///c:/Users/Lenovo/Documents/GitHub/potens-intern-backend-bhargav-karande/.agents/AGENTS.md), and engineering specifications.
    *   Created the backend directory structure under `backend/src/`.
    *   Configured ESM compilation settings by updating [backend/package.json](file:///c:/Users/Lenovo/Documents/GitHub/potens-intern-backend-bhargav-karande/backend/package.json) to use `type: module` and adding scripts (`dev`, `start`).
    *   Set up the Express application in [backend/src/app.ts](file:///c:/Users/Lenovo/Documents/GitHub/potens-intern-backend-bhargav-karande/backend/src/app.ts) with the root GET `/` health check endpoint.
    *   Programmed the server listener in [backend/src/server.ts](file:///c:/Users/Lenovo/Documents/GitHub/potens-intern-backend-bhargav-karande/backend/src/server.ts) on port 3000.
    *   Started the dev server and verified compilation + health checks locally using `curl`.
    *   Created the tracking ledger [docs/TASKS.md](file:///c:/Users/Lenovo/Documents/GitHub/potens-intern-backend-bhargav-karande/docs/TASKS.md).
*   **AI Prompt / Instructions**: User requested to review agent rules, structure directories, bootstrap Express app/server with health endpoint, and update project documentation.
*   **Engineering Rationale**: Guided folder structure selection according to the project's layered monolithic design. Enabled ESM module resolution in `package.json` to resolve verbatim module syntax issues in `tsconfig.json`. Used a background runner process for dev validation to prevent blocking interactive user prompt loops.

### Session 2: 2026-07-08
*   **Tasks Conducted**:
    *   Created Milestone 2 implementation plan based on database blueprints.
    *   Installed Prisma CLI and Prisma Client library.
    *   Initialized Prisma schema and configuration structure, adapting to Prisma v7 layout by managing connection settings in `prisma.config.ts`.
    *   Wrote `LogEntry` relational database model with correct types, UUID mapping, `JsonB` payload, and specific index rules. Set `actor`/`action` column lengths to 100 characters to match documented validation.
    *   Generated initial DB schema migration script named `initial_schema` and pushed to local database `potens_audit_log`.
    *   Adjusted `prisma.config.ts` connection cast properties to resolve TypeScript compiler strict mode constraints (`exactOptionalPropertyTypes`).
    *   Verified full TypeScript type compilation and API health server check validation.
*   **AI Prompt / Instructions**: User requested implementation of database foundation, setting up PostgreSQL/Prisma, writing models, and generating migration named `initial_schema`.
*   **Engineering Rationale**: Maintained complete separation of DB config mapping out of schema parameters to comply with newer Prisma 7 requirements. Ensured database column widths match Zod input schema validations to enforce structural parity. Resolved strict TypeScript optional assignment check issues.

### Session 3: 2026-07-08
*   **Tasks Conducted**:
    *   Formulated Milestone 3 implementation plan dividing configurations into two separate phases (Phase 3A and Phase 3B).
    *   Installed and integrated security and logging tools: `cors`, `helmet`, `express-rate-limit`, `pino`, `pino-http`, and `zod`. Also added `pino-pretty` to devDependencies.
    *   Created `src/config/env.ts` verifying `PORT`, `DATABASE_URL`, `API_KEY`, `FRONTEND_URL`, and `NODE_ENV` parameters.
    *   Configured the centralized Pino logger inside `src/lib/logger.ts`, constructing configuration objects dynamically to conform with `exactOptionalPropertyTypes: true` compiler checking.
    *   Programmed the request logging interceptor using `pino-http` (generating `x-request-id` with `crypto.randomUUID()`) inside `src/middleware/requestLogger.ts`.
    *   Implemented `src/utils/ApiError.ts` and `src/utils/apiResponse.ts` to standardize response formats.
    *   Programmed global rate-limiting middleware in `src/middleware/rateLimiter.ts` throttling to 100 requests per 15 minutes.
    *   Implemented centralized Express error interceptor in `src/middleware/errorHandler.ts` and unmapped handler in `src/middleware/notFoundHandler.ts`.
    *   Assembled Helmet, CORS origin configuration, rate limiters, logging, health check routes, and error managers inside `src/app.ts` in strict sequence.
    *   Verified TypeScript checks and confirmed headers (CSP, CORS matching frontend, rate limit metadata, request ID tracing) return properly under local validation tests.
*   **AI Prompt / Instructions**: User requested implementation of core app infrastructure (Helmet, CORS, Pino logging, error handler, response helpers, limiters) using strict Zod config checks and clean middleware execution order, separating auth setup into a later phase.
*   **Engineering Rationale**: Wrapped the `pino-http` logger in a custom handler to inject request ID headers cleanly into HTTP responses without types discrepancies. Leveraged Zod issues mapping to print environment configuration bugs clearly on startup. Restructured the middleware pipeline so that incoming traffic is logged immediately before any defensive filters can drop/block it.

### Session 4: 2026-07-08
*   **Tasks Conducted**:
    *   Wrote custom timing-safe API Key validation middleware in `src/middleware/apiKeyAuth.ts`.
    *   Plugged `apiKeyAuth` globally onto `/api/v1` routes in `src/app.ts`, ensuring the health check route `/` remains open and public.
    *   Verified authentication rejects missing or bad keys with HTTP `401 Unauthorized` structured payloads, and successfully forwards authenticated requests.
    *   Updated task tracking ledgers [docs/TASKS.md](file:///c:/Users/Lenovo/Documents/GitHub/potens-intern-backend-bhargav-karande/docs/TASKS.md) and execution history walkthroughs.
*   **AI Prompt / Instructions**: User requested implementation of timing-safe API key validation on all versioned routes as Phase 3B.
*   **Engineering Rationale**: Implemented SHA-256 hashing on both client and server keys prior to utilizing `crypto.timingSafeEqual()` comparison. This standardizes length buffers, resolving potential timing attack leakage vectors and preventing runtime crashes due to key length differences.

### Session 5: 2026-07-08
*   **Tasks Conducted**:
    *   Formulated Milestone 4A implementation plan focusing purely on shared primitives (Prisma singleton, domain types, Hash utility).
    *   Instantiated global PrismaClient singleton in `src/lib/prisma.ts` with conditional logs settings (query/warn/error logs in dev, only errors in prod).
    *   Defined strongly-typed domain structures (`CreateLogInput`, `VerificationResult`, `ExportFilters` utilising Prisma's standard `JsonValue` inputs) in `src/types/log.ts`.
    *   Programmed deterministic key-sorting payload serialization and lowercase 64-char hexadecimal SHA-256 hash generators in `src/lib/hash.ts`.
    *   Verified compiler type safety checks (`npx tsc --noEmit`) and verified cryptographic primitives using temporary execution script checking determinism, nesting, lists, and formatting.
    *   Cleaned temporary verification assets and updated Tasks log templates.
*   **AI Prompt / Instructions**: User requested split of Milestone 4, refactoring HashService to lib/hash.ts, mapping payload strictly to JsonValue, ensuring hash outputs are lowercase 64-character hex format, and updating AI logs.
*   **Engineering Rationale**: Constructed a recursive serialization processor to sort JSON object properties alphabetically. This guarantees signature consistency for client objects with varying key insertion orders. Cached the database client in Node's global object scope in dev mode to prevent database connection leakage during compilation restarts.

