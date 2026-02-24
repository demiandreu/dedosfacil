# CLAUDE.md — DedosFácil

## Project Overview

DedosFácil is a full-stack SaaS application that helps Spanish property owners submit the mandatory "Modelo N2" short-term rental declaration to the Spanish Property Registry. It targets hosts on Airbnb, Booking.com, and VRBO who need to comply with Real Decreto 1312/2024.

**Production URL:** https://dedosfacil.es

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, React Router 6, Vite 5   |
| Styling    | Plain CSS (no framework)            |
| Icons      | Lucide React                        |
| Backend    | Node.js, Express 4 (ES modules)    |
| Database   | PostgreSQL (via `pg`)               |
| Payments   | Stripe                              |
| Email      | Resend                              |
| AI         | Anthropic Claude SDK                |
| File Parse | Multer (upload), XLSX (Excel/CSV)   |
| Hosting    | Render.com                          |
| Language   | JavaScript throughout (no TypeScript) |

## Repository Structure

```
dedosfacil/
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/           # Page components (one per route)
│   │   │   ├── Landing.jsx        # Homepage with marketing, FAQ, pricing
│   │   │   ├── FormularioNRUA.jsx # Multi-step N2 form (4 steps)
│   │   │   ├── SolicitarNRUA.jsx  # NRUA number request form
│   │   │   ├── MiCuenta.jsx       # User account / property management
│   │   │   ├── Admin.jsx          # Admin dashboard for processing orders
│   │   │   ├── Exito.jsx          # Post-payment success page
│   │   │   ├── Factura.jsx        # Invoice page
│   │   │   ├── Valoracion.jsx     # Review/rating page
│   │   │   ├── Afiliado.jsx       # Affiliate program dashboard
│   │   │   ├── AvisoLegal.jsx     # Legal notice
│   │   │   ├── Privacidad.jsx     # Privacy policy
│   │   │   └── Cookies.jsx        # Cookie policy
│   │   ├── App.jsx          # Router configuration
│   │   ├── index.jsx        # React DOM entry point
│   │   └── index.css        # All application styles (~2200 lines)
│   ├── public/              # Static assets (favicon, images)
│   ├── index.html           # HTML entry with SEO/schema markup
│   ├── vite.config.js       # Vite config (proxy to :3001)
│   └── package.json
├── server/
│   ├── index.js             # All API endpoints (~2350 lines)
│   └── package.json
├── render.yaml              # Render.com deployment configuration
├── package.json             # Root monorepo scripts
├── .gitignore
└── CLAUDE.md                # This file
```

## Development Commands

All commands run from the repository root:

```bash
# Install all dependencies (root + client + server)
npm run install:all

# Start both client and server in dev mode (concurrent)
npm run dev

# Start only the client dev server (Vite, port 5173)
npm run dev:client

# Start only the backend server (Node --watch, port 3001)
npm run dev:server

# Build the client for production
npm run build

# Start the production server
npm start
```

The Vite dev server proxies `/api` requests to `http://localhost:3001`.

## Environment Variables

The server requires these environment variables (set in `.env` or via Render dashboard):

| Variable             | Purpose                                 |
|----------------------|-----------------------------------------|
| `DATABASE_URL`       | PostgreSQL connection string            |
| `STRIPE_SECRET_KEY`  | Stripe API secret key                   |
| `ANTHROPIC_API_KEY`  | Claude API key for CSV processing       |
| `RESEND_API_KEY`     | Resend email service API key            |
| `PORT`               | Server port (defaults to 3001)          |
| `NODE_ENV`           | `production` in deployment              |

Never commit `.env` files. They are in `.gitignore`.

## Routing

Defined in `client/src/App.jsx`:

| Path                  | Component         | Purpose                        |
|-----------------------|-------------------|--------------------------------|
| `/`                   | Landing           | Homepage                       |
| `/formulario`         | FormularioNRUA    | N2 submission form             |
| `/formulario-nrua`    | FormularioNRUA    | Alias for the form             |
| `/exito`              | Exito             | Post-payment confirmation      |
| `/mi-cuenta`          | MiCuenta          | User account management        |
| `/admin`              | Admin             | Admin dashboard                |
| `/factura/:orderId`   | Factura           | Invoice viewer                 |
| `/aviso-legal`        | AvisoLegal        | Legal notice                   |
| `/privacidad`         | Privacidad        | Privacy policy                 |
| `/cookies`            | Cookies           | Cookie policy                  |
| `/afiliado`           | Afiliado          | Affiliate dashboard            |
| `/solicitar-nrua`     | SolicitarNRUA     | NRUA request form              |
| `/valoracion`         | Valoracion        | Review/rating page             |

## API Endpoints

All endpoints are defined in `server/index.js`. Key groups:

### Payment & Orders
- `POST /api/create-checkout-session` — Create Stripe checkout session
- `POST /api/webhook` — Stripe webhook handler (raw body)
- `GET /api/orders/:id` — Get order details
- `GET /api/factura/:orderId` — Get invoice data

### Form Submissions
- `POST /api/submissions` — Create N2 form submission
- `POST /api/process-csv` — Extract reservations from uploaded CSV/Excel files

### Admin
- `GET /api/admin/orders` — List all orders
- `POST /api/admin/send-justificante/:orderId` — Send completion document
- `POST /api/admin/update-nrua/:orderId` — Update NRUA number
- `POST /api/admin/update-stays/:orderId` — Update extracted stays
- `POST /api/admin/update-status/:orderId` — Update order status
- `GET /api/admin/generate-n2-csv/:orderId` — Generate N2 CSV for registry
- `DELETE /api/admin/delete-order/:orderId` — Delete order
- `GET /api/admin/download/:orderId/:fileType` — Download files
- `POST /api/admin/send-review/:orderId` — Send review request email

### NRUA Management
- `GET /api/admin/nrua-requests` — List NRUA requests
- `POST /api/admin/nrua-status/:id` — Update NRUA status

### Affiliate System
- `GET /api/affiliate/validate/:code` — Validate affiliate code
- `POST /api/affiliate/login` — Affiliate login
- `POST /api/affiliate/payment-info` — Affiliate payment details
- `POST /api/affiliate/track-click` — Track affiliate link click
- `GET /api/admin/affiliates` — List all affiliates
- `POST /api/admin/affiliates` — Create affiliate
- `POST /api/admin/affiliates/:id/toggle` — Toggle affiliate active status
- `DELETE /api/admin/affiliates/:id` — Delete affiliate

### User Account (Mi Cuenta)
- `POST /api/mi-cuenta/login` — User login
- `POST /api/mi-cuenta/add-property` — Add property to order
- `POST /api/mi-cuenta/process-csv` — Process CSV from account

### Reviews & Health
- `POST /api/reviews` — Submit a review
- `GET /api/reviews` — Get all reviews
- `GET /api/health` — Health check

## Database

PostgreSQL with the following tables (managed directly via SQL, no ORM):

- `orders` — Payment orders and their status
- `submissions` — N2 form submissions (linked to orders)
- `nrua_requests` — NRUA number requests
- `affiliates` — Affiliate partner records
- `affiliate_referrals` — Referral tracking
- `reviews` — Customer reviews

Database queries use the `pg` library directly with parameterized queries (`$1`, `$2`, etc.).

## Key Business Logic

### N2 Form Workflow (FormularioNRUA)
1. **Step 1:** Contact info (name, email, phone)
2. **Step 2:** Property details (NRUA number, address, cadastral reference)
3. **Step 3:** Upload CSV/Excel of reservations or enter them manually
4. **Step 4:** Review, authorize, and pay via Stripe

### CSV Processing
The server processes CSV/Excel files from multiple platforms:
- **Airbnb, Booking.com, VRBO** — platform-specific column detection
- **Generic CSV/Excel** — flexible header matching
- Multi-language column header detection (Spanish, English, French, German, Italian, Portuguese, and 10+ other languages)
- Automatic date normalization, cancelled booking filtering, guest count extraction

### Pricing
| Plan          | Price  | Properties |
|---------------|--------|------------|
| 1 property    | €99    | 1          |
| 3 properties  | €259   | 3          |
| 10 properties | €799   | 10         |

Affiliate codes can apply discounts. Prices are in cents in the code (9900 = €99).

## Architecture Conventions

### Frontend
- **One page = one file** in `client/src/pages/`. No shared component library — components are inline.
- **Styling** is all in `client/src/index.css`. No CSS modules, no Tailwind, no styled-components.
- **Translations** are inline objects within page components (not a separate i18n library). Supported languages: Spanish, English, French, German.
- **No state management library** — uses React's built-in `useState`/`useEffect`.
- **API calls** use `fetch()` directly (no Axios or similar).

### Backend
- **Single-file server** — all routes and logic live in `server/index.js`.
- **ES modules** — uses `import`/`export` syntax (`"type": "module"` in package.json).
- **Raw SQL** — no ORM. All database queries are parameterized via `pg`.
- **File uploads** handled via Multer with in-memory storage.
- **Stripe webhook** requires raw body parsing (registered before `express.json()` middleware).

### General
- **No TypeScript** — the entire codebase is JavaScript.
- **No linting/formatting config** — no ESLint, Prettier, or similar tools.
- **No tests** — no test framework or test files.
- **No CI/CD pipeline** — deployment is via Render.com's Git integration.
- **Monorepo** with root-level scripts orchestrating `client/` and `server/`.

## Deployment

Hosted on **Render.com**. Configuration in `render.yaml`:

- **Build:** `npm install && cd client && npm install && npm run build && cd ../server && npm install`
- **Start:** `cd server && npm start`
- **Static files:** The server serves the built React app from `client/dist/` in production.

The server serves the React SPA for non-API routes in production (configured in `server/index.js`).

## Common Tasks

### Adding a new page
1. Create `client/src/pages/NewPage.jsx`
2. Add the route in `client/src/App.jsx`
3. Add styles in `client/src/index.css`

### Adding a new API endpoint
1. Add the route handler in `server/index.js`
2. Follow existing patterns: `app.get/post/delete('/api/...', async (req, res) => { ... })`
3. Use parameterized queries for any database operations

### Adding translations
Translations are inline in each page component. Add new language keys to the existing translation objects within the relevant page file.

## Important Notes

- The Stripe webhook endpoint must receive raw body — it is registered before `express.json()` middleware.
- Email sending uses Resend with HTML templates inline in the server code.
- The Anthropic SDK is used for intelligent CSV data extraction.
- Google Analytics conversion tracking tag `AW-17930854958` is embedded in the client.
- The admin dashboard at `/admin` has no authentication gate in the frontend — access control relies on deployment/network configuration.
