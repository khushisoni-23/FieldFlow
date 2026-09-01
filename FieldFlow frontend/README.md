# FieldFlow

## What is FieldFlow?
FieldFlow is a premium, responsive SaaS Operations Management platform engineered for local field service workshops (such as AC repair agencies, water purifier service providers, plumbers, and electricians). It unifies scheduling, technician dispatching, customer profiles, inventory management, and invoice payment logs into one cohesive flow.

## Problem Statement
Small-to-medium field service businesses frequently suffer from fragmented tracking (spread across phone calls, WhatsApp messages, paper diaries, and spreadsheets). This leads to:
- Disorganized customer histories and missed callbacks.
- Inefficient scheduling, routing, and dispatch delays.
- Stock leakage due to unlogged parts consumption by field agents.
- Delays in payment collection and unclear outstanding invoices.

FieldFlow bridges this gap by providing real-time synchronization between dispatchers in the office and technicians on-site.

## Key Features

### Admin Portal
- **Dashboard Hub:** Review dynamic operational metrics (today's calendar, fleet statuses, revenue collections, and stock warnings).
- **Customer Profiles Ledger:** Comprehensive customer list with past job histories, service counts, and spent totals.
- **Service Jobs Dispatch:** Create service dispatches, assign priority categories, schedule time slots, and view workloads on a live Kanban-style board.
- **Inventory Tracking:** Real-time stock levels, SKU identifiers, and minimum threshold alerts.
- **Ledger & Analytics:** Review paid vs. outstanding revenues and category dispatches.
- **System Settings:** Customize localized workspace preferences (Hindi/English translation switches and dark/light modes).

### Technician Portal
- **Field Console:** Dynamic list of active tasks assigned for the current calendar date.
- **Directions & Action Triggers:** Call customers directly or view navigation maps.
- **Job Service Sheet:** Add service notes, attach before/after service photos, and deduct consumed inventory parts.
- **Payment Collection:** Mark jobs completed and collect fees on-site via UPI or Cash.

## Technology Stack
- **React & Vite:** Core frontend runtime environment.
- **Tailwind CSS:** Premium styling framework.
- **Lucide React:** Icon package.
- **Recharts:** Operational charts rendering.
- **Axios:** Network requests (supported inside service layer).
- **Node/Express:** Planned backend API layer.
- **MongoDB / Mongoose:** Planned database models layer.
- **JWT & bcrypt:** Planned authentication verification.
- **Cloudinary:** Planned media storage bucket.

## Application Architecture
FieldFlow enforces a strictly decoupled architecture:
```text
React Page Components
       ↓
AppContext / Local Hooks (State management)
       ↓
Service Layer (authService, jobService, inventoryService, reportService, etc.)
       ↓
Axios Network Wrapper (api.js) OR Mock Data Fallbacks
       ↓
Express API Gateway -> Mongoose Schemas -> MongoDB
```

## Project Structure
```text
src/
├── components/       # Reusable UI elements (Input, Button, Badge, Modal)
├── context/          # AppContext global state provider
├── data/             # Persistent local storage mock data schemas
├── i18n/             # Translations keys mapping (en.js, hi.js)
├── layouts/          # Portal wrappers (AdminLayout, TechnicianLayout, PublicLayout)
├── pages/            # View components (Admin dashboard, Technician console, Public pages)
├── services/         # Decoupled HTTP services (authService.js, jobService.js, etc.)
├── index.css         # Theme tokens, custom scrollbars, typography configurations
└── App.jsx           # Main router maps
```

## Current Frontend Status
The frontend is completely finalized, QA-audited, and optimized for immediate backend coupling. All layout alignments, search components, forms, dark mode styles, and language resource switches are fully active.

## Mock Mode
By default, the application runs in **Mock Mode** using browser `localStorage` fallbacks, allowing full operational demos without an active server connection. Data is dynamically recalculated based on today's active date.

## Environment Variables
Create a `.env` or edit the included `.env.example` to switch modes:
```env
VITE_API_URL=http://localhost:5000/api
VITE_USE_API=false
```
Set `VITE_USE_API=true` to redirect service requests to your Express server.

## Demo Accounts
To log in under Mock Mode, use:
- **Admin Portal:**
  - **Email:** `admin@fieldflow.in`
  - **Password:** `password`
- **Technician Portal:**
  - **Email:** `ramesh@fieldflow.in`
  - **Password:** `password`

## How to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Launch the developer server:
   ```bash
   npm run dev
   ```
3. Compile for production:
   ```bash
   npm run build
   ```

## Backend Integration
All pages invoke actions exclusively via context APIs, which in turn call the decoupled service wrapper layers (`src/services/`). When ready, simply configure `VITE_USE_API=true` to route calls through `api.js` to your backend controllers.

## Future/Backend Components
- **Express Server:** Port 5000 API endpoint mapping.
- **MongoDB / Mongoose:** Models for User, Customer, Technician, Job, Inventory, and Payment.
- **JWT & bcrypt:** Securing user accounts, session cookies, and login tokens.
- **Cloudinary:** Storing before/after job images uploaded by technicians.
- **Role Authorization:** Express middleware to protect administrative routes on the server side.
