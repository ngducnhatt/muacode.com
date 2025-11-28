# Repository Guidelines

## Project Structure & Module Organization
- Next.js App Router lives in `src/app`. Each route has `page.tsx`; shared layout in `src/app/layout.tsx` and segment-specific layouts like `src/app/products/layout.tsx`.
- UI components in `src/app/components/**/*` (home, products, common header/footer). Keep reusable pieces under `components` and route-specific wrappers next to their route.
- Data/services in `src/lib` (`data.ts` for Supabase fetches, `supabaseClient.ts` for client setup, `types.ts` for shapes).
- Static assets in `public/` and `public/assets/`. Avoid importing from `.next/`.

## Build, Test, and Development Commands
- `npm run dev` — start Next dev server with hot reload on http://localhost:3000.
- `npm run build` — production build; fails on type errors.
- `npm run start` — serve the production build locally.
- `npm run lint` — ESLint with Next core-web-vitals rules.

## Coding Style & Naming Conventions
- TypeScript with `strict` on and App Router patterns (async server components by default). Prefer server data fetching (`src/lib/data.ts`) over client calls when possible.
- Components and files in `components` use `PascalCase`; route folders stay lowercase to match URLs.
- Tailwind is the primary styling tool; keep utility ordering readable and favor `clsx` for conditional classes.
- Use tabs as in existing files and double quotes for strings; avoid `any` unless unavoidable and then document why.

## Testing Guidelines
- No automated test suite is present; run `npm run lint` and smoke-test affected routes in `npm run dev`.
- When adding logic-heavy changes, include focused tests (e.g., React Testing Library + Vitest/Jest) under `src/__tests__` or colocated `*.test.tsx`; keep fixtures small.
- Aim for coverage of data mapping in `src/lib/data.ts` and user-critical flows (products list, checkout).

## Commit & Pull Request Guidelines
- History uses short, imperative subjects (e.g., `update product image component import path`). Follow that style; include scope if helpful (`products: fix variant tags`).
- PRs should describe intent, key changes, and manual test notes. Link related issues and add screenshots/GIFs for UI updates. Keep diffs focused; split large refactors.

## Security & Configuration Tips
- Required env vars: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for data fetching. Store them in `.env.local` and do not commit secrets.
- Avoid logging sensitive Supabase responses; handle failures gracefully (see `src/lib/supabaseClient.ts` warning path).
- Run `npm run build` before deploying to catch missing env or type issues.
