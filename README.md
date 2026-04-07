# 낱말의 숲 · WordForest

**낱말을 깊이 이해하고, 예술적 상상과 표현으로 확장해 가는 교육용 웹앱**

An educational web app that expands Korean word understanding into artistic imagination and dramatic expression.

## 소개 / Overview

낱말의 숲(WordForest)은 한국어 낱말을 출발점으로 깊은 이해, 예술적 상상, 창의적 표현으로 확장해 나가는 교육용 웹앱입니다.
초등학생, 교사, 그리고 시 쓰기, 가사 해석, 교육 뮤지컬, 드라마, 표현 언어 활동에 참여하는 모든 분들을 위해 만들어졌습니다.

WordForest is a Korean language educational app for elementary students and teachers, designed to support poetry writing, lyric interpretation, educational musicals, drama, and expressive language activities.

## 4가지 핵심 섹션 / 4 Core Sections

1. **낱말 관찰 (Word Observe)** — 낱말 하나를 깊이 들여다보기
2. **낱말 확장 (Word Expand)** — 씨앗 낱말에서 가지 뻗어나가기
3. **깊이 읽기 (Deep Reading)** — 시/노랫말/글을 깊이 읽기
4. **극적 표현 (Dramatic Expression)** — 장면과 감정을 표현으로 연결하기

## 기술 스택 / Tech Stack

- **Framework**: React + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Font**: Pretendard GOV
- **Icons**: Google Material Icons
- **i18n**: react-i18next (KOR / ENG / JPN)
- **Routing**: wouter
- **Package Manager**: pnpm (monorepo)
- **Dictionary API**: 국립국어원 표준국어대사전 API (선택적)

## 설치 및 실행 / Setup & Development

### 요구사항 / Requirements

- Node.js 24+
- pnpm 10+

### 설치 / Install

```bash
git clone https://github.com/<your-username>/forestofwords.git
cd forestofwords
pnpm install
```

### 환경 변수 / Environment Variables (Optional)

> ⚠️ GitHub Pages(정적 배포)에서는 비밀 키를 프론트엔드에 안전하게 숨길 수 없습니다.
> 따라서 API 키는 반드시 서버(프록시)에서만 사용하세요.

사전 API를 사용하려면 서버 프록시를 하나 두고(Cloudflare Workers, Vercel Functions, Netlify Functions 등),
`artifacts/wordforest/.env.local` 파일에 프록시 URL을 설정하세요:

```env
VITE_KRDICT_PROXY_URL=https://<your-proxy-domain>/api/dictionary
```

프론트는 위 프록시를 호출하고, 프록시 서버가 표준국어대사전 API 키를 사용해 실제 요청을 수행합니다.
API 키는 [국립국어원 표준국어대사전 오픈 API](https://stdict.korean.go.kr/openapi/openApiInfo.do)에서 발급받을 수 있습니다.
프록시 없이도 내장 목업 데이터로 정상 작동합니다.

### 개발 서버 실행 / Run Dev Server

```bash
pnpm --filter @workspace/wordforest run dev
```

앱이 http://localhost:PORT 에서 실행됩니다.

### 빌드 / Build

```bash
pnpm --filter @workspace/wordforest run build
```

### 타입 체크 / Type Check

```bash
pnpm run typecheck
```

## GitHub Actions

`.github/workflows/ci.yml`에 CI 워크플로가 포함되어 있습니다.
`main` 브랜치 push 및 pull request 시 자동으로 타입 체크와 빌드가 실행됩니다.

GitHub Pages + GitHub Actions 기준 권장 설정:
1. GitHub 저장소 → **Settings → Secrets and variables → Actions**
2. **Variables**에 `VITE_KRDICT_PROXY_URL` 추가
3. 값은 배포된 프록시 주소(예: `https://your-worker.example.com/api/dictionary`)로 설정

`VITE_KRDICT_API_KEY` 같은 비밀 키를 프론트 빌드 변수로 주입하지 마세요.

### Netlify Functions 사용 시

- 이 저장소에는 `netlify/functions/krdict.ts` 함수가 포함되어 있습니다.
- Netlify 대시보드에서 다음 환경변수를 추가하세요:
  - `KRDICT_API_KEY` (Secret)
  - `VITE_KRDICT_PROXY_URL` (선택, 비워두면 Netlify 도메인에서는 `/.netlify/functions/krdict` 기본 경로 사용)

## 저장소 이름 / Repository Name

이 프로젝트의 GitHub 저장소 이름은 `wordforest`입니다.

## 라이선스 / License

MIT

---

Created by. 교육뮤지컬 꿈꾸는 치수쌤 · [litt.ly/chichiboo](https://litt.ly/chichiboo)
