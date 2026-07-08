# Tamper-Evident Append-Only Audit Log System

## Project Overview
The **Tamper-Evident Append-Only Audit Log System** is a production-inspired, secure, and immutable ledger designed to store audit logs. Once written, these logs cannot be updated or deleted. Any unauthorized direct database alterations are instantly flagged through a server-side cryptographic verification engine that sequentially checks a chain of SHA-256 hashes linking each record to its predecessor.

---

## Features
*   **Immutable Storage**: A strictly append-only database layer with no `UPDATE` or `DELETE` capabilities.
*   **Cryptographic Verification**: A chain of SHA-256 hashes computed recursively over canonical payload sorting, checking full ledger integrity.
*   **API Key Protection**: Every endpoint is defended with header-based auth (`X-API-Key`).
*   **Concurrency Control**: Relational row locking (`FOR UPDATE`) within PostgreSQL transactions prevents hash chain branches under concurrent write bursts.
*   **Structured Observability**: Asynchronous JSON application logs powered by Pino.
*   **Fail-Fast Ingress validation**: Tight request parameter and schema validation using Zod.
*   **Compliance Export**: Filtered data extraction with clear subset limitations warnings.
*   **Interactive Demonstration Client**: A lightweight Next.js frontend showing dashboard telemetry, creation tools, verify commands, and export panels.

---

## Technology Stack
### Backend
*   **Runtime/Language**: Node.js & TypeScript (ESM)
*   **Web Framework**: Express.js
*   **Database & ORM**: PostgreSQL & Prisma ORM
*   **Validation**: Zod
*   **Logging**: Pino
*   **Security Headers**: Helmet & CORS
*   **Throttling**: express-rate-limit
*   **Testing**: Vitest & Supertest

### Frontend
*   **Framework**: Next.js (App Router) & React
*   **Language**: TypeScript
*   **Styles & UI**: Tailwind CSS & shadcn/ui
*   **API Client**: Axios & TanStack Query

---

## Folder Structure
```
.
├── .agents/                  # Workspace customization rules
│   └── AGENTS.md             # Custom engineering rules
├── backend/                  # API Backend Service
│   ├── src/
│   │   ├── config/           # Safe config & environment variable loader
│   │   ├── controllers/      # Route controllers (request/response orchestrators)
│   │   ├── lib/              # Client singletons (e.g. Prisma client)
│   │   ├── middleware/       # Rate limiting, auth, errors, security headers
│   │   ├── repositories/     # Append-only Prisma abstraction
│   │   ├── routes/           # REST routes assembly
│   │   ├── services/         # Cryptographic engine, verification, export
│   │   ├── tests/            # Vitest unit & integration test suites
│   │   ├── types/            # Shared interfaces & DTO definition types
│   │   ├── utils/            # Hash helpers & canonical serialization
│   │   ├── validators/       # Zod schemas for ingress parameters
│   │   ├── app.ts            # Application setup
│   │   └── server.ts         # Server bootstrap listener
│   ├── package.json
│   └── tsconfig.json
├── docs/                     # Detailed architectural specifications & logs
│   ├── 01_ENGINEERING_PLAN.md
│   ├── 02_DATABASE.md
│   ├── 03_ARCHITECTURE.md
│   ├── 04_API_REFERENCE.md
│   ├── 05_TESTING.md
│   ├── 06_AI_USAGE.md
│   └── TASKS.md              # Live project task tracking ledger
├── frontend/                 # Demonstration Client (Next.js)
```

---

## Installation

### Prerequisites
*   Node.js (>= 20.x recommended)
*   PostgreSQL instance

### Backend Setup
1. Navigate into the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## Environment Variables
Create a `.env` file in the `backend/` directory referencing `.env.example`:
```env
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/audit_log?schema=public"
API_KEY="your-secret-api-key"
NODE_ENV="development"
```

---

## Running the Project

### Development Server
Run the backend with automatic compilation and hot reloading:
```bash
cd backend
npm run dev
```

### Production Build
Build and run the compiled Javascript bundle:
```bash
cd backend
npm run build
npm start
```

---

## Database Setup
1. Verify PostgreSQL connection configuration inside `.env`.
2. Apply database schemas and trigger migration creation using Prisma:
   ```bash
   npx prisma migrate dev --name init
   ```
3. Generate client files:
   ```bash
   npx prisma generate
   ```

---

## API Documentation
The API base path is versioned under `/api/v1`. 

### Summary of Key Endpoints
*   **`GET /`**: Health check.
*   **`POST /api/v1/log`**: Appends an audit log. Protected by `X-API-Key`.
*   **`GET /api/v1/log/:id`**: Retrieves a single log entry. Protected by `X-API-Key`.
*   **`GET /api/v1/verify`**: Verifies cryptographic integrity of the entire chain. Protected by `X-API-Key`.
*   **`GET /api/v1/export`**: Administrative log export. Protected by `X-API-Key`.

For complete request details, payload schemas, and response DTO formats, see [04_API_REFERENCE.md](file:///c:/Users/Lenovo/Documents/GitHub/potens-intern-backend-bhargav-karande/docs/04_API_REFERENCE.md).

---

## Testing
Run automated unit and integration tests:
```bash
cd backend
npm run test
```

---

## Design Decisions
*   **Row-Level Locks**: Row locks (`FOR UPDATE`) on the table tail serialize concurrent appends, preventing hash chain forks.
*   **Predefined Genesis**: The first row links backwards to a constant string `"GENESIS"`.
*   **Canonical Serialization**: Payloads are sorted recursively by key prior to digest hashing, assuring identical output digests.
*   **Layer Separation**: Control flows unidirectionally (`Routes -> Controllers -> Services -> Repositories`), decoupling transport mechanisms from database drivers.

---

## Future Improvements
*   Docker container orchestrations.
*   OpenAPI auto-generation from Zod controllers.
*   Redis rate limiter caching.
*   Client asymmetrical payload signatures (non-repudiation key validation).

---

## AI Usage Log
All AI interaction details and prompts are logged in [06_AI_USAGE.md](file:///c:/Users/Lenovo/Documents/GitHub/potens-intern-backend-bhargav-karande/docs/06_AI_USAGE.md).
