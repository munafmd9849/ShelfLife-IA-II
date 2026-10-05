# ShelfLife

## Overview

ShelfLife is a college library management platform for cataloguing books, registering members, issuing and returning books, and viewing a member's borrowing history.

## Features

- JWT-protected librarian actions
- Book catalogue with title search, genre filtering and pagination
- Member registration and complete borrowing history
- Atomic inventory decrement when issuing a book
- Return workflow and overdue status handling

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- Frontend: React, TypeScript, Vite, React Router, Axios

## Project Structure

```text
backend/src/{models,controllers,routes,middleware}
frontend/src/{api,components,pages,types}
SYSTEM_DESIGN.md
```

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

Backend (`backend/.env`):

```env
MONGO_URI=mongodb://127.0.0.1:27017/shelflife
JWT_SECRET=replace_with_a_long_random_secret
PORT=5000
```

Frontend (`frontend/.env`):

```env
VITE_API_URL=http://localhost:5000/api
```

## Authentication

Use the demo librarian account `librarian@shelflife.com` with password `librarian123`. The API returns an eight-hour JWT. The frontend stores it in `localStorage` and sends it as a Bearer token for issue and return actions.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | API health check |
| POST | `/api/auth/login` | Librarian login |
| POST | `/api/books` | Add a book |
| GET | `/api/books?page=1&limit=10&genre=&search=` | List/search books |
| POST | `/api/members` | Register a member |
| GET | `/api/members` | List members for issuing |
| GET | `/api/members/:id/history` | Member borrowing history |
| POST | `/api/borrow` | Issue a book (JWT required) |
| POST | `/api/return/:borrowId` | Return a book (JWT required) |

## Sample API Requests

```bash
curl http://localhost:5000/api/health
curl -X POST http://localhost:5000/api/auth/login -H 'Content-Type: application/json' -d '{"email":"librarian@shelflife.com","password":"librarian123"}'
curl -X POST http://localhost:5000/api/books -H 'Content-Type: application/json' -d '{"title":"Dune","author":"Frank Herbert","isbn":"9780441172719","genre":"Science Fiction","totalCopies":3,"availableCopies":3}'
curl -X POST http://localhost:5000/api/members -H 'Content-Type: application/json' -d '{"name":"Ava Patel","email":"ava@example.edu","membershipId":"LIB-001"}'
curl -X POST http://localhost:5000/api/borrow -H 'Content-Type: application/json' -H 'Authorization: Bearer YOUR_TOKEN' -d '{"bookId":"BOOK_ID","memberId":"MEMBER_ID","dueDate":"2026-11-01"}'
curl -X POST http://localhost:5000/api/return/BORROW_ID -H 'Authorization: Bearer YOUR_TOKEN'
```

## Frontend Routes

- `/login` — librarian sign-in
- `/books` — searchable catalogue and member list
- `/issue` — protected issue-book form
- `/members/:id/history` — member borrowing history

## State Management Choice

Local component state is sufficient because the application is small and the exam requirements do not require a global state-management library.

## Race Condition Handling

Issuing uses MongoDB `findOneAndUpdate` with `availableCopies: { $gt: 0 }` and `$inc: { availableCopies: -1 }`. This is a single atomic operation, so concurrent requests cannot both consume the final available copy.

## System Design

See [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) for the scalable architecture, caching, database-sharding, concurrency and peak-traffic design.

## Deployment

Deploy the stateless backend with `MONGO_URI` and `JWT_SECRET` set in the hosting environment. Build the frontend with `npm run build`, set `VITE_API_URL` to the deployed API URL, and serve the generated `dist` directory through a CDN/static host. Configure the API's CORS policy to allow the frontend domain in production.
