# 3D Studio - Impressões

E-commerce store for 3D printing products built with React, Node.js, Express, and SQLite. Customers can browse products, select variations, add items to cart, and finalize orders via WhatsApp. Administrators can manage products through a secured dashboard.

---

## Features

- Product catalog with image gallery and variation support (color, size, material)
- Shopping cart with real-time quantity controls
- WhatsApp order checkout with pre-filled message
- Admin dashboard with JWT authentication
- Product CRUD: create, edit, toggle active, delete (soft)
- Image upload (up to 5 per product)
- Mobile-first responsive design
- SQLite database with automatic seeding on first run

---

## Project Structure

```
3D-ART/
├── backend/
│   ├── src/
│   │   ├── app.js               # Express entry point
│   │   ├── db/database.js       # SQLite setup + seed
│   │   ├── routes/auth.js       # Login endpoint
│   │   ├── routes/products.js   # Products CRUD + image upload
│   │   └── middleware/auth.js   # JWT verification
│   ├── uploads/                 # Uploaded product images
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── index.css
    │   ├── context/CartContext.jsx
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── ProductGrid.jsx
    │   │   ├── Cart.jsx
    │   │   ├── IsoCube.jsx
    │   │   └── admin/
    │   │       ├── ProductForm.jsx
    │   │       └── ProductList.jsx
    │   └── pages/
    │       ├── Home.jsx
    │       └── Admin.jsx
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

---

## Running Locally

### Prerequisites

- Node.js 18+
- npm or yarn

### Backend

```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables section)

npm run dev
# Server runs on http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) to view the store.
Open [http://localhost:5173/admin](http://localhost:5173/admin) to access the admin panel.

---

## Environment Variables

Create a `.env` file inside the `backend/` directory based on `.env.example`:

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port the backend server listens on | `3001` |
| `JWT_SECRET` | Secret key for signing JWT tokens — **change this in production** | — |
| `ADMIN_USERNAME` | Username for admin login | `douglascosta1` |
| `ADMIN_PASSWORD` | Password for admin login | — |
| `FRONTEND_URL` | Allowed CORS origin for production frontend URL | `http://localhost:5173` |

Example `.env`:

```env
PORT=3001
JWT_SECRET=super_secret_random_string_change_me
ADMIN_USERNAME=douglascosta1
ADMIN_PASSWORD=MySecurePassword123
FRONTEND_URL=http://localhost:5173
```

---

## Default Admin Credentials

On first run the database is seeded with 6 sample products. To log in to the admin panel, use the credentials defined in your `.env` file:

- Username: `ADMIN_USERNAME` value (default: `douglascosta1`)
- Password: `ADMIN_PASSWORD` value

> Important: Always set a strong, unique password before deploying to production.

---

## WhatsApp Configuration

Orders are finalized via WhatsApp. The number is configured in:

```
frontend/src/components/Cart.jsx
```

Look for the constant:

```js
const WHATSAPP_NUMBER = '5548998118661'
```

Replace with your WhatsApp Business number in the international format without `+` or spaces:
- Brazil example: `5548999999999` (55 = country code, 48 = area code, 9-digit number)

---

## Deployment

### Backend — Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repository
3. Set **Root Directory** to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables in the Render dashboard (same as `.env`)
7. Set `FRONTEND_URL` to your deployed frontend URL

> Note: The SQLite database file (`data.db`) is stored on the server's disk. On Render free tier, the disk resets on redeploy. For persistence, consider upgrading to a paid plan with a persistent disk, or migrating to PostgreSQL with `better-sqlite3` replaced by `pg`.

### Frontend — Vercel

1. Create a new project on [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Set **Root Directory** to `frontend`
4. Framework preset: **Vite**
5. Build command: `npm run build`
6. Output directory: `dist`
7. Add environment variable (if needed): none required for frontend by default

After deploying the backend, update `vite.config.js` proxy target or configure `VITE_API_URL` and update all `fetch('/api/...')` calls accordingly. The recommended approach for production is to set the Vite proxy only for local dev and use an environment variable for the API base URL in production builds.

#### Example: production-ready API base URL

```js
// frontend/src/lib/api.js
const BASE_URL = import.meta.env.VITE_API_URL || ''

export async function apiFetch(path, options = {}) {
  return fetch(`${BASE_URL}${path}`, options)
}
```

Set `VITE_API_URL=https://your-backend.onrender.com` in Vercel's environment variables.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v3 |
| Backend | Node.js, Express 4 |
| Database | SQLite via better-sqlite3 |
| Auth | JWT (jsonwebtoken) |
| Image Upload | multer |
| Routing | react-router-dom v6 |

---

## License

MIT
