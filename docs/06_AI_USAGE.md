This document records the interactions and usage of AI tools throughout the development of the **Tamper-Evident Append-Only Audit Log System**.

### AI Tools & Workflow
From the start of the project, a multi-LLM engineering pipeline was utilized for all milestones:
1. Prompts and implementation plans were generated using **Claude Sonnet** and **Claude Opus**.
2. Architectural decisions, syntax constraints, and framework configurations were verified via **Perplexity**.
3. Prompts and approved implement directives were supplied to **Antigravity IDE (Gemini)** to build, compile, and run the code.

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

### Session 6: 2026-07-08
*   **Tasks Conducted**:
    *   Formulated Milestone 4B implementation plan targeting a class-based, pure persistence repository `AuditLogRepository` keeping transactional strategy out of persistence code.
    *   Programmed class-based repository in `src/repositories/AuditLogRepository.ts` standardizing connection client signatures to `PrismaClient | Prisma.TransactionClient` for consistent transactional operations.
    *   Installed database connector dependencies (`pg` and `@prisma/adapter-pg`) to ensure compatibility with Prisma 7 configurations.
    *   Configured the Pg driver adapter connection manager in `src/lib/prisma.ts` resolving compilation type errors.
    *   Verified repository persistence logic using transaction-wrapped test script checking tail lookups, insertions, chronological orders, ID matching, dynamic filters, and prohibited mutations. Verified transaction rolled back cleanly leaving database untouched.
    *   Updated TASKS roadmap lists and updated AI session notes.
*   **AI Prompt / Instructions**: User requested renaming to AuditLogRepository, standardizing engine client variables, keeping raw SQL FOR UPDATE operations out of repository files, and updating log structures.
*   **Engineering Rationale**: Relocated locking behaviors and raw SQL scripts to the upcoming Service layer (Milestone 4C) to preserve strict separation of concerns between business strategy and data retrieval. Imported Types and Model interfaces using ESM type imports to prevent compiled Node runtime SyntaxError bugs.

### Session 7: 2026-07-08
*   **Tasks Conducted**:
    *   Updated database schema in `prisma/schema.prisma` converting `previousHash` column from `Char(64)` to `VarChar(64)` to store exact values like `"GENESIS"` without space-padding side effects while preserving `hash` column as fixed-length `Char(64)`.
    *   Applied Prisma migration `change_previous_hash_to_varchar` (`20260708075625_change_previous_hash_to_varchar`).
    *   Implemented class-based `LogService` in `src/services/LogService.ts` encapsulating transaction boundaries (`prismaInstance.$transaction`) around log lookups, canonical payload serialization, cryptographic hash computation, and append-only database insertion.
    *   Verified `LogService` orchestration via automated tests confirming GENESIS hash handling, hash chaining linking, timestamp verification parity, payload canonicalization across unordered keys, transaction rollback on failure, and repository immutability.
    *   Verified strict TypeScript type safety (`npx tsc --noEmit`) and updated documentation ledgers.
*   **AI Prompt / Instructions**: User requested implementation of Milestone 4C (`LogService`), changing schema column `previousHash` to VARCHAR(64), encapsulating transactions within the service layer, and updating documentation.
*   **Engineering Rationale**: Maintained transaction boundaries inside `LogService.create` to ensure sequential consistency when extending the audit log chain. Ensured a single `Date` instance is generated before serialization/hashing and persisted to database to guarantee exact timestamp parity for cryptographic verification.

### Session 8: 2026-07-08
*   **Tasks Conducted**:
    *   Formulated Milestone 5A implementation plan for the Request Validation Layer.
    *   Created Zod schema in `backend/src/schemas/auditLog.schema.ts` to validate creation fields: actor, action, and payload. Set strict rules on string formats, character lengths, and explicit object refinements to reject arrays and null values.
    *   Programmed reusable validation middleware in `backend/src/middleware/validate.ts` supporting validation of request body, query, and params. Replaced request fields with validated Zod outputs on success.
    *   Mapped Zod errors to centralized `ApiError` format (status 400, code `VALIDATION_ERROR`) and propagated failures via `next()`.
    *   Verified schemas and middleware behavior using temporary test script verifying happy paths, empty parameters, null/array properties, unexpected keys, and error conversions.
    *   Ensured full TypeScript type compilation check (`npx tsc --noEmit`) and removed temporary verification files.
    *   Updated TASKS trackers, system architecture schemas mapping, and AI usage ledger logs.
*   **AI Prompt / Instructions**: User requested implementation of Milestone 5A request validation layer without permanent test dependencies, including reusable middleware, Zod schemas, payload structure refinements, error mapping, and updating files documentation.
*   **Engineering Rationale**: Implemented payload refinement verification specifically checking type is object, not null, and not an array, matching the exact boundary constraints. Cast route parameter and query outputs to `any` inside the generic middleware to conform with Express typings without compile-time complaints. Used direct truthiness assertions in verification scripts to bypass compiler literal type-narrowing warnings.

### Session 9: 2026-07-08
*   **Tasks Conducted**:
    *   Formulated Milestone 5B implementation plan for the `POST /api/v1/log` creation endpoint.
    *   Created thin controller `AuditLogController` in `backend/src/controllers/AuditLogController.ts` mapped strictly to extract parameters, call `LogService`, and return success with status `201 Created` using the existing `ApiResponse.success` helper. No business, hashing, or validation code was added to the controller.
    *   Configured versioned routing in `backend/src/routes/auditLog.routes.ts` instantiating dependencies exactly once at startup (Dependency Injection) and mapping the controller create method under the `validate` middleware.
    *   Created `backend/src/routes/index.ts` to aggregate domain routes and mounted it under `/api/v1` in `backend/src/app.ts` with global authentication and rate limiting executing beforehand.
    *   Verified the endpoint execution pipeline (`apiKeyAuth` -> `globalLimiter` -> `validate` -> `AuditLogController.create`) using a temporary script verifying database persistence, trimming, API key errors, validation failures, and hash chain link linking (`Entry2.previousHash === Entry1.hash`).
    *   Successfully ran TypeScript type checks (`npx tsc --noEmit`) and removed temporary testing scripts.
    *   Updated the Task tracker ledger and AI Session logs.
*   **AI Prompt / Instructions**: User requested implementation of Milestone 5B: Create Audit Log Endpoint mapping dependencies once at route startup, enforcing thin controllers, versioned routing mapped to app.ts, using existing Response Helper, executing in correct pipeline sequence, verifying database persistence and preceding hash linking, compiling typescript, and logging AI actions.
*   **Engineering Rationale**: Bound the controller methods using arrow functions inside routes to preserve instance `this` contexts. Implemented a zero-dependency local network verification script using Node's native `http.createServer` and global `fetch` API, enabling integration checks against the database without installing extra npm devDependencies.

### Session 10: 2026-07-08
*   **Tasks Conducted**:
    *   Implemented collection and single-resource retrieval endpoints (`GET /api/v1/logs` and `GET /api/v1/logs/:id`) using Zod schemas for query/parameter validation. Added `getAll` and `getById` handlers to `AuditLogController` and updated `LogService`.
    *   Implemented cryptographic chain verification service (`ChainVerificationService.ts` and `GET /api/v1/verify` endpoint) running in $O(n)$ time and $O(1)$ memory. Sequentially validates hash links, recomputes canonical hashes, and halts on the first mismatch, providing diagnostic counts.
    *   Implemented administrative log export endpoints (`GET /api/v1/export`) supporting CSV and JSON formats. Integrated spreadsheet formula injection protection, UTF-8 BOM prefixes, safe Windows filenames, and custom data formats in `ExportService.ts`.
    *   Implemented a permanent automated integration test suite using **Vitest** and **Supertest** inside `backend/src/tests/` running against an isolated PostgreSQL test database (`potens_audit_log_test`). Wrote helper utilities and 35 comprehensive test cases verifying validation, auth, CRUD, verification, exports, and test independence.
*   **AI Prompt / Instructions**: User requested implementation of read endpoints, verification logic, exports (JSON/CSV with BOM/injection escaping/safe filenames), and an automated test suite (Vitest + Supertest, isolated test DB, modular helpers, endpoint-based seeding, duplicate hash assertions).
*   **Engineering Rationale**: Implemented database isolation during tests by overriding connection parameters conditionally when `NODE_ENV === 'test'`. Suppressed request logging noise during testing. Avoided concurrent database conflicts by forcing Vitest to execute sequentially. Designed `ExportService` to prevent Excel formula execution by prefixing `=, +, -, @` cells with single quotes.

