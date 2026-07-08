# API Reference Documentation

> **Project:** Tamper-Evident Append-Only Audit Log System  
> **Document:** API Reference (`docs/04_API_REFERENCE.md`)  
> **Version:** 2.0  
> **Status:** Implementation Contract  

---

# 1. Overview & Authentication

## Base URL
All API requests must be directed to the versioned API base path:
```http
http://localhost:3000/api/v1
```

## Authentication (`X-API-Key`)
Every endpoint is protected by default. Requests must include the valid API key in the `X-API-Key` HTTP header. Requests lacking a valid key are rejected immediately before reaching routing or validation layers.

| Header Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `X-API-Key` | String | ✅ | Secret API key configured in backend environment variables (`process.env.API_KEY`). |

**Example Authenticated Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/verify" \
  -H "X-API-Key: my-secret-api-key"
```

## Rate Limiting
Write endpoints are rate limited. Configuration is defined within the application. When throttled, the API returns HTTP status `429 Too Many Requests` along with standard rate limiting headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`).

---

# 2. Standard Data Models & Error Schemas

## LogEntry DTO
The primary Data Transfer Object representing an immutable audit event.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (string) | Unique primary key identifier for the log entry (UUID v4). |
| `actor` | string | User, service, or system role responsible for triggering the event (1–100 chars). |
| `action` | string | Descriptive identifier of the operation performed (1–100 chars). |
| `payload` | JSONB (object) | Structured JSON object containing event context or metadata. |
| `previousHash`| string (char 64) | SHA-256 hex digest of the immediately preceding record (or `"GENESIS"` for index 0). |
| `hash` | string (char 64) | SHA-256 hex digest of the current record computed over deterministic inputs. |
| `createdAt` | string (ISO 8601) | UTC timestamp indicating exact database persistence time. |

## Standard Error Response Schema
When an error occurs across any layer (validation failure, authentication failure, database fault), the API returns a standardized JSON payload:

```json
{
  "success": false,
  "error": "ERROR_CODE_STRING",
  "message": "Human-readable explanation of the failure",
  "details": [
    {
      "field": "action",
      "message": "Required field cannot be empty"
    }
  ]
}
```

### Supported HTTP Error Status Codes
* `400 Bad Request`: Schema validation failure (`VALIDATION_ERROR`) or malformed JSON syntax.
* `401 Unauthorized`: Missing or invalid `X-API-Key` header (`UNAUTHORIZED`).
* `404 Not Found`: Requested resource or UUID does not exist in the database (`NOT_FOUND`).
* `429 Too Many Requests`: Rate limit threshold exceeded on write endpoints (`RATE_LIMIT_EXCEEDED`).
* `500 Internal Server Error`: Unhandled system exception or unexpected database fault (`INTERNAL_SERVER_ERROR`).
* `503 Service Unavailable`: PostgreSQL database unreachable or connection pool exhausted (`DATABASE_UNREACHABLE`).

---

# 3. API Endpoints

## 3.1 Create Log Entry
`POST /api/v1/log`

Appends a new immutable audit log entry to the ledger. Executes inside a database transaction: retrieves the latest `previousHash`, performs deterministic canonical JSON key-sorting on `payload`, calculates the SHA-256 hash, and commits the row.

### Endpoint Execution Flow
```
POST /api/v1/log
Authenticate
      ↓
Validate Request
      ↓
Start Transaction
      ↓
Read Latest Log
      ↓
Generate SHA-256
      ↓
Insert Record
      ↓
Commit
      ↓
Return 201
```

### Business Rules
* Records are immutable after creation.
* No update or delete operations exist.
* Every record references the previous hash.
* The first record uses `"GENESIS"`.
* Hashes are generated server-side only.
* Clients cannot provide hash values.

> [!IMPORTANT]
> **Idempotency Note:** `POST /api/v1/log` is intentionally non-idempotent. Every valid request creates a new immutable record, even if the payload is identical to a previous request. This is a critical semantic detail for an append-only log.

### Request Headers
* `Content-Type: application/json`
* `X-API-Key: <your-api-key>`

### Request Body Schema (Zod Validated)
| Field | Type | Required | Validation Rules |
| :--- | :--- | :--- | :--- |
| `actor` | string | ✅ | Required.<br/>Trim whitespace.<br/>1–100 characters.<br/>Cannot contain only spaces. |
| `action` | string | ✅ | Required.<br/>Trim whitespace.<br/>1–100 characters.<br/>Cannot contain only spaces. |
| `payload` | object | ✅ | Required.<br/>Must be a valid JSON object.<br/>Cannot be empty, null, array, or primitive. |

### Example Request Body
```json
{
  "actor": "admin",
  "action": "UPDATE_PATIENT_RECORD",
  "payload": {
    "patientId": "p-88392",
    "changedFields": ["insuranceProvider", "contactPhone"],
    "ipAddress": "192.168.1.104"
  }
}
```

### Example cURL Command
```bash
curl -X POST "http://localhost:3000/api/v1/log" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: my-secret-api-key" \
  -d '{
    "actor": "admin",
    "action": "UPDATE_PATIENT_RECORD",
    "payload": {
      "patientId": "p-88392",
      "changedFields": ["insuranceProvider", "contactPhone"]
    }
  }'
```

### Success Response (`201 Created`)
```json
{
  "success": true,
  "data": {
    "id": "7b9b804f-35da-48c0-8260-23a57be11883",
    "actor": "admin",
    "action": "UPDATE_PATIENT_RECORD",
    "payload": {
      "changedFields": ["insuranceProvider", "contactPhone"],
      "patientId": "p-88392"
    },
    "previousHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "hash": "8f3994bb0f331cfefba852e1850d53c7a7eafe37722d5df4abfdf5eb36d93617",
    "createdAt": "2026-07-08T01:50:12.341Z"
  }
}
```

---

## 3.2 Retrieve Single Log by ID
`GET /api/v1/log/:id`

Fetches a specific audit log entry by its primary key UUID.

### Endpoint Execution Flow
```
GET /api/v1/log/:id
Authenticate
      ↓
Validate UUID Parameter
      ↓
Query Database by ID
      ↓
Record Found?
   /        \
(Yes)       (No)
  ↓           ↓
Return 200  Return 404
```

### Business Rules
* Read-only operation; does not alter database state or hash chains.
* Returns exact stored attributes including server-generated timestamps and SHA-256 hashes.
* Rejects malformed non-UUID strings at the parameter validation boundary before querying storage.

### Path Parameters
| Parameter | Type | Required | Validation Rules |
| :--- | :--- | :--- | :--- |
| `id` | UUID (string) | ✅ | Required.<br/>Trim whitespace.<br/>Must be a valid 36-character UUID v4 string. |

### Example cURL Command
```bash
curl -X GET "http://localhost:3000/api/v1/log/7b9b804f-35da-48c0-8260-23a57be11883" \
  -H "X-API-Key: my-secret-api-key"
```

### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": "7b9b804f-35da-48c0-8260-23a57be11883",
    "actor": "admin",
    "action": "UPDATE_PATIENT_RECORD",
    "payload": { "patientId": "p-88392" },
    "previousHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "hash": "8f3994bb0f331cfefba852e1850d53c7a7eafe37722d5df4abfdf5eb36d93617",
    "createdAt": "2026-07-08T01:50:12.341Z"
  }
}
```

### Error Response (`404 Not Found`)
```json
{
  "success": false,
  "error": "NOT_FOUND",
  "message": "Log entry with id '7b9b804f-35da-48c0-8260-000000000000' does not exist"
}
```

---

## 3.3 Verify Hash Chain Integrity
`GET /api/v1/verify`

Triggers an immediate chronological verification traversal of the entire database ledger. Recalculates all SHA-256 hashes sequentially from index 0 (`"GENESIS"`) to the current tail. Halts immediately if any historical record has been modified, reordered, or deleted.

### Endpoint Execution Flow
```
GET /api/v1/verify
Authenticate
      ↓
Fetch All Records Chronologically
      ↓
Verify Hash Chain & Link Continuity
      ↓
Tamper Detected?
   /         \
(No)         (Yes)
  ↓            ↓
Return PASS  Return FAIL (with brokenEntryId & reason)
```

### Business Rules
* Verification is performed server-side by traversing the entire ledger in ascending chronological order (`createdAt ASC, id ASC`).
* The root record (index 0) must reference `"GENESIS"` as its `previousHash`.
* Each subsequent record ($i$) must possess a `previousHash` matching record $i-1$'s `hash`.
* Each record's `hash` must match a newly calculated SHA-256 digest over `previousHash + actor + action + canonical(payload) + createdAt`.
* Stops execution and reports failure upon encountering the very first link break or hash mismatch.

### Request Headers
* `X-API-Key: <your-api-key>`

### Example cURL Command
```bash
curl -X GET "http://localhost:3000/api/v1/verify" \
  -H "X-API-Key: my-secret-api-key"
```

### Success Response (`200 OK` - Chain Valid)
```json
{
  "success": true,
  "status": "PASS",
  "entriesChecked": 1042,
  "brokenEntryId": null,
  "verifiedAt": "2026-07-08T01:52:00.000Z"
}
```

### Failure Response (`200 OK` - Tamper Detected)
*Note: A verification discrepancy returns HTTP `200 OK` because the API endpoint executed successfully and diagnosed a ledger anomaly. The payload reports the `FAIL` status and identifies the exact broken link.*

```json
{
  "success": true,
  "status": "FAIL",
  "entriesChecked": 412,
  "brokenEntryId": "9c112233-4455-6677-8899-aabbccddeeff",
  "reason": "Hash mismatch"
}
```

---

## 3.4 Export Filtered Logs
`GET /api/v1/export`

Extracts a structured JSON dump of historical audit records for external administrative review or compliance archiving. Supports optional date range and actor filtering.

### Endpoint Execution Flow
```
GET /api/v1/export
Authenticate
      ↓
Validate Query Parameters
      ↓
Build Dynamic Database Query
      ↓
Execute Query & Format Records
      ↓
Return 200 JSON (with notice)
```

### Business Rules
* Read-only administrative extraction operation.
* Supports filtering by exact actor match and inclusive ISO 8601 date boundaries.
* Exported records retain their original stored `hash` and `previousHash` attributes.
* Filtered subsets omit intermediate ledger rows and cannot be verified independently without the complete historical chain.

### Query Parameters
| Parameter | Type | Required | Validation Rules |
| :--- | :--- | :--- | :--- |
| `actor` | string | ❌ | Optional.<br/>Trim whitespace.<br/>Exact match against stored actor identity. |
| `startDate` | string (ISO 8601) | ❌ | Optional.<br/>Must be a valid ISO 8601 date string.<br/>Filters records where `createdAt >= startDate`. |
| `endDate` | string (ISO 8601) | ❌ | Optional.<br/>Must be a valid ISO 8601 date string.<br/>Filters records where `createdAt <= endDate`. |

### Example cURL Command
```bash
curl -X GET "http://localhost:3000/api/v1/export?actor=admin&startDate=2026-07-01T00:00:00Z" \
  -H "X-API-Key: my-secret-api-key"
```

### Success Response (`200 OK`)
```json
{
  "success": true,
  "metadata": {
    "exportedAt": "2026-07-08T01:55:00.000Z",
    "filterApplied": {
      "actor": "admin",
      "startDate": "2026-07-01T00:00:00Z"
    },
    "recordCount": 15,
    "notice": "Administrative export. Filtered subsets omit intermediate ledger rows and cannot be verified independently without the complete historical chain."
  },
  "data": [
    {
      "id": "7b9b804f-35da-48c0-8260-23a57be11883",
      "actor": "admin",
      "action": "UPDATE_PATIENT_RECORD",
      "payload": { "patientId": "p-88392" },
      "previousHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "hash": "8f3994bb0f331cfefba852e1850d53c7a7eafe37722d5df4abfdf5eb36d93617",
      "createdAt": "2026-07-08T01:50:12.341Z"
    }
  ]
}
```
