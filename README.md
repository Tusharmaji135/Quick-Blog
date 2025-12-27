# Quick-Blog

A full‑stack blog platform built with React (Vite) on the client and Node.js/Express + MongoDB on the server. It supports rich‑text editing (Quill), image uploads to Cloudinary, cookie‑based auth with JWT, an admin dashboard, and AI‑assisted content generation via Google Gemini.

## Features

- Modern React app (Vite) with Tailwind CSS
- Rich‑text editor using Quill
- Image upload and transformation via Cloudinary
- Secure auth using JWT stored in HTTP‑only cookies
- Role‑based access: viewer vs admin
- Admin dashboard to manage blogs and comments
- Comments with approval workflow
- AI content generation using Gemini 2.5 Flash
- Clean REST API with Express and Mongoose

## Tech Stack

- Client: React 19, Vite 7, Tailwind CSS 4, Axios, React Router
- Server: Node.js, Express 5, Mongoose 9, JWT, Multer, Cloudinary
- Database: MongoDB
- AI: @google/genai (Gemini)

## Monorepo Structure

```
client/
	src/                # React app source
	public/             # Static assets
	package.json        # Client dependencies & scripts
	vite.config.js      # Vite + Tailwind plugin config
	.env                # Client env (VITE_* only)

server/
	server.js           # Express app entrypoint
	configs/            # DB, Cloudinary, Gemini config
	controllers/        # Route handlers
	middlewares/        # Auth, Multer upload
	models/             # Mongoose schemas
	routes/             # Express route modules
	package.json        # Server dependencies & scripts
	.env                # Server env (secrets)

README.md             # This file
```

## Prerequisites

- Node.js 18+ (LTS recommended)
- A MongoDB instance (Atlas or local)
- Cloudinary account (for image storage)
- Google AI Studio API key (Gemini)
- Optional: ImageKit credentials (present in configs but not required for current flows)

## Environment Variables

Create two `.env` files—one in `server/` and one in `client/`. Do not commit secrets.

### Server `.env`

```
# Server
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Admin login (email/password checked server-side for adminLogin)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=super_secure_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Optional ImageKit (currently unused in routes)
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
```

### Client `.env`

```
# Base URL for Axios (must point to your server)
VITE_BASE_URL=http://localhost:5000
```

## Install and Run (Windows PowerShell)

Open two terminals—one for the server and one for the client.

```pwsh
# Terminal 1: Server
cd "C:\Users\tushar\Desktop\New folder\BlogWeb\server"
npm install
npm run dev

# The server will start on http://localhost:5000
```

```pwsh
# Terminal 2: Client
cd "C:\Users\tushar\Desktop\New folder\BlogWeb\client"
npm install
npm run dev

# Vite dev server runs on http://localhost:5173
```

Server CORS is configured to allow the Vite dev origin `http://localhost:5173`.

## API Overview

Base URL: `http://localhost:5000`

### Auth

- `POST /api/auth/register` — register viewer/admin users
  - body: `{ name, email, password }`
- `POST /api/auth/login` — login; sets `token` or `adminToken` cookie based on role
  - body: `{ email, password }`

### Admin

- `POST /api/admin/login` — email/password checked against `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- `GET /api/admin/blogs` — list all blogs (auth required)
- `GET /api/admin/comments` — list all comments (auth required)
- `POST /api/admin/delete-comment` — delete by `{ id }` (auth)
- `POST /api/admin/approve-comment` — approve by `{ id }` (auth)
- `GET /api/admin/dashboard` — counts + recent items (auth)

### Blog

- `GET /api/blog/all` — published blogs
- `GET /api/blog/:blogId` — single blog
- `POST /api/blog/add` — create blog (auth, multipart)
  - form-data:
    - `image`: file
    - `blog`: JSON string with `{ title, subTitle, category, isPublished, content }`
- `PUT /api/blog/edit` — update blog (auth, multipart; optional new `image`)
- `DELETE /api/blog/delete` — body `{ id }` (auth)
- `PATCH /api/blog/toggle-publish` — body `{ id }` (auth)
- `POST /api/blog/add-comment` — body `{ blog, name, content }`
- `POST /api/blog/comments` — body `{ blogId }` (approved comments)
- `POST /api/blog/generate` — body `{ prompt }` (auth) → returns HTML content from Gemini

## Data Models

### Blog

```
{
	title: String,
	subTitle: String,
	description: String,   # HTML content
	category: String,
	image: String,         # Cloudinary URL
	imageId: String,       # Cloudinary public_id
	isPublished: Boolean,
	publishedBy?: ObjectId(User),
	timestamps: true
}
```

### Comment

```
{
	blog: ObjectId(Blog),
	name: String,
	content: String,
	isApproved: Boolean,
	timestamps: true
}
```

### User

```
{
	name: String,
	email: String,
	password: String (bcrypt hashed),
	role: "admin" | "viewer",
	timestamps: true
}
```

## Client Routes (UI)

- `/` — Home, list of blogs
- `/blog/:id` — Blog detail (requires login as viewer or admin)
- `/login` — Login (redirects if already logged in)
- `/register` — Register (redirects if already logged in)
- `/admin` — Admin layout (protected)
  - `index` — Dashboard
  - `addBlog` — Create blog with Quill editor + image upload + AI
  - `listBlog` — Manage existing blogs
  - `comments` — Review and approve comments

## Common Tasks

- Add a blog: Admin → Add Blog → fill fields → optional “Generate with AI” → upload thumbnail → publish or save as draft.
- Approve comments: Admin → Comments → Approve/Delete.
- Toggle publish: Admin → List Blog → Toggle publish.

## Notes

- Cookies: Admin endpoints require `adminToken` (set via admin login). Viewer login sets `token` cookie.
- Upload limits: Multer in-memory storage with 5MB limit; images are streamed to Cloudinary and transformed to WebP.
- CORS: Server allows `http://localhost:5173` with credentials.

## Scripts

### Client

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview built app
- `npm run lint` — lint code

### Server

- `npm run dev` — start with Nodemon
- `npm start` — start with Node

## Contributing

PRs are welcome. Please open an issue to discuss major changes. Ensure env values are mocked in examples and never commit secrets.

## License

ISC

---

### Troubleshooting

- 401 Unauthorized on admin routes: ensure you’ve logged in via `/api/admin/login` and have `adminToken` cookie set.
- Image upload failing: check Cloudinary credentials and file size (<5MB).
- AI generation failing: verify `GEMINI_API_KEY` and network access.
