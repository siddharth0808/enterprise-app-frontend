# Enterprise app — Expo (owner side)

Ports the "app" module (`com.example.enterprise`) from the original Android project:
login, register, add  product, view/advance orders — talking to the CDK backend
(`enterprise-app-backend`) over HTTPS with a Cognito JWT on every request.

## Setup

```bash
npm install
```

Fill in `src/config/env.ts` with the three CDK outputs from `enterprise-app-backend`:
- `UserPoolId` -> `USER_POOL_ID`
- `UserPoolClientId` -> `USER_POOL_CLIENT_ID`
- `ApiUrl` -> `API_BASE_URL`

Then:

```bash
npx expo start
```

## How auth flows through the app

1. `RegisterScreen` calls Cognito directly (`amazon-cognito-identity-js`) to create
   the account and confirm the SMS code — no backend call yet.
2. After confirmation, it signs in (getting a JWT) and calls `POST /register` to
   write the canteen profile row into DynamoDB.
3. `LoginScreen` calls Cognito's `authenticateUser`, which returns a session
   containing the JWT id token.
4. `AuthContext` holds sign-in state and exposes `ownerId` (decoded from the JWT's
   `sub` claim) to every screen.
5. `api/client.ts` attaches `Authorization: Bearer <idToken>` to every request —
   API Gateway's Cognito JWT authorizer validates it before Lambda ever runs.

## What's stubbed vs. built out

- **Built**: Login, Register (with SMS confirmation),  Products + Add product, Orders
  list + status advance (Placed → Preparing → Shipped)
- **Stubbed**: image upload on Add Item — the presign endpoint
  (`presignImageUpload` in `api/endpoints.ts`) is ready, just needs
  `expo-image-picker` wired in to actually pick and PUT a file
- **Not started**: the customer-facing ordering flow (browse products → cart → place
  order → track status) — the original `enterprise` module was still
  boilerplate, so this needs building from scratch using the same `endpoints.ts`
  functions (`listProducts`, `placeOrder`)

## Next steps

- Wire up the customer app (new screens, same API client/auth context — just a
  `role: 'customer'` sign-up instead of `'owner'`)
- Add `expo-image-picker` + finish the image upload flow on Add Item
- Add pull-to-refresh polling or a lightweight WebSocket for live order status
  instead of manual refresh, if you want true real-time updates on the owner side
