# Collaborative To-Do List REST API

A production-ready Express + MongoDB/Mongoose REST API implementing the assignment requirements for a collaborative To-Do List application.

## Tech stack
- Node.js
- Express 5
- MongoDB
- Mongoose
- dotenv
- Postman for API testing

## Project structure

```text
server/
├── middleware/
│   └── errorHandler.js
├── models/
│   └── Task.js
├── routes/
│   └── taskRoutes.js
├── .env.example
├── .gitignore
├── index.js
├── package.json
└── package-lock.json
postman/
└── todo-api.postman_collection.json
```

## 1. Install dependencies

```bash
cd server
npm install
```

## 2. Configure MongoDB

Copy `.env.example` to `.env` and update the connection string if needed:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/tododb
NODE_ENV=development
```

## 3. Start the API

```bash
npm start
```

Development mode:

```bash
npm run dev
```

The API runs at `http://localhost:4000` by default.

## 4. Endpoints

| Method | Endpoint | Purpose | Success |
|---|---|---|---|
| POST | `/api/tasks` | Create task | 201 |
| GET | `/api/tasks` | Read all tasks | 200 |
| GET | `/api/tasks/:id` | Read one task | 200 / 404 |
| PATCH | `/api/tasks/:id` | Update task | 200 / 404 |
| DELETE | `/api/tasks/:id` | Delete task | 204 / 404 |

## Task schema

- `id`: MongoDB ObjectId exposed as a resource identifier
- `title`: required, trimmed, 1–100 characters
- `description`: optional string
- `isCompleted`: boolean, defaults to `false`
- `dueDate`: optional date/timestamp
- `createdAt`: automatic timestamp
- `updatedAt`: automatic timestamp

## Example POST body

```json
{
  "title": "Finish REST API assignment",
  "description": "Complete implementation and testing",
  "isCompleted": false,
  "dueDate": "2026-08-20T18:00:00.000Z"
}
```

## Validation and error handling

- Missing/empty title: `400 Bad Request`
- Title over 100 characters: `400 Bad Request`
- Invalid `completed` query value: `400 Bad Request`
- Invalid MongoDB task ID: `400 Bad Request`
- Existing task not found: `404 Not Found`
- Unexpected runtime/database errors: `500 Internal Server Error`
- Invalid JSON body: `400 Bad Request`

The global error handler intentionally returns a clean production-safe message for unexpected 500 errors rather than exposing stack traces.

## Postman

Import `postman/todo-api.postman_collection.json` into Postman. The collection contains sample requests for create, read all, filtered read, read one, update, and delete operations. The collection stores the task ID returned by the create request for subsequent requests.

## Demonstration checklist

For the required 3–5 minute walkthrough, demonstrate:
1. MongoDB connection and server startup.
2. POST task creation and the 201 response.
3. GET all tasks and the 200 response.
4. GET completed tasks using `?completed=true`.
5. GET one task using its URL ID.
6. PATCH task update and the updated response.
7. GET a non-existing ID to show 404.
8. DELETE the task and show the 204 response.
9. Briefly show the Task model and global error middleware.
