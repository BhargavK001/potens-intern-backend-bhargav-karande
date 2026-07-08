# Task Tracking Ledger

This document tracks the incremental progress of the **Tamper-Evident Append-Only Audit Log System** implementation.

---

## Task List

### Phase 1 — Planning
- [x] Understand requirements & assignment constraints
- [x] Identify risks & outline architectural mitigations
- [x] Design single-table schema and cryptographic chaining algorithm
- [x] Complete engineering design plan

### Phase 2 — Backend Foundation
- [x] Initialize backend project directory with `package.json`
- [x] Configure TypeScript compiler settings (`tsconfig.json`) for NodeNext & ESM
- [x] Setup Express app structure in `src/app.ts` & `src/server.ts`
- [x] Implement initial health check endpoint `GET /`
- [ ] Configure ESLint standards
- [ ] Configure Prettier rules
- [x] Setup environment variables template (`.env.example`)

### Phase 3 — Database & Storage
- [x] Configure PostgreSQL database connection
- [x] Initialize Prisma ORM client
- [x] Design Prisma schema with `LogEntry` model & indexing rules
- [x] Generate and apply database migrations

### Phase 4 — Core Infrastructure Middleware
- [x] Implement `X-API-Key` authentication middleware
- [x] Setup Pino structured logging middleware (request tracking, timing, error logs)
- [x] Setup Helmet for security header hardening
- [x] Configure CORS policy origin checks
- [x] Configure Rate Limiter for write endpoints (`POST /api/v1/log`)
- [x] Implement centralized Express error handler middleware

### Phase 5 — Business Logic & Cryptographic Engine
- [x] Implement deterministic canonical JSON payload sorting (`canonicalize` / `serializePayload`)
- [x] Build SHA-256 hash generator helper (`computeLogHash`)
- [x] Implement `LogRepository` / `AuditLogRepository` (strictly append-only persistence layer)
- [ ] Build `LogService` to orchestrate hashing & chain verification
- [ ] Implement `POST /api/v1/log` (Create Log Entry)
- [ ] Implement `GET /api/v1/log/:id` (Retrieve Single Log)
- [ ] Implement `GET /api/v1/verify` (Ledger Hash Chain Verification)
- [ ] Implement `GET /api/v1/export` (Filtered Logs Extraction)

### Phase 6 — Frontend Demonstration Client
- [ ] Initialize Next.js app with Tailwind CSS & shadcn/ui
- [ ] Setup Axios client with automated `X-API-Key` header injection
- [ ] Build Dashboard dashboard page
- [ ] Implement Create Log interface with client validation
- [ ] Implement View Logs table with detailed modal viewer
- [ ] Implement Verify Chain visual report page
- [ ] Implement Export Logs utility with filter options

### Phase 7 — Testing & Verification
- [ ] Write backend unit tests for hashing, canonicalization, and repository locks
- [ ] Write integration tests for API endpoints using Vitest & Supertest
- [ ] Perform manual end-to-end user flow testing

### Phase 8 — Documentation & Deliverables
- [/] Complete root README documentation
- [ ] Update API reference documentation
- [/] Update AI usage log
- [ ] Prepare repository for final submission

### Phase 9 — Final Review
- [ ] Code formatting & linting checks
- [ ] Remove unused imports/dead code
- [ ] Verify database migration tree
- [ ] Verify test coverage criteria
