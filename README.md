# SkillBridge Client

Freelance service marketplace frontend built with React 19, Vite, TypeScript, and Tailwind CSS.

**Live URL:** [https://skill-bridge-demo.vercel.app](https://skill-bridge-demo.vercel.app)

---

## Tech Stack

| Tool            | Purpose                                              |
| --------------- | ---------------------------------------------------- |
| React 19        | UI framework                                         |
| Vite 8          | Build tool & dev server                              |
| TypeScript 6    | Type safety                                          |
| React Router v7 | Routing (`createBrowserRouter`, data router)         |
| Tailwind CSS v4 | Styling (CSS-first, tokens in `src/index.css`)       |
| shadcn/ui       | Accessible UI component library (Radix + Base UI)    |
| TanStack Query  | Server state, caching, auto refetch on mutation      |
| Zustand         | Auth/global client state (JWT tokens, user profile)  |
| Axios           | HTTP client (JWT request/response interceptors)      |
| React Hook Form | Form state management                                |
| Zod             | Schema validation (form + API response validation)   |
| Sonner          | Toast notifications                                  |
| Recharts        | Charts (analytics dashboards)                        |
| next-themes     | Dark/light/system theme toggle                       |
| lucide-react    | Icons                                                |

## Quick Start

```bash
# install dependencies
npm install

# start development server
npm run dev

# build for production
npm run build

# preview production build
npm run preview
```

## Environment Variables

Create a `.env` file in the client root:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

> **Note:** The backend API must be running and CORS must allow the client origin. See `client/.env.example`.

## Project Structure

```
client/
├── src/
│   ├── main.tsx               # Entry point (QueryClientProvider, ThemeProvider, RouterProvider)
│   ├── App.tsx                # Root component
│   ├── index.css              # Tailwind v4 tokens, theme variables, dark/light mode
│   │
│   ├── routes/
│   │   ├── router.tsx         # createBrowserRouter config (role-based + protected routes)
│   │   └── ProtectedRoute.tsx # Auth + role-gated route wrapper
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginRegister.tsx  # Shared tabbed login/register page
│   │   │   ├── Login.tsx          # Renders LoginRegister with initialTab="login"
│   │   │   ├── Register.tsx       # Renders LoginRegister with initialTab="register"
│   │   │   └── OAuthCallback.tsx  # Handles Google/GitHub OAuth redirect callback
│   │   ├── home/
│   │   │   └── Home.tsx           # Landing page (hero, categories, popular services, stats)
│   │   ├── services/
│   │   │   ├── ServiceList.tsx    # Browse + filter + search + pagination
│   │   │   └── ServiceDetails.tsx # Service detail page with OrderDialog
│   │   ├── dashboard/
│   │   │   ├── DashboardIndex.tsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminOverview.tsx
│   │   │   │   ├── ManageUsers.tsx
│   │   │   │   ├── ManageCategories.tsx
│   │   │   │   └── ManageOrders.tsx
│   │   │   ├── client/
│   │   │   │   ├── ClientOverview.tsx
│   │   │   │   ├── MyOrders.tsx
│   │   │   │   └── ClientProfile.tsx
│   │   │   └── freelancer/
│   │   │       ├── FreelancerOverview.tsx
│   │   │       ├── MyServices.tsx
│   │   │       ├── CreateService.tsx
│   │   │       ├── EditService.tsx
│   │   │       └── ReceivedOrders.tsx
│   │   └── NotFound.tsx           # 404 page
│   │
│   ├── components/
│   │   ├── layout/               # Navbar, Footer, DashboardLayout, DashboardSidebar, ThemeToggle
│   │   ├── shared/               # Loader, ErrorState, EmptyState, PageHeader, Pagination
│   │   ├── service/              # ServiceCard, ServiceFilterBar, ServiceForm
│   │   ├── order/                # OrderCard, OrderStatusBadge
│   │   ├── home/                 # Hero, BrowseCategory, PopularServices, Stats, HowItWorks
│   │   └── ui/                   # shadcn/ui components (15+)
│   │
│   ├── api/                      # Axios instance + per-module API clients
│   │   ├── axiosInstance.ts      # Base URL, JWT attach, refresh-on-401, logout on failure
│   │   ├── auth.api.ts
│   │   ├── user.api.ts
│   │   ├── category.api.ts
│   │   ├── service.api.ts
│   │   ├── order.api.ts
│   │   └── review.api.ts
│   │
│   ├── hooks/                    # useQuery/useMutation wrappers
│   │   ├── useAuth.ts
│   │   ├── useServices.ts
│   │   ├── useOrders.ts
│   │   ├── useCategories.ts
│   │   ├── useReviews.ts
│   │   └── useUsers.ts
│   │
│   ├── store/
│   │   └── authStore.ts          # Zustand: user, tokens, login/logout, persist + rehydrate
│   │
│   ├── types/                    # TypeScript type definitions
│   │   ├── api.types.ts          # ApiResponse<T>, PaginatedResponse, ErrorResponse
│   │   ├── user.types.ts         # Role, User, AuthResponse, UpdateProfilePayload
│   │   ├── service.types.ts     # Category, Service, ServiceDetail, ServiceFilters
│   │   ├── order.types.ts       # OrderStatus, Order, CreateOrderPayload
│   │   └── review.types.ts      # Review, CreateReviewPayload
│   │
│   ├── lib/
│   │   ├── utils.ts             # getErrorMessage, clsx, cn helpers
│   │   └── format.ts            # Price, date, rating formatting
│   │
│   └── public/                    # Static assets (favicon, logos, etc.)
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── package.json
└── .env.example
```

## Authentication Flow

```
Login / Register
  → authApi.login / authApi.register
  → authStore.login() (stores JWT access + refresh tokens)
  → Redirect based on role:
    - CLIENT → /dashboard/client/overview
    - FREELANCER → /dashboard/freelancer/overview
    - ADMIN → /dashboard/admin/overview

Subsequent requests
  → Axios interceptor attaches Bearer token from authStore
  → 401 response → refresh-token flow
  → Refresh failure → authStore.logout() + redirect to /login
```

### OAuth

```
Login with Google/GitHub
  → window.location.href = {VITE_API_BASE_URL}/auth/google|github
  → Backend redirects to CLIENT_URL with ?accessToken=...&refreshToken=...
  → OAuthCallback page stores tokens in authStore → role-based redirect
```

### Demo Credentials

| Role       | Email               | Password         |
| ---------- | ------------------- | ---------------- |
| Admin      | admin@skillbridge.com | Password123!  |
| Client     | nusrat@example.com  | Password123!     |
| Freelancer | rakib@example.com   | Password123!     |

## Client-Side Routing

| Path                                | Component          | Access         |
| ----------------------------------- | ------------------ | -------------- |
| `/`                                 | Home               | Public         |
| `/services`                        | ServiceList        | Public         |
| `/services/:id`                    | ServiceDetails     | Public         |
| `/login`                           | Login              | Public         |
| `/register`                        | Register           | Public         |
| `/oauth-callback`                  | OAuthCallback      | Public         |
| `/dashboard/client/overview`       | ClientOverview     | Client         |
| `/dashboard/client/orders`         | MyOrders           | Client         |
| `/dashboard/client/profile`        | ClientProfile      | Client         |
| `/dashboard/freelancer/overview`   | FreelancerOverview | Freelancer     |
| `/dashboard/freelancer/services`   | MyServices         | Freelancer     |
| `/dashboard/freelancer/services/new` | CreateService   | Freelancer     |
| `/dashboard/freelancer/services/:id/edit` | EditService  | Freelancer     |
| `/dashboard/freelancer/orders`     | ReceivedOrders     | Freelancer     |
| `/dashboard/admin/overview`        | AdminOverview      | Admin          |
| `/dashboard/admin/users`           | ManageUsers        | Admin          |
| `/dashboard/admin/categories`      | ManageCategories   | Admin          |
| `/dashboard/admin/orders`          | ManageOrders       | Admin          |
| `*`                                 | NotFound           | Public         |

## API Client

All API calls go through `api/axiosInstance.ts` which:

1. Sets `baseURL` from `VITE_API_BASE_URL`
2. Attaches `Authorization: Bearer <accessToken>` to every request
3. On 401, attempts silent refresh using `refreshToken`
4. On refresh failure, dispatches `auth:logout` event and redirects to `/login`

React Query hooks (`useServices`, `useOrders`, `useCategories`, `useReviews`, `useUsers`, `useAuth`) wrap API calls with caching, loading, and error states.

## User Roles & Permissions

| Feature                        | Reader | Freelancer | Admin |
| ------------------------------ | :----: | :--------: | :---: |
| Browse services                |   ✅   |    ✅     |  ✅   |
| Place orders                   |   ✅   |    ✅     |  ✅   |
| Create/edit services           |   ❌   |    ✅     |  ✅   |
| Manage own service orders      |   ❌   |    ✅     |  ✅   |
| Create reviews (completed orders only) | ✅ | ✅ | ✅ |
| Manage all users               |   ❌   |    ❌     |  ✅   |
| Manage all categories          |   ❌   |    ❌     |  ✅   |
| View platform analytics        |   ❌   |    ❌     |  ✅   |

## Styling & Design System

- **Tailwind CSS v4** — CSS-first configuration; all design tokens live in `src/index.css`
- **shadcn/ui** — Prebuilt accessible components (Table, Dialog, Sheet, Badge, Button, Input, Select, etc.)
- **Theme** — Dark-first with light mode support via `next-themes` (`ThemeProvider` in `main.tsx`)
- **Custom Properties** — CSS variables for colors, star ratings, and dark/light mode tokens

## Performance Optimizations

- **TanStack Query caching** — 60s stale time, automatic background refetch
- **React Hook Form** — Zero re-renders on input change, Zod validation
- **Suspense & Skeletons** — `LoadingState` component with skeleton loaders
- **Route-based code splitting** — Vite + React Router 7 lazy loading
- **Image optimization** — Next/Image-style optimized images via Vite assets

## Environment Setup

| File             | Required | Description                         |
| ---------------- | :------: | ----------------------------------- |
| `.env`           |   Yes    | `VITE_API_BASE_URL=http://localhost:5000/api` |
| `client/.env`    |    No    | Defaults to localhost:5000/api      |

## Build & Deploy

```bash
npm run build     # tsc type-check + vite build
npm run preview   # preview production build locally
```

Deploy to Vercel by linking the `client/` directory. Ensure `VITE_API_BASE_URL` points to the deployed backend API.
