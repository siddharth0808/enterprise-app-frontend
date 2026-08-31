# GoodsWise (Web)

A React + TypeScript port of the `enterprise-app-frontend` React Native app, rebuilt as a
responsive web app and restyled to match the GoodsWise Figma design.

## Stack

- **React 19 + TypeScript**, built with **Vite**
- **React Router v6** for routing and route guards
- **Redux Toolkit** for state (auth, business, inventory)
- **styled-components** for styling, theme tokens taken from Figma
- **Amazon Cognito** (`amazon-cognito-identity-js`) for authentication

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your real API/Cognito values
npm run dev
```

Other scripts:

```bash
npm run build     # type-check + production build
npm run lint      # oxlint
npm run preview   # preview the production build locally
```

## Environment variables

All configuration lives in `.env` (see `.env.example`). The app fails fast at startup with a
clear error if any of these are missing - nothing is hardcoded in source:

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL of the backend REST API |
| `VITE_AWS_REGION` | AWS region for the Cognito User Pool |
| `VITE_COGNITO_USER_POOL_ID` | Cognito User Pool ID |
| `VITE_COGNITO_USER_POOL_CLIENT_ID` | Cognito App Client ID |

## Architecture

Feature-based structure under `src/`:

```
app/            store config, typed hooks, router + route guards
components/     shared UI (common/) and app shell (layout/)
config/         env + Cognito config (no literals outside this layer)
features/
  auth/         login, signup, email verification
  business/     business setup + business Redux slice
  inventory/    inventory list, add product
  profile/      profile page (account + editable business info)
services/
  api/          single fetch wrapper (apiClient) + normalized ApiError
  cognito/      the only module that imports the Cognito SDK directly
styles/         theme tokens, breakpoints, global styles
utils/          validation + formatting helpers
```

Pages never call `fetch` or the Cognito SDK directly - they dispatch Redux thunks, which call
a feature's repository/service, which calls `apiClient` or `cognito.service`. This keeps the
UI layer free of transport/auth details and makes both easy to swap later.

### Route guards

- `PublicRoute` - Login/Signup/Verify Email; redirects signed-in users onward.
- `AuthenticatedRoute` - requires a signed-in user; shows a loader while the session is being
  restored at startup.
- `BusinessSetupRoute` - requires both auth **and** a completed Business Setup (Inventory,
  Add Product, Profile); redirects to `/business-setup` otherwise.

### Sign out

Sign out dispatches a single `resetApplicationState` action (see `app/store/actions.ts`) that
every feature slice listens for, so auth/business/inventory state is cleared together - no
stale data can leak into the next session.

## Notable changes from the original React Native app

- **Auth switched from phone-number to email**, per the Figma designs (login/signup/verify
  screens all use email). The Cognito wrapper (`services/cognito/cognito.service.ts`) uses
  email as the Cognito username.
- Navigation (`OwnerDrawer`/stack navigators) was replaced with React Router and a responsive
  layout: a fixed sidebar on desktop/tablet, a bottom nav bar on mobile.
- Screens were re-scoped to the MVP: Login, Signup, Email Verification, Business Setup,
  Inventory List, Add Product, and Profile (business-info editing). Sales, Purchases,
  Suppliers, and AI features from the original app are out of scope for this port.
