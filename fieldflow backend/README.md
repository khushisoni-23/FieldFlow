# FieldFlow Backend API

This is the complete Express.js backend for the FieldFlow field-service management application. It serves as a 1:1 drop-in replacement for the frontend's mock `localStorage` database, fully matching all endpoints, response formats (unwrapped success bodies), status enums, and business logic constraints.

---

## Technical Stack & Architecture

- **Runtime & Framework:** Node.js, Express.js
- **Security:** JWT (JSON Web Tokens), `bcryptjs` password hashing, CORS protection
- **Validation:** `express-validator` schema enforcement
- **Design Pattern:** Repository-Service-Controller architecture (highly decoupling business logic from data access, enabling a seamless transition to MongoDB in the next phase).

---

## Setup & Running Instructions

### 1. Prerequisite
Ensure [Node.js](https://nodejs.org/) (v18 or higher recommended, tested on v24.18.0) is installed.

### 2. Install Dependencies
Navigate to the project root and run:
```bash
npm install
```

### 3. Environment Variables Configuration
Create a `.env` file in the root folder (or copy from `.env.example`):
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=supersecretfieldflowjwttoken123!
CORS_ORIGIN=http://localhost:5173
```

- `PORT`: Port where the API server will listen (defaults to `5000` to bind to frontend's default config `http://localhost:5000/api`).
- `CORS_ORIGIN`: Restricted origin of the frontend Vite server.
- `JWT_SECRET`: Secret key used for signing JWT tokens.

### 4. Running the Server
To start the server in development mode (with hot reloading via nodemon):
```bash
npm run dev
```

To start the server in production mode:
```bash
npm start
```

---

## Seeding & Initial Credentials

The backend mock database is pre-seeded with values identical to `mockData.js`. You can log in immediately using the following accounts:

1. **Admin User:**
   - **Email:** `admin@fieldflow.com`
   - **Password:** `adminpassword`
2. **Technician User (Ramesh Kumar):**
   - **Email:** `ramesh.repair@fieldflow.com`
   - **Password:** `techpassword`
3. **Technician User (Mohit Sharma):**
   - **Email:** `mohit.electric@fieldflow.com`
   - **Password:** `techpassword`
4. **Technician User (Ankit Verma):**
   - **Email:** `ankit.plumb@fieldflow.com`
   - **Password:** `techpassword`

---

## API Documentation & Contract Details

> [!NOTE]
> All endpoints (except Auth registering/logging) expect the header `Authorization: Bearer <token>`.
> Successful resource endpoints return **raw objects or arrays directly** rather than wrapping them in `{ success, data }`.

### 1. Authentication (`/api/auth`)

#### Register User
- **Method:** `POST /api/auth/register`
- **Body:**
  ```json
  {
    "name": "Amit Shah",
    "email": "amit.technician@fieldflow.com",
    "password": "securepassword",
    "role": "TECHNICIAN",
    "specialization": "AC Repair",
    "phone": "+91 99999 88888"
  }
  ```
- **Response:** Raw created user object. If role is `TECHNICIAN`, an associated linked technician record is automatically created in the background.

#### Login User
- **Method:** `POST /api/auth/login`
- **Body:**
  ```json
  {
    "email": "admin@fieldflow.com",
    "password": "adminpassword"
  }
  ```
- **Response:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "user-admin",
      "name": "Khushi Soni (Admin)",
      "email": "admin@fieldflow.com",
      "role": "ADMIN"
    }
  }
  ```

#### Get Session Profile
- **Method:** `GET /api/auth/me` (or alias `GET /api/auth/profile`)
- **Response:** Authenticated user profile object.

---

### 2. Customers (`/api/customers`)

- `GET /api/customers` → Returns raw customer array.
- `GET /api/customers/:id` → Returns raw customer object.
- `POST /api/customers` → Creates customer. Body: `{ name, phone, email?, address, city?, state?, pincode?, notes? }`.
- `PUT /api/customers/:id` → Updates customer details.
- `DELETE /api/customers/:id` → Deletes customer. Returns `{ "success": true }`.

---

### 3. Technicians (`/api/technicians`)

- `GET /api/technicians` → Returns raw technicians list.
- `GET /api/technicians/:id` → Returns technician details.
- `POST /api/technicians` → Creates a technician.
- `PATCH /api/technicians/:id/status` → Updates status (`Available`, `On Job`, `Busy`, `Offline`).
- `DELETE /api/technicians/:id` → Deletes technician. Returns `{ "success": true }`.
  - **Guard:** If a technician has active (non-Completed, non-Paid) job assignments, this endpoint rejects deletion with `409 Conflict`.

---

### 4. Jobs (`/api/jobs`)

- `GET /api/jobs` → Returns jobs array.
- `GET /api/jobs/:id` → Returns job details (includes full timeline history logs, parts used, costs, and customer information).
- `POST /api/jobs` → Schedules a job. Body: `{ customerId, serviceType, problemDescription, priority, scheduledDate, scheduledTime, technicianId?, notes?, address? }`.
- `PATCH /api/jobs/:id/status` → Transitions status (validation ensures pipeline steps aren't skipped wildely, e.g. Pending to Completed directly is rejected). Body: `{ status, noteText? }`.
- `POST /api/jobs/:id/complete` → Marks job Completed. Computes part costs, adds invoice record, updates tech workload.
  - **Body:** `{ serviceCharge, partsUsed: [{ partId, quantity }], notes? }`.
  - **Guard:** Validates stock levels (fails on insufficient stock). Prevents double inventory deductions on duplicate calls.
- `POST /api/jobs/:id/payment` → Updates payment Status of the job and invoice. Body: `{ method, amount }`.
- `POST /api/jobs/:id/assign` → Assigns technician to the job. Body: `{ technicianId }`.
- `POST /api/jobs/:id/parts` → Directly registers parts used.
- `POST /api/jobs/:id/photos` → Simulates service photos uploading. Body: `{ beforePhoto, afterPhoto }`.

---

### 5. Inventory (`/api/inventory`)

- `GET /api/inventory` → Returns parts catalog.
- `POST /api/inventory` → Creates a part. Status is computed server-side (`stock === 0` -> `Critical`, `stock <= minStock` -> `Low Stock`, else `In Stock`).
- `PATCH /api/inventory/:id/stock` → Overwrites absolute stock count. Body: `{ stockCount }`.
- `POST /api/inventory/:id/deduct` → Deducts stock, floored at 0. Body: `{ quantity }`.

---

### 6. Payments (`/api/payments`)

- `GET /api/payments` → Returns invoices.
- `POST /api/payments` → Creates payment. Filters/clears duplicates with the same `jobId` before inserting.
- `PATCH /api/payments/job/:jobId` → Updates status of the invoice and synchronizes job payment status.

---

### 7. Notifications (`/api/notifications`)

- `GET /api/notifications` → Returns in-app notifications.
- `POST /api/notifications` → Creates manual notification log.
- `PATCH /api/notifications/:id/read` → Marks notification as read.
- `POST /api/notifications/clear` (or alias `POST /api/notifications/read-all`) → Marks all notifications read.

---

### 8. Global Search (`/api/search`)

- `GET /api/search?q=query`
- Returns an entity-grouped search index:
  ```json
  {
    "customers": [...],
    "technicians": [...],
    "jobs": [...],
    "inventory": [...],
    "payments": [...]
  }
  ```

---

### 9. Analytics & Reports (`/api/reports`)

- `GET /api/reports/analytics`
- Compiles real-time metrics (revenues, job loads, technician performance, category counts, stock health status, monthly aggregates) matching the React frontend's graphs.

---

## Roadmap: MongoDB Integration Phase

Because we have decoupled our data operations into the **Repository Layer** (`src/repositories/`), moving to MongoDB/Mongoose will require **zero changes** to our controllers or services. 

### Transition Steps for Teammate:
1. Install mongoose: `npm install mongoose`
2. Create standard MongoDB schemas matching the field shapes defined in `src/data/mockDatabase.js`.
3. Swap file implementations in `src/repositories/`:
   - Replace the `db.customers` operations with standard Mongoose helper queries (e.g. `CustomerModel.find()`, `CustomerModel.create()`, etc.).
   - Expose the string ID field (`id` as `CUST-` prefix) in the document or virtual output so the frontend contract remains intact.
