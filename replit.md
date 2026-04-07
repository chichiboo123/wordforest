# Workspace

## Overview

pnpm workspace monorepo using TypeScript. The main artifact is WordForest (낱말의 숲), a Korean educational web app.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### WordForest (낱말의 숲) — `artifacts/wordforest/`
- **Type**: react-vite (frontend-only)
- **Preview path**: `/` (root)
- **Purpose**: Korean language educational web app for elementary students and teachers
- **Stack**: React + Vite, TypeScript, Tailwind CSS v4, wouter, react-i18next
- **Font**: Pretendard GOV
- **Icons**: Google Material Icons
- **Languages**: KOR (default) / ENG / JPN
- **Dictionary API**: Standard Korean Dictionary API (표준국어대사전 API) — optional, falls back to mock data

#### 4 Core Sections:
1. **낱말 관찰** (`/observe`) — Word observation with dictionary lookup, mood keywords, scene suggestions
2. **낱말 확장** (`/expand`) — Word expansion with related/emotion/action/descriptive word groups
3. **깊이 읽기** (`/read`) — Deep reading analysis for poems/lyrics with student/teacher modes
4. **극적 표현** (`/express`) — Dramatic expression with action verbs, emotion words, performance hints

#### Key Files:
- `src/App.tsx` — Router setup
- `src/i18n/index.ts` — All translations (KOR/ENG/JPN)
- `src/data/` — Mock dictionary, expansion data, expression data, sample texts, today words
- `src/hooks/` — useLocalStorage, useSavedItems, useTodayWord, useTheme
- `src/components/Layout.tsx` — Navigation, footer with creator credit link
- `src/pages/` — Home, Observe, Expand, Read, Express, Saved

#### Environment Variables:
- `VITE_KRDICT_API_KEY` — Optional. Standard Korean Dictionary API key.
  Without it, app uses built-in mock data and works fully.

### API Server — `artifacts/api-server/`
- Standard Express API server (not heavily used by WordForest)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/wordforest run dev` — run WordForest locally
- `pnpm --filter @workspace/wordforest run build` — build WordForest

## GitHub

- Repository name: `forestofwords`
- CI workflow: `.github/workflows/ci.yml`

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
