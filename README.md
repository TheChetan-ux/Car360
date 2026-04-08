# Car360

Car360 is a full-stack used car marketplace built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, and JWT authentication. It supports car browsing, seller listings, direct purchases, and auction bidding with role-based dashboards.

## 1. Folder Structure

```text
BUY&SELL_CAR/
  backend/
    config/
    controllers/
    data/
    middleware/
    models/
    routes/
    utils/
    package.json
    server.js
  frontend/
    src/
      components/
      context/
      data/
      layout/
      pages/
      services/
    package.json
    tailwind.config.js
    postcss.config.js
    vite.config.js
  README.md
```

## 2. Setup Instructions

### Backend

1. Open a terminal in `backend`.
2. Run `npm install` or `npm.cmd install` in PowerShell.
3. Create `.env` from `.env.example`.
4. Run `npm run dev` or `npm.cmd run dev`.

### Frontend

1. Open another terminal in `frontend`.
2. Run `npm install` or `npm.cmd install` in PowerShell.
3. Run `npm run dev` or `npm.cmd run dev`.

## Localhost Merge

- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:5000`
- The frontend is now proxy-configured, so all `/api` requests from `http://localhost:5173` are automatically forwarded to the backend
- In practice, open only `http://localhost:5173` in the browser and the app will talk to the API without changing URLs manually

### Root Shortcuts

From the project root, you can use:

1. `npm run install:all` or `npm.cmd run install:all`
2. `npm run dev:backend` or `npm.cmd run dev:backend`
3. `npm run dev:frontend` or `npm.cmd run dev:frontend`

## 3. Backend Code Map

- `models/`: `User`, `Car`, `Bid`, `Order`
- `controllers/`: auth, cars, auctions, dashboard
- `routes/`: REST API modules
- `middleware/`: JWT auth, role checks, error handling
- `data/fallbackCars.js`: dummy inventory fallback if the collection is empty

## 4. Frontend Structure

- React Router pages for home, browse, details, auctions, auth, sell flow, and dashboard
- Shared UI components for button, navbar, footer, loader, car card, and filter sidebar
- API integration in `src/services/api.js`
- Theme toggle with persisted dark/light mode

## 5. API Integration Examples

- `GET /api/cars`
- `POST /api/auth/login`
- `POST /api/cars/:id/purchase`
- `POST /api/auctions/:carId/bid`
- `GET /api/dashboard/buyer`

## 6. Styling Notes

- Premium hero section with cinematic image overlay
- Gradient primary buttons and glassmorphism panels
- Dark/light theme support
- Smooth hover scale, shadow, and image zoom effects
