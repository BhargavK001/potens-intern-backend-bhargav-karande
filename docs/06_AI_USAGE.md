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
