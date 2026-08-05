---
name: template_skill
description: A template skill demonstrating the Anthropic Agent Skills standard. Automatically trigger this when scaffolding new projects, creating endpoints/components, or enforcing specific coding guidelines.
---

# Core Purpose
This skill serves as a template to enforce project-specific rules, structure, and guidelines for the Worker Allocation System. It prevents accidental architectural drift.

# Strict Rules & Standards
- **Frontend Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, @dnd-kit for drag-and-drop, and Socket.io-client.
- **Backend Tech Stack:** Node.js (ES Modules), Express, MySQL2, Socket.io, and Zod for validation.
- **File Structure:** Keep logic strictly separated into `frontend/` and `backend/` directories.
- **Security:** Do not commit `.env` files. Implement explicit error handling. Ensure backend endpoints are secured (e.g., using Helmet, CORS, and rate limiting).
- **WebSockets:** Use standard event naming conventions (e.g., `worker:assigned`, `status:updated`).

# Execution Steps
1. **Understand Context:** Verify whether the user's request applies to the frontend or backend (or both).
2. **Review References & Examples:**
   - Review `references/architecture.md` and `references/database_schema.md`.
   - Before writing React code, review `examples/ReactComponent.tsx`.
   - Before writing Express code, review `examples/ExpressController.js`.
3. **Execute & Branch:**
   - **If Frontend:** Ensure you use functional components, TypeScript, and Tailwind utility classes (no inline styles).
   - **If Backend:** Ensure route payloads are validated with Zod and SQL queries are parameterized (prevent SQL injection).
4. **Validate:** Run `node .agent/skills/template_skill/scripts/validate_standards.js` to automatically verify basic standards.
5. **Complete:** Provide a concise summary of the generated/modified files.

# Reference Pointers
- `scripts/`: Validation tools for CI and agent execution.
- `references/`: Architecture and Database context.
- `examples/`: Code templates.
