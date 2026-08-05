# Architecture Guide: Worker Allocation System

## Separation of Concerns
- **Frontend (`/frontend`)**: React 19 Single Page Application.
  - Bundled with Vite.
  - Uses `@dnd-kit` for drag-and-drop worker assignment boards.
  - State is localized, synced with backend via Axios REST calls and Socket.io for real-time updates.

- **Backend (`/backend`)**: Node.js + Express API.
  - RESTful endpoints for CRUD operations (Workers, Allocations, Projects).
  - Socket.io server to broadcast state changes (e.g., when a dispatcher assigns a worker, other connected clients receive `worker:assigned` events to update their UI instantly).
  - Validates all incoming request bodies with `zod`.
  - Connects to MySQL using the `mysql2` package. Queries must be parameterized.
