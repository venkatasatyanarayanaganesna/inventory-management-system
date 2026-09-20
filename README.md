# Warehouse Inventory Management System

A full-stack inventory management app: **Java Spring Boot** REST API backend,
**React** (Vite) frontend, and a **Playwright** end-to-end test suite that
drives the real UI against the real backend.

## Stack

- **Backend:** Java 17, Spring Boot 3.3, Spring Data JPA, H2 in-memory database, Maven
- **Frontend:** React 18, Vite, Axios
- **Tests:** Playwright (E2E, drives both servers automatically)

## Features

- Full CRUD on inventory items (SKU, name, category, quantity, reorder threshold, unit price, warehouse location)
- Low-stock detection (quantity at or below reorder threshold), with a filter and visual badge
- Search across SKU / name / category
- Server-side validation with clean JSON error responses (duplicate SKU, negative quantity, missing fields)
- Backend seeds 7 realistic sample items on every startup — no manual setup needed to try it out

## Project layout

```
inventory-management-system/
├── backend/          Spring Boot REST API (port 8080)
├── frontend/          React app (port 5173)
└── e2e-tests/         Playwright test suite
```

## Prerequisites

- Java 17+ and Maven (`mvn -v` to check)
- Node.js 18+

## Running it locally

**1. Start the backend** (from `backend/`):
```
mvn spring-boot:run
```
Runs on `http://localhost:8080`. First run will download dependencies — can take a few minutes.
H2 console (optional, for poking at the data directly): `http://localhost:8080/h2-console`
(JDBC URL: `jdbc:h2:mem:inventorydb`, user `sa`, no password)

**2. Start the frontend** (from `frontend/`, in a separate terminal):
```
npm install
npm run dev
```
Runs on `http://localhost:5173`.

**3. Run the E2E tests** (from `e2e-tests/`, in a separate terminal):
```
npm install
npx playwright install chromium
npm test
```
Playwright will start both servers automatically if they aren't already running (via the `webServer`
config), so you can also just run `npm test` from a clean start without doing steps 1–2 manually —
though starting them yourself first makes the first test run faster and easier to debug.

## API reference

| Method | Endpoint                  | Description                          |
|--------|----------------------------|---------------------------------------|
| GET    | `/api/items`                | List all items (optional `?query=`)   |
| GET    | `/api/items/{id}`           | Get one item                          |
| GET    | `/api/items/low-stock`      | List items at/below reorder threshold |
| POST   | `/api/items`                | Create an item                        |
| PUT    | `/api/items/{id}`           | Update an item                        |
| DELETE | `/api/items/{id}`           | Delete an item                        |

## Notes

- The H2 database is in-memory and resets on every backend restart — seed data reloads automatically.
- CORS is configured to allow the frontend dev server (`localhost:5173`) to call the API.
- Test data in `inventory.spec.js` uses unique, timestamped SKUs per test run, so tests are
  safe to re-run without restarting the backend or clearing data.
