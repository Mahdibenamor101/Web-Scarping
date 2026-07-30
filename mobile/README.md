# mbQr Staff (mobile)

Android + iOS app for restaurant staff: live order board with push notifications, and
(for owner/manager) team, menu, tables/QR, analytics, branding and subscription
management — the mobile equivalent of the web dashboard at the repo root.

Built with Expo + Expo Router (React Native), TypeScript. One codebase, two
platforms — there is no separate mobile backend: every screen calls the exact
same `/api/*` routes as the web dashboard (`src/app/api/**` at the repo root).

## Honest limits of this build

- **Never compiled or run on iOS in this environment.** There's no macOS/Xcode here.
  The iOS-specific config (`app.json` → `ios.bundleIdentifier`,
  `UIBackgroundModes: ["remote-notification"]`) is written and consistent with the
  rest of the app, but has never been built or run on a simulator or device. Android
  and the web-export smoke test (see below) are the only targets actually exercised
  in this environment.
- **Push notifications are wired but never delivered to a real device.** Getting a
  usable push token (`expo-notifications`' `getExpoPushTokenAsync`) requires a real
  EAS project id (`app.json` → `extra.eas.projectId`), which doesn't exist here — no
  Expo account was created for this build. `registerForPushNotifications()`
  (`src/lib/push.ts`) fails soft: it `console.warn`s and the app keeps working
  normally with no token registered, rather than crashing login over a missing
  credential. The send side (`src/lib/push.ts` on the backend, `src/app/api/**`) was
  verified for real — a genuine HTTP call to Expo's push endpoint with no error — but
  actual on-device delivery needs a configured EAS project plus (for production
  builds) real Apple Push/Firebase credentials.
- **Typography is a system-font approximation, not the web app's exact faces.**
  Installing the real fonts (`@expo-google-fonts/big-shoulders-display`,
  `-manrope`, `-jetbrains-mono`) hit a real `npm` peer-dependency conflict
  (`ERESOLVE`) between those packages and `expo-router`'s own web-only
  dependencies (`vaul` → `@radix-ui/*`) in this Expo SDK version — unrelated to the
  fonts themselves. Not worth forcing with `--legacy-peer-deps` for a font swap.
  Colors and border radii match the web app's "Comanda" tokens exactly
  (`src/lib/theme.ts`); only the typefaces are a system-font stand-in
  (`fontWeight: "800"` for headings, `Courier` for monospace).

## Running it

```bash
# from the repo root, with the web app already running (npm run dev)
cd mobile
npm install
cp .env.example .env   # then edit EXPO_PUBLIC_API_URL, see below
npx expo start
```

Scan the QR code with **Expo Go** (iOS/Android) — no native build needed for
development. Sign in with the same demo account as the web dashboard:
`owner@demo.local` / `password123`.

### `EXPO_PUBLIC_API_URL`

The mobile app has no backend of its own — it points at the root Next.js app's
`/api/*` routes. `localhost` almost never works here: on a physical device or in
most emulators it resolves to the device itself, not your computer.

- Physical device via Expo Go: your computer's LAN IP, e.g. `http://192.168.1.42:3000`
  (same Wi-Fi network as the device).
- Android emulator: `http://10.0.2.2:3000` (a fixed alias the emulator maps to the
  host machine).
- iOS simulator only: `http://localhost:3000` works, since the simulator shares the
  host's network stack (a real device does not).

### Building for real (EAS)

Not done in this environment (no Expo account configured here), but the path is:

```bash
npm install -g eas-cli
eas login
eas build:configure   # writes a real extra.eas.projectId into app.json
eas build --platform android
eas build --platform ios   # requires an Apple Developer account
```

Push notifications only work end-to-end once `extra.eas.projectId` is real and (for
production) Apple Push/Firebase credentials are set up in your EAS project.

## Architecture notes

- **Auth**: bearer token, not the web's httpOnly cookie — React Native's `fetch` has
  no cookie jar. `/api/auth/login`, `/api/auth/signup`, and
  `/api/invitations/accept` (root project) return the same signed session JWT in the
  JSON body that the web app gets as a cookie; `getSession()`
  (`src/lib/session.ts`, root project) checks the `Authorization: Bearer <token>`
  header before falling back to the cookie, so every existing API route works for
  both clients unchanged. The token is stored via `expo-secure-store`
  (Keychain/Keystore-backed on device); see `src/lib/api.ts`.
- **Navigation**: Expo Router (file-based, like Next.js App Router). Four tabs —
  Commandes / Analytics / Gérer / Profil — with Analytics and Gérer hidden for
  server/kitchen roles. Owner/manager-only screens (Équipe, Menu, Tables, Marque,
  Abonnement) live behind the "Gérer" tab as a hub, rather than flattened into the
  tab bar.
- **Live orders**: polling every 4s (`app/(app)/orders.tsx`) plus an immediate
  refetch when a push notification is received — there's no `EventSource` in React
  Native, unlike the web dashboard's SSE-based board.
