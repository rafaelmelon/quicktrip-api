# QuickTrip API

RESTful backend for **QuickTrip**, a travel route planner that helps users discover points of interest between two locations, save routes, bookmark places, and write travel notes.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 22+ |
| Language | TypeScript 5 |
| Framework | Fastify 5 |
| ORM | Prisma 6 |
| Database | PostgreSQL 17 |
| Auth | JWT (access + refresh tokens) |
| Validation | Zod |
| Password hashing | bcryptjs (async, 12 rounds) |
| Security | Helmet, CORS, Rate limiting |
| Dev tools | tsx (watch), Docker Compose |

## Architecture

```
src/
├── config/          # Environment validation (Zod), Prisma client
├── middleware/       # Auth guard, global error handler
├── modules/
│   ├── auth/        # Signup, login, refresh, me
│   ├── routes/      # CRUD travel routes + stops
│   ├── places/      # CRUD bookmarked places
│   └── notes/       # CRUD route notes
├── utils/           # JWT helpers, password hashing
├── app.ts           # Fastify app builder (plugins + routes)
└── server.ts        # Entry point
```

Each module follows the pattern: **schema** (Zod) → **service** (business logic) → **controller** (HTTP layer) → **routes** (Fastify registration).

## Data Model

```
User ──< Route ──< RouteStop
  │         │
  │         └──< Note
  │
  └──< Place
```

- **User**: email, username, hashed password
- **Route**: origin/destination coordinates, category, estimated duration
- **RouteStop**: ordered points of interest along a route
- **Place**: individually bookmarked locations
- **Note**: freeform text attached to a route

## Getting Started

### Prerequisites

- **Node.js** >= 20 ([download](https://nodejs.org/))
- **Docker** (for local PostgreSQL) ([download](https://www.docker.com/products/docker-desktop/))

### 1. Clone & install

```bash
git clone https://github.com/rafaelmelon/quicktrip-api.git
cd quicktrip-api
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set a strong `JWT_SECRET` (at least 32 characters). The defaults work for local development with Docker.

### 3. Start database + run migrations + seed

```bash
npm run setup
```

This single command:
1. Starts PostgreSQL in Docker
2. Runs Prisma migrations
3. Seeds a demo user (`demo@quicktrip.dev` / `demo1234`)

### 4. Start the dev server

```bash
npm run dev
```

Server starts at **http://localhost:3000**. It reloads on file changes.

### 5. Verify

```bash
curl http://localhost:3000/health
# → {"status":"ok"}
```

## API Reference

All data endpoints require `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | `{ email, username, password }` | Create account |
| POST | `/api/auth/login` | `{ email, password }` | Get tokens |
| POST | `/api/auth/refresh` | `{ refreshToken }` | Refresh access token |
| GET | `/api/auth/me` | — | Get current user |

### Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/routes` | List all user routes |
| GET | `/api/routes/:id` | Get route with stops and notes |
| POST | `/api/routes` | Create route (with optional stops) |
| PATCH | `/api/routes/:id` | Update route |
| DELETE | `/api/routes/:id` | Delete route |

**Create route body:**
```json
{
  "name": "Museum Tour",
  "category": "museum",
  "estimatedMinutes": 180,
  "originName": "Plaça Catalunya",
  "originLat": 41.387,
  "originLng": 2.170,
  "destinationName": "Barceloneta",
  "destinationLat": 41.378,
  "destinationLng": 2.192,
  "stops": [
    { "name": "MACBA", "address": "Plaça dels Àngels", "lat": 41.383, "lng": 2.166, "position": 0 }
  ]
}
```

### Places

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/places` | List saved places |
| POST | `/api/places` | Bookmark a place |
| DELETE | `/api/places/:id` | Remove bookmark |

### Notes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notes?routeId=<uuid>` | List notes for a route |
| POST | `/api/notes` | Create note (`{ routeId, content }`) |
| PATCH | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production server |
| `npm run setup` | Docker DB + migrations + seed (one command) |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |
| `npm run db:seed` | Seed demo data |
| `npm test` | Run tests |
| `npm run docker:up` | Start PostgreSQL container |
| `npm run docker:down` | Stop PostgreSQL container |

## Deployment (Free Tier)

### Render.com

1. Create a **PostgreSQL** database (free tier)
2. Create a **Web Service** connected to this repo
3. Set build command: `npm install && npx prisma generate && npm run build`
4. Set start command: `npx prisma migrate deploy && npm start`
5. Add environment variables from `.env.example`

### Railway

1. Create a new project, add **PostgreSQL** plugin
2. Deploy from GitHub repo
3. Railway auto-detects Node.js, set start command to `npx prisma migrate deploy && npm start`
4. Add environment variables

## License

MIT
