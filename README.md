# Feature Flags

A full-stack feature-flag manager: create applications, add flags to them, and
see changes propagate in real time.

## Tech stack
- **Frontend:** Angular 19, TypeScript, Tailwind CSS, Socket.IO client, RxJS
- **Backend:** Node.js + TypeScript, MongoDB, Socket.IO for real-time updates
- **Deployment:** Docker for both tiers, nginx serves the UI, compose file at
  the repo root

## What's inside
- `src/app/` — Angular app:
  - Portal feature for browsing applications and their flags
  - Shared components for creating apps and flags, navigation, and
    notifications (with a typed message → CSS pipe)
  - An HTTP interceptor and global / flags / IO services — the IO service
    keeps flag state live over Socket.IO
  - Unit specs for components, services, the interceptor, and pipes
- `backend/` — TypeScript server: MongoDB connection, constants/interfaces,
  flag and app endpoints, and the Socket.IO gateway that broadcasts changes

## Running locally
```bash
npm install
npm start            # Angular dev server on http://localhost:4200
# backend
cd backend && npm install && npm start
# or the full stack
docker compose up --build
```
