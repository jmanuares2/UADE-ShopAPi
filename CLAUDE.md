# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**uade-shop-api** — Spring Boot 4.0.4 REST API for an e-commerce application (UADE course project). Java 17, Maven, MySQL, JWT authentication, role-based access control.

## Build & Run Commands

```bash
# Run the application
./mvnw spring-boot:run

# Build (skip tests)
./mvnw clean package -DskipTests

# Run all tests
./mvnw test

# Run a single test class
./mvnw test -Dtest=ProductoServiceTest

# Run a single test method
./mvnw test -Dtest=ProductoServiceTest#testPrecioNegativoLanzaExcepcion

# Run E2E tests (requires backend running on port 8080)
.\run-tests.bat
```

## Database Prerequisites

- MySQL on `localhost:3306`, database `ecommerce_db3`, user `root` (empty password)
- Configured for XAMPP by default — update `src/main/resources/application.properties` for a different setup
- Schema is auto-managed by Hibernate (`ddl-auto=update`); tables are created on first run
- Initial seed data is loaded by `DataSeedingConfig.java` on startup
- Tests use H2 in-memory (configured in `src/test/resources/application.properties`)

## Architecture

Layered Spring Boot application under `com.uade.tpo.e_commerce`:

- **`controller/`** — REST endpoints; delegates all logic to services
- **`service/`** — Business logic with `@Transactional`; enforces permissions, stock, pricing rules
- **`repository/`** — Spring Data JPA interfaces (auto-implemented)
- **`model/`** — JPA entities with Lombok; `Usuario` implements `UserDetails`
- **`dto/`** — Request/response DTOs separating API contract from entity shape
- **`security/`** — `JwtUtil` (generate/validate tokens) + `JwtFilter` (per-request auth)
- **`config/`** — `SecurityConfig` (CORS, role-based route authorization) + `DataSeedingConfig`
- **`exception/`** — Domain exceptions + `GlobalExceptionHandler` returning proper HTTP codes

## Key Domain Rules

- **Roles:** `ADMIN` has full access; `USER` can create products and use the cart
- **Product permissions:** Only the creator or an ADMIN can update/delete a product (`ForbiddenOperationException`)
- **Pricing:** Negative prices throw `PrecioNegativoException`
- **Stock:** Cart checkout validates stock and throws `OutOfStockException`
- **Soft delete:** Users are logically deleted (`activo=false`, `fechaBaja` timestamp); hard delete is available but used sparingly
- **Cart:** One cart per user, created at registration

## Security Configuration

- JWT secret: `jwt.secret` in `application.properties` (24h expiration)
- Public endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/productos`
- CORS allows `http://localhost:5173` (Vite frontend)
- Frontend must send `Authorization: Bearer <token>`

## Testing Approach

Integration tests (JUnit 5 + Spring Boot Test + H2) cover service-layer business logic with `@Transactional` rollback per test. `@WithMockUser` is used for role-based scenarios. Key test classes:

- `AuthenticationServiceTest` — registration, login, duplicate user
- `CarritoServiceTest` — stock validation, totals, checkout
- `ProductoServiceTest` — price validation, permission enforcement
- `UsuarioServiceSoftDeleteTest` — soft vs hard delete behavior

Postman collection (`Pruebas.postman_collection.json`) covers E2E happy paths via Newman (`run-tests.bat`).

## Application Profiles

`ECommerceApplication.java` activates the `docker` profile when `application-docker.properties` is present in the classpath — intended for future containerization.
