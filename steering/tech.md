# Technology Stack

## Languages

- TypeScript (strict モード)

## Runtime Target

- Edge Runtime / Vercel Edge Functions
- Node.js (Vercel Node.js Functions)
- Cloudflare Workers（互換）

## Build

- **tsc** (`tsconfig.build.json`): `module: ESNext`, `moduleResolution: Bundler`
- 出力: `dist/*.js`, `dist/*.d.ts`, sourcemap

## Package

- `"type": "module"` — Pure ESM
- `exports`: `./dist/index.js`
- devDependencies: `typescript` のみ
- dependencies: 0（ゼロ依存）

## VCS

- **jj (Jujutsu)**: bookmark `main`
- push: `jj bookmark set main -r @ && jj git push`

## External APIs

- **Google Generative Language API** (Gemini)
  - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
  - Default model: `gemini-2.5-flash`
- **Anthropic Messages API** (Claude)
  - Endpoint: `https://api.anthropic.com/v1/messages`
  - Default model: `claude-sonnet-4-20250514`

---

*Updated for @maruhuku/ai-client brownfield onboarding.*
