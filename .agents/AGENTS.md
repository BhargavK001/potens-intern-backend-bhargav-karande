# Tamper-Evident Append-Only Audit Log System - Engineering Rules

These rules apply to the entire project and must be followed for every implementation, modification, refactor, and review.

---

# 1. Engineering Philosophy

Build this project as though it will be deployed to production and maintained by another engineer.

Prioritize:

- Correctness over cleverness.
- Simplicity over unnecessary abstraction.
- Readability over writing fewer lines of code.
- Security by default.
- Maintainability over shortcuts.
- Explicit design decisions.
- Long-term code quality instead of temporary fixes.

Every implementation should have a clear reason to exist.

Avoid adding features or dependencies that do not directly improve the project or satisfy the assignment requirements.

---

# 2. Think Before Coding

Before implementing any feature:

1. Fully understand the requirement.
2. Identify possible edge cases.
3. Consider how the feature fits into the existing architecture.
4. Prefer extending existing abstractions instead of introducing unnecessary new ones.
5. Create an implementation plan before writing code for any non-trivial task.

Never start coding immediately without understanding the problem.

---

# 3. Immutable Audit Log Architecture

The LogEntry table is strictly append-only.

Never implement UPDATE or DELETE operations for audit log records.

Existing log entries must remain immutable after creation.

Only INSERT and READ operations are allowed for audit logs.

Each log entry must contain:

- Actor
- Action
- Payload
- Previous Hash
- Current Hash
- Timestamp

Hash Generation

Generate hashes using a deterministic order:

SHA256(
previousHash +
actor +
action +
serializedPayload +
createdAt
)

Payload serialization must always be deterministic.

Concurrency

Use database transactions whenever appending logs to preserve hash chain integrity during concurrent requests.

Genesis Entry

The very first log entry must use a predefined GENESIS hash as its previous hash.

---

# 4. Project Architecture

Follow a modular architecture.

Business logic must never exist inside route handlers.

Recommended structure:

controllers/
services/
repositories/
routes/
middlewares/
validators/
utils/
config/
types/
tests/

Responsibilities

Routes
- Define API endpoints only.

Controllers
- Receive requests and call services.

Services
- Business logic.

Repositories
- Database interaction through Prisma.

Utilities
- Hash generation, helper functions.

Middleware
- Authentication
- Validation
- Error handling
- Logging
- Rate limiting

---

# 5. TypeScript Standards

- Enable strict mode.
- Never use any.
- Use proper interfaces and types.
- Prefer readonly where appropriate.
- Use enums or string unions when applicable.
- Avoid type assertions unless absolutely necessary.
- Ensure complete type safety throughout the project.

---

# 6. Database Rules

Use PostgreSQL with Prisma ORM.

Rules

- Never execute raw SQL unless absolutely necessary.
- Always use Prisma.
- Commit database migrations.
- Use transactions where chain integrity matters.
- Avoid duplicate database queries.
- Keep database operations inside repository or service layers.

---

# 7. API Design Standards

Follow RESTful conventions.

Requirements

- Use proper HTTP methods.
- Use appropriate HTTP status codes.
- Return consistent JSON responses.
- Validate all inputs.
- Never expose stack traces.
- Return meaningful error messages.
- Keep endpoints predictable and consistent.

---

# 8. Validation

Every external input must be validated before reaching business logic.

Validate:

- Request Body
- Route Parameters
- Query Parameters

Use Zod for validation.

Never trust client input.

---

# 9. Security

Every API endpoint must be protected.

Requirements

- API Key Authentication
- Helmet Security Headers
- Configured CORS
- Rate Limiting
- Environment Variables
- .env.example

Never hardcode:

- Secrets
- API Keys
- Database URLs
- Tokens

---

# 10. Logging & Observability

Use Pino for structured logging.

Every request should log:

- Timestamp
- Request ID
- HTTP Method
- Route
- Status Code
- Response Time

Errors should log:

- Request ID
- Error Message
- Stack Trace
- Context

Never expose internal implementation details to clients.

---

# 11. Error Handling

Use centralized Express error middleware.

Rules

- Handle all unexpected errors.
- Return consistent JSON responses.
- Log complete diagnostic information internally.
- Never crash the application because of unhandled exceptions.

---

# 12. Frontend Standards

Technology

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

Purpose

The frontend exists only to demonstrate backend functionality.

Focus on:

- Dashboard
- Create Log
- View Logs
- Verify Chain
- Export Logs

Do not over-engineer the frontend.

Prioritize functionality, clarity, and responsiveness.

---

# 13. Code Quality

Write production-quality code.

Rules

- Solve the root cause instead of applying temporary fixes.
- Never patch problems without understanding them.
- Prefer reusable solutions.
- Avoid duplicated code.
- Keep functions focused on one responsibility.
- Keep files reasonably sized.
- Remove dead code immediately.
- Remove unused imports.
- Remove unused variables.
- Remove commented-out code.
- Prefer descriptive names.
- Avoid deeply nested logic.
- Keep code easy to understand.

---

# 14. Comments

Comments should explain WHY.

Code should explain WHAT.

Good comments explain:

- Design decisions
- Business rules
- Edge cases
- Architectural reasoning
- Non-obvious implementations

Do NOT write comments like:

// Loop through logs

// Increment counter

// Create object

// Call API

Instead write comments such as:

// The first log uses a predefined GENESIS hash because no previous entry exists.

// Transactions prevent concurrent requests from producing conflicting hash chains.

If code needs obvious comments, rewrite the code instead.

---

# 15. Engineering Workflow

Implement one logical feature at a time.

Each feature should be fully completed before starting another.

Avoid partially implemented functionality.

After completing every feature:

- Review the implementation.
- Verify architecture.
- Remove duplication.
- Check type safety.
- Verify error handling.
- Verify validation.
- Ensure formatting passes.
- Ensure linting passes.
- Confirm existing functionality still works.

A task is not complete until it has been reviewed.

---

# 16. Testing

Write appropriate tests using:

- Vitest
- Supertest

Every feature should verify:

- Happy paths
- Validation failures
- Error handling
- Edge cases

Ensure new code does not break existing functionality.

---

# 17. Documentation

Documentation is part of the implementation.

Whenever functionality changes:

- Update README.
- Update API documentation.
- Update architecture documentation.
- Update database documentation if required.
- Document important design decisions.
- Document assumptions.
- Document limitations.

README should always include:

- Project Overview
- Features
- Technology Stack
- Folder Structure
- Installation
- Environment Variables
- Running the Project
- Database Setup
- API Documentation
- Testing
- Design Decisions
- Future Improvements
- AI Usage Log

Documentation should always reflect the current implementation.

---

# 18. Git Workflow

Work incrementally.

Requirements

- One logical feature per commit.
- Clear commit messages.
- Avoid massive commits.
- Keep commit history readable.
- Do not mix unrelated changes.

Commit history should clearly demonstrate the engineering thought process.

---

# 19. Definition of Done

A feature is complete only when:

✓ Root cause has been solved.

✓ No temporary fixes exist.

✓ Architecture remains clean.

✓ Code has been reviewed.

✓ Validation is complete.

✓ Error handling is complete.

✓ Tests pass.

✓ Documentation is updated.

✓ No dead code remains.

✓ No unused imports remain.

✓ Linting passes.

✓ Formatting passes.

✓ The implementation is production-oriented rather than assignment-oriented.

---

# 20. Assignment Goal

This project is evaluated on:

- Engineering judgment
- API design
- System thinking
- Maintainability
- Security
- Testing
- Documentation
- Code quality

Always optimize for long-term maintainability rather than simply making the code work.

Every implementation should be something you would be comfortable deploying, maintaining, and defending during a professional code review.