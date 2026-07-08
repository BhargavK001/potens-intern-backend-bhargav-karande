# Testing Strategy

> **Project:** Tamper-Evident Append-Only Audit Log System  
> **Environment:** Node.js Backend

---

# 1. Overview

Testing is a critical component of the Tamper-Evident Append-Only Audit Log System. Because the project relies on strict cryptographic guarantees, automated testing is required to ensure that business logic, data validation, and hash generation operate predictably and correctly.

The primary focus of the testing suite is **integration testing**. By testing the API endpoints directly against a dedicated test database, we ensure that the entire stack (Controller -> Service -> Repository -> Database) functions seamlessly together.

---

# 2. Testing Stack

- **[Vitest](https://vitest.dev/):** A fast, modern unit testing framework powered by Vite. It serves as the test runner, assertion library, and mocking framework.
- **[Supertest](https://github.com/ladjs/supertest):** An HTTP assertion library used to simulate incoming HTTP requests to the Express application without having to start an actual listening server on a port.

---

# 3. Test Environment Setup

Tests are executed in an isolated environment to prevent polluting the primary development or production databases.

1. **Test Database:** A dedicated PostgreSQL database (`potens_test`) is used exclusively for testing.
2. **Environment Variables:** The test environment loads a specific `.env.test` file which overrides the `DATABASE_URL` to point to the test database.
3. **Database Reset:** Before each test run, the test suite utilizes Prisma to automatically reset the database schema and wipe all existing data. This guarantees that every test execution begins with a completely pristine, deterministic state.

---

# 4. Scenarios Covered

The automated test suite comprehensively covers the following areas:

### 4.1 Authentication & Security
- **Missing API Key:** Verifies that API requests lacking the `X-API-Key` header are immediately rejected with a `401 Unauthorized` status.
- **Invalid API Key:** Verifies that requests providing an incorrect key are rejected.
- **Rate Limiting Protection:** (Implicitly validated through middleware setup).

### 4.2 Data Validation (Zod)
- **Missing Required Fields:** Simulates requests with incomplete bodies and ensures the application gracefully returns a `400 Bad Request` with structured error messages rather than crashing.
- **Invalid Data Types:** Verifies that payloads containing incorrect data types (e.g., passing a number instead of a string) are caught by the validation layer.

### 4.3 Ledger Core Mechanics
- **Genesis Block Creation:** Validates that the very first inserted log correctly uses the predefined `GENESIS` constant as its `previousHash`.
- **Sequential Chaining:** Inserts multiple logs and programmatically verifies that each subsequent log accurately references the exact hash of the log preceding it.
- **Deterministic Hashing:** Ensures that identical payloads and timestamps yield exactly the same SHA-256 hash output.

### 4.4 Chain Verification (Tamper Detection)
The most critical tests in the suite simulate malicious database tampering to ensure the system can detect it.
- **Intact Chain:** Runs the verification endpoint on a freshly generated chain and expects a `PASS` status.
- **Corrupted Payload:** Bypasses the application layer to directly alter a record's `payload` in the database. The suite then hits the verify endpoint and confirms it returns a `FAIL` status, successfully identifying the broken link.
- **Corrupted Previous Hash:** Directly modifies a record's `previousHash` in the database and confirms the verification endpoint immediately detects the inconsistency.

### 4.5 Filtering and Querying
- **Actor Filtering:** Retrieves logs and ensures that specifying an `actor` query parameter strictly returns logs belonging to that actor.
- **Date Range Filtering:** Inserts logs across various dates and verifies that the `startDate` and `endDate` query parameters accurately bound the returned results.

### 4.6 Data Export
- **Format Validation:** Ensures the export endpoint returns the correct `Content-Type` for both `text/csv` and `application/json`.
- **CSV Injection Prevention:** Tests payloads containing `=, +, -, @` characters to ensure the export service properly sanitizes them, preventing malicious spreadsheet formula execution.

---

# 5. Running the Tests

To execute the test suite, ensure the test database is running, then navigate to the `backend` directory and run:

```bash
cd backend
npm run test
```

Vitest will automatically execute all files ending in `.test.ts` or `.spec.ts` inside the `src/tests/` directory.

### Output Example

```text
 ✓ src/tests/auth.test.ts (2)
 ✓ src/tests/validation.test.ts (4)
 ✓ src/tests/ledger.test.ts (5)
 ✓ src/tests/verification.test.ts (3)

 Test Files  4 passed (4)
      Tests  14 passed (14)
   Start at  10:00:00 AM
   Duration  1.23s
```

---

# 6. Continuous Integration

Because Vitest is extremely fast and Prisma migrations can be fully automated, this test suite is designed to be easily plugged into a CI/CD pipeline (e.g., GitHub Actions). The pipeline should define a temporary PostgreSQL service container, run `prisma migrate deploy`, and then execute `npm test` before any code is merged into the main branch.
