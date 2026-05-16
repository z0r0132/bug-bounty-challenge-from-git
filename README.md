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
- `npm run preview` — build, then serve production output on **http://localhost:2222** (`#/login` for sign-in).
- `npm run lint` — ESLint (`react-app` config).

### CodeSandbox / VS Code preview (port 2222)

- **[`.codesandbox/tasks.json`](.codesandbox/tasks.json)** — CodeSandbox VM default: **`preview`** runs `preview:serve` on **port 2222** at sandbox start (build runs in `setupTasks`).
- **[`.vscode/tasks.json`](.vscode/tasks.json)** — VS Code / CodeSandbox editor: **`Preview (port 2222)`** is the default build task and runs on folder open; it builds, then serves on **2222**.
- **[`.vscode/settings.json`](.vscode/settings.json)** — forwards **2222** and opens the browser when that port is detected.

If the browser still shows port 3000, open **DevTools → Previews** and select the preview tagged **Preview (port 2222)** / port **2222**, or run task **Preview (port 2222)** from the command palette (`Tasks: Run Task`).

## Future improvements

- Real backend authentication and API integration.
- Server-side persistence and RBAC.
- Automated E2E tests and accessibility audit beyond the current basics.
