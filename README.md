# Instagram Dashboard Backend

## Project Overview

This repository contains the backend for the Instagram Dashboard initiative. The service is built with FastAPI and is structured to support analytics, profile snapshots, post data, and future third-party integrations through a clean service layer.

The current implementation is intentionally lightweight and mock-driven in several areas so the team can validate the API surface, routing, and integration boundaries before wiring live external systems.

## Architecture

The backend follows a layered structure:

- API routes expose HTTP endpoints for Instagram and integration-related functionality.
- Services contain the business logic and integration abstractions.
- Repositories manage database access patterns for persisted snapshots and related records.
- Database modules initialize SQLAlchemy and manage the connection lifecycle.
- Pydantic models define the API response contracts.

This separation keeps the application easy to extend as Composio, Instagram OAuth, and database-backed workflows move from mock implementations to production integrations.

## FastAPI Backend Structure

```text
backend/
├── main.py
├── database/
│   ├── init_db.py
│   ├── postgres.py
│   └── models/
├── models/
├── repositories/
├── routes/
└── services/
```

### Application Entry Point

- `main.py` creates the FastAPI app.
- The startup lifespan initializes the database schema.
- The app registers the Instagram router and the integrations router.
- Health and root endpoints are available for basic operational checks.

### Routes

- `routes/instagram.py` exposes Instagram analytics, profile, audit, and profile snapshot endpoints.
- `routes/integrations.py` exposes Composio readiness and configuration endpoints.

### Services

- `services/instagram_service.py` provides mock Instagram profile and post data.
- `services/analytics_service.py` provides mock analytics trends.
- `services/audit_service.py` assembles a mock audit payload.
- `services/composio_client.py` validates Composio configuration and exposes connection status helpers.
- `services/composio_service.py` centralizes future Composio-facing Instagram data access.
- `services/instagram_audit_runner.py` represents the weekly audit workflow and composes data from ComposioService.

## Composio Integration Layer

The Composio layer is organized to support a future production integration without affecting the current API contract.

- `ComposioClient` validates whether `COMPOSIO_API_KEY` is present in the environment.
- `ComposioClient.get_connection_status()` reports basic integration readiness.
- `ComposioClient.get_instagram_connection()` returns a mock Instagram connection payload for now.
- `ComposioService` provides the Instagram profile, posts, and analytics access methods that will later call the Composio SDK.
- `routes/integrations.py` exposes Composio-related endpoints for readiness checks and configuration visibility.

This design keeps the integration boundary explicit and makes it straightforward to replace mock responses with real Composio SDK calls later.

## Database Layer

The database layer uses SQLAlchemy and environment-based configuration.

- `database/postgres.py` reads `DATABASE_URL` from the environment and creates the SQLAlchemy engine.
- The same module defines `Base`, `SessionLocal`, and `get_db()` for dependency-injected database sessions.
- `database/init_db.py` creates the database tables at application startup.
- `database/models/` contains SQLAlchemy models for profile, post, and analytics persistence.
- `repositories/` contains the data access helpers used by the API layer.

This setup currently supports schema initialization and snapshot persistence, while leaving room for more advanced audit storage and historical analysis.

## Current Endpoints

### Core

- `GET /` - Basic service status.
- `GET /health` - Health check.

### Instagram

- `GET /instagram/profile` - Returns the current Instagram profile snapshot.
- `GET /instagram/posts` - Returns the current Instagram posts snapshot.
- `GET /instagram/analytics` - Returns Instagram trend analytics.
- `GET /instagram/audit` - Returns the assembled audit payload.
- `POST /instagram/profile/seed` - Seeds a profile snapshot into the database.
- `GET /instagram/profile/latest` - Returns the latest stored profile snapshot.

### Integrations

- `GET /integrations/composio/status` - Static Composio readiness status.
- `GET /integrations/composio/config` - Returns Composio client configuration validation.
- `GET /integrations/composio/instagram` - Returns mock Instagram connection readiness.

## Current Status

- Backend operational
- Composio configured
- Instagram OAuth configured
- Frontend pending

## Future Roadmap

- Replace mock Composio service responses with real SDK calls.
- Persist weekly audit results and integration status snapshots in the database.
- Expand Instagram OAuth handling into a production authentication flow.
- Add scheduled execution for the weekly audit runner.
- Build the frontend dashboard for operational and analytics visibility.
- Add more robust reporting, filtering, and historical trend analysis.

## Notes

The current backend is designed to be safe for incremental delivery. Existing routes and response contracts remain stable while the integration and persistence layers evolve toward production readiness.
