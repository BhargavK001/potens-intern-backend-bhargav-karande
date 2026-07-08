# Engineering Design & Execution Plan

> **Project:** Tamper-Evident Append-Only Audit Log System  
> **Assignment:** Potens Backend Internship – Q1  
> **Author:** Bhargav Karande  
> **Version:** 1.0  
> **Status:** Planning

---

# 1. Overview

This document outlines the engineering approach for building a production-inspired **Tamper-Evident Append-Only Audit Log System**.

Rather than treating this as a coding assignment, the goal is to approach it like a real software project by planning the architecture, identifying risks, documenting design decisions, and executing the implementation in structured phases.

The project consists of:

- A production-oriented REST API
- A lightweight frontend for interacting with the API
- Complete documentation
- Incremental Git history
- Testing
- Clear engineering decisions

---

# 2. Problem Statement

Audit logs are fundamental to systems where accountability and traceability matter.

Traditional logging systems often store records without protecting them from modification. If an attacker or privileged user edits historical records, the integrity of the audit trail is lost.

The challenge is to build a logging service where:

- Logs can only be appended.
- Existing logs cannot be modified.
- Existing logs cannot be deleted.
- Any tampering can be detected immediately.

This is achieved by cryptographically linking every log entry to the previous one using SHA-256 hashing.

---

# 3. Project Objectives

The project aims to:

- Build an immutable append-only logging service.
- Detect any modification of stored records.
- Expose clean and well-designed REST APIs.
- Follow production-grade engineering practices.
- Demonstrate clean architecture and maintainable code.
- Provide a simple frontend for interacting with the backend.
- Deliver complete documentation and tests.

---

# 4. System Overview

```
                 User
                   │
                   ▼
        Next.js Frontend Application
                   │
             REST API Requests
                   │
                   ▼
       Express + TypeScript Backend
                   │
 ┌─────────────────────────────────────┐
 │ Authentication                      │
 │ Validation                          │
 │ Rate Limiting                       │
 │ Helmet Security                     │
 │ Structured Logging                  │
 │ Error Handling                      │
 └─────────────────────────────────────┘
                   │
            Business Logic Layer
                   │
          SHA-256 Hash Generation
                   │
              Prisma ORM
                   │
             PostgreSQL Database
```

---

# 5. Technology Stack

## Backend

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- Zod
- Pino
- Helmet
- CORS
- express-rate-limit
- Node.js Crypto (SHA-256)
- dotenv
- Vitest
- Supertest
- ESLint
- Prettier

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Axios
- TanStack Query
- React Hook Form
- Zod
- Sonner
- Lucide React

---

# 6. Engineering Principles

The following principles guide every implementation decision.

- Security by default.
- Keep business logic separate from routing.
- Validate every external input.
- Build modular and reusable components.
- Prefer readability over clever implementations.
- Keep API responses consistent.
- Handle failures explicitly.
- Document important decisions.
- Write code for future maintainers.
- Build incrementally with small commits.

---

# 7. Production Considerations

Although this is an internship assignment, the implementation should reflect production-quality engineering practices.

## Security

- API Key Authentication
- Helmet Security Headers
- Configured CORS
- Environment Variables
- Request Validation
- Rate Limiting

## Reliability

- Immutable data model
- Database transactions
- Centralized error handling
- Consistent API responses

## Maintainability

- Modular architecture
- Separation of concerns
- Reusable services
- Strong TypeScript typing
- Clear folder organization

## Observability

- Structured logging
- Request logging
- Error logging
- Response time logging

## User Experience

The frontend is intentionally lightweight and exists only to demonstrate backend functionality through a clean interface.

---

# 8. Frontend Scope

The frontend is **not** intended to be a complete product.

Its purpose is to make the backend easy to understand, test, and demonstrate.

Planned pages include:

- Dashboard
- Create Log
- View Logs
- Verify Chain
- Export Logs

The primary focus of the assignment remains the backend.

---

# 9. Risks & Engineering Decisions

## First Log Entry

### Problem

No previous hash exists.

### Decision

Use a predefined **GENESIS** hash.

---

## Concurrent Requests

### Problem

Multiple requests may attempt to append simultaneously.

### Decision

Use database transactions to preserve chain integrity.

---

## Invalid Input

### Problem

Malformed or incomplete requests.

### Decision

Reject requests during validation before reaching business logic.

---

## Database Failures

### Problem

Unexpected database errors.

### Decision

Return controlled error responses while logging diagnostic information.

---

## Tampered Database

### Problem

A stored record has been modified.

### Decision

Verification stops at the first broken entry and reports the failure.

---

## Duplicate Requests

### Problem

Clients resend the same request.

### Decision

Treat every request as a new immutable audit event.

---

# 10. Functional Requirements

The application must provide:

- Create immutable log entries
- Retrieve individual log entries
- Verify the complete hash chain
- Export filtered logs
- API key authentication
- Structured logging
- Rate limiting
- Database migrations

---

# 11. Non-Functional Requirements

The application should emphasize:

- Security
- Maintainability
- Reliability
- Scalability
- Performance
- Type Safety
- Testability
- Documentation

---

# 12. Development Roadmap

## Phase 1 — Planning

- Understand requirements
- Identify risks
- Finalize architecture
- Finalize technology stack

**Deliverable**

Project blueprint completed.

---

## Phase 2 — Backend Foundation

- Initialize project
- Configure TypeScript
- Configure Express
- Configure ESLint
- Configure Prettier
- Configure environment variables

**Deliverable**

Application boots successfully.

---

## Phase 3 — Database

- Configure PostgreSQL
- Configure Prisma
- Design schema
- Create migrations

**Deliverable**

Database ready.

---

## Phase 4 — Core Infrastructure

- Authentication
- Validation
- Logger
- Error Handler
- Helmet
- CORS
- Rate Limiter

**Deliverable**

Production-ready backend infrastructure.

---

## Phase 5 — Business Logic

- SHA-256 Hash Generation
- Create Log API
- Get Log API
- Verify Chain API
- Export API

**Deliverable**

All required backend features completed.

---

## Phase 6 — Frontend

- Initialize Next.js
- Build Dashboard
- Build Create Log page
- Build View Logs page
- Build Verify page
- Build Export page

**Deliverable**

Frontend integrated with backend.

---

## Phase 7 — Testing

- Unit Tests
- Integration Tests
- Manual API Testing

**Deliverable**

Core functionality verified.

---

## Phase 8 — Documentation

- README
- API Documentation
- AI Usage Log

**Deliverable**

Repository ready for review.

---

## Phase 9 — Final Review

- Code cleanup
- Folder review
- Remove dead code
- Review commit history
- Verify documentation

**Deliverable**

Submission-ready project.

---

# 13. Definition of Done

The project is complete only if:

- All required APIs are implemented.
- Logs are append-only.
- No update or delete operations exist.
- Hash chaining works correctly.
- Verification detects tampering.
- Frontend communicates with backend.
- Authentication is enforced.
- Validation exists on both client and server.
- Rate limiting works.
- Structured logging is implemented.
- Tests pass.
- Documentation is complete.
- Repository is ready for production-style review.

---

# 14. Submission Checklist

Before submission:

- [ ] Public GitHub repository
- [ ] Clean folder structure
- [ ] Incremental commit history
- [ ] Meaningful commit messages
- [ ] No secrets committed
- [ ] `.env.example` included
- [ ] Database migrations committed
- [ ] README completed
- [ ] AI Usage Log completed
- [ ] Final code review completed

---
