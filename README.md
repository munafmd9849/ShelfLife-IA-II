# ShelfLife

## Overview

ShelfLife is a college library management platform for books, members, borrowing, returns and borrowing history.

## Features

- Book management with availability tracking
- Member registration and borrowing history
- Authenticated book issue and return workflows
- Title search, genre filtering and pagination
- Overdue identification for unreturned books
- JWT librarian authentication and protected routes

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs

**Frontend:** React, TypeScript, Vite, React Router, Axios

## Project Structure

```text
backend/
  src/{models,controllers,routes,middleware}
  .env.example
frontend/
  src/{api,components,pages,types}
  .env.example
SYSTEM_DESIGN.md
```

## Prerequisites

- Node.js 18+ and npm
- MongoDB locally or a MongoDB Atlas connection string

## Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

## Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Environment Variables

Create local `.env` files from the examples. Never commit `.env` files.

`backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/shelflife
JWT_SECRET=use_a_long_random_secret
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

`CLIENT_ORIGIN` is optional; omit it to allow all origins during simple local development, or set one or more comma-separated frontend origins for deployment.

`frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

`VITE_API_URL` may be the API host or a full URL ending in `/api`; the client normalizes either form.

## Authentication

Demo librarian credentials:

- Email: `librarian@shelflife.com`
- Password: `librarian123`

Login returns an eight-hour JWT. The frontend stores it as `shelflife_token` in local storage and sends it as a Bearer token for protected issue and return operations.

## API Endpoints

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | --- |
| GET | `/api/health` | Health check | No |
| POST | `/api/auth/login` | Librarian login | No |
| POST | `/api/books` | Create a book | No |
| GET | `/api/books` | List, search and filter books | No |
| POST | `/api/members` | Register a member | No |
| GET | `/api/members` | List members | No |
| GET | `/api/members/:id/history` | Get member borrowing history | No |
| POST | `/api/borrow` | Issue a book | JWT |
| POST | `/api/return/:borrowId` | Return a book | JWT |

## Sample Requests

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"librarian@shelflife.com","password":"librarian123"}'

curl -X POST http://localhost:5000/api/books \
  -H 'Content-Type: application/json' \
  -d '{"title":"Dune","author":"Frank Herbert","isbn":"9780441172719","genre":"Science Fiction","totalCopies":3,"availableCopies":3}'

curl 'http://localhost:5000/api/books?page=1&limit=10&genre=Science%20Fiction&search=Dune'

curl -X POST http://localhost:5000/api/members \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ava Patel","email":"ava@example.edu","membershipId":"LIB-001"}'

curl -X POST http://localhost:5000/api/borrow \
  -H 'Content-Type: application/json' -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{"bookId":"BOOK_ID","memberId":"MEMBER_ID","dueDate":"2026-11-01"}'

curl -X POST http://localhost:5000/api/return/BORROW_ID \
  -H 'Authorization: Bearer YOUR_TOKEN'

curl http://localhost:5000/api/members/MEMBER_ID/history
```

## Frontend Routes

- `/login` — librarian sign-in
- `/books` — searchable and paginated catalogue
- `/issue` — protected issue-book form
- `/members/:id/history` — member borrowing history

## State Management

Local React state with `useState` and `useEffect` is sufficient for this small application. The views do not require shared, long-lived client state that would justify a global state-management library.

## Concurrency Handling

Issuing uses an atomic MongoDB conditional update that matches `availableCopies > 0` and decrements with `$inc`. Two librarians therefore cannot issue the final copy simultaneously or make inventory negative. A MongoDB transaction is the stronger option when inventory and `BorrowRecord` creation must be fully atomic across documents.

## System Design

[SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) describes the scalable client/CDN/load-balancer/API/Redis/MongoDB architecture, sharding choices, caching, queues and semester traffic handling.

## Deployment

Deploy the frontend to Vercel or an equivalent static host, the backend to Render or an equivalent Node host, and use MongoDB Atlas for production data. Configure `VITE_API_URL` with the backend host and set `CLIENT_ORIGIN` on the backend to the deployed frontend URL. This repository does not claim an existing deployment.

## Exam Requirement Matrix

- **Q1:** [x] schemas, validation, references, REST endpoints, pagination, genre filtering, middleware, JWT, protected routes, race-condition handling, README/API examples
- **Q2:** [x] TypeScript types, typed API client, book list, search, genre filter, loading/error states, issue form, disabled submit, member history, overdue badge, `DataTable<T>`, protected routes, local state
- **Q3:** [x] architecture, MongoDB scaling, shard keys, Redis caching, concurrency, traffic-spike plan, Mermaid diagram and design justifications
