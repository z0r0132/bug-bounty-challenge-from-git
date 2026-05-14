# Supplier OS — Bug bounty demo (frontend)

React + TypeScript + MobX + MUI demo used for a frontend exercise. There is **no real backend**; session and profile data are **mocked** and persisted in **`localStorage`** for coherent UX.

## Improvements made

- Fixed listed UI/runtime issues (countdown interval cleanup, avatar / `Grow` ref, i18n, routing types, CRA/Babel compatibility).
- **Mock authentication**: sign-in page (`#/login`); any non-empty email + password creates a session and navigates to the app.
- **Logout**: clears mock session and profile routing to the login screen (`HashRouter` + `Redirect`).
- **Profile & organization**: dialogs from the avatar menu; changes persist in `localStorage` and refresh the MobX user/organization state.
- **Countdown**: stops at `00:00`, shows **“Challenge ended”**, clears the timer, and **disables language switching** and **profile shortcuts** (logout and legal links remain usable).
- **Loading / error**: linear progress + spinner while the mock “load user” runs; retry on failure.
- **Structure**: centralized mock helpers under `src/mock/` (`session`, `user`, `organization`, `constants`), reusable `useChallengeCountdown` hook.

## Design decisions & assumptions

This app is intentionally **frontend-only** and **demo-oriented**. I kept implementation **mock-based** and avoided JWT, OAuth, servers, or databases. The goal is **UX coherence**, **clear state flow**, and **maintainability**—not production security.

- **Session** is a JSON blob in `localStorage` (`osapiens-demo-session`), not a secure token.
- **Profile / organization** use separate keys (`osapiens-demo-profile`, `osapiens-demo-organization`).
- **Legal / privacy** dialogs contain **placeholder copy** explaining the above.

## Scripts

- `npm start` — dev server (uses `NODE_OPTIONS=--openssl-legacy-provider` with webpack 4 on newer Node).
- `npm run build` — production bundle.
- `npm run lint` — ESLint (`react-app` config).

## Future improvements

- Real backend authentication and API integration.
- Server-side persistence and RBAC.
- Automated E2E tests and accessibility audit beyond the current basics.
