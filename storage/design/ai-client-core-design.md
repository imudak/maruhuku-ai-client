# ai-client-core 技術設計書

**Feature**: ai-client-core
**Version**: 0.1.1
**Status**: Implemented (Brownfield)
**Created**: 2026-02-24 (逆起こし)

---

## アーキテクチャ概要

```
┌─────────────────────────────────────────────────┐
│             @maruhuku/ai-client                 │
│                                                 │
│  src/index.ts  ─── re-export エントリポイント   │
│       ├── src/gemini.ts    (Gemini API)          │
│       └── src/anthropic.ts (Anthropic API)       │
└─────────────────────────────────────────────────┘
        ↓ npm install
┌─────────────────┐  ┌─────────────────────────┐
│ shogi-commentary│  │   ai-meeting-notes       │
│ -generator      │  │   (Node.js Functions)    │
│ (Edge Functions)│  └─────────────────────────┘
└─────────────────┘
```

## モジュール構成

### src/index.ts — エントリポイント

単純な re-export のみ。ロジックを持たない。

```typescript
export * from "./gemini.js";
export * from "./anthropic.js";
```

### src/gemini.ts — Gemini API クライアント

**責務**: Google Generative Language API への fetch リクエスト管理

| エクスポート | 種別 | 説明 |
|------------|------|------|
| `GeminiConfig` | interface | API呼び出し設定 |
| `GeminiRateLimitError` | class | 429エラー専用例外 |
| `fetchGeminiContent` | async function | テキスト生成 |

**エンドポイント**:
```
POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}
```

**リクエスト構造**:
```json
{
  "contents": [{ "parts": [{ "text": "<prompt>" }] }],
  "generationConfig": { "maxOutputTokens": 2000 },
  "system_instruction": { "parts": [{ "text": "<system>" }] }
}
```

### src/anthropic.ts — Anthropic API クライアント

**責務**: Anthropic Messages API への fetch リクエスト管理

| エクスポート | 種別 | 説明 |
|------------|------|------|
| `AnthropicConfig` | interface | API呼び出し設定 |
| `fetchAnthropicContent` | async function | テキスト生成 |

**エンドポイント**:
```
POST https://api.anthropic.com/v1/messages
```

**必須ヘッダー**:
- `Content-Type: application/json`
- `x-api-key: {apiKey}`
- `anthropic-version: 2023-06-01`
- `anthropic-dangerous-direct-browser-access: true` (dangerouslyAllowBrowser 時)

---

## エラーハンドリング設計

| 状況 | 処理 |
|------|------|
| Gemini 429 | `GeminiRateLimitError` throw（日本語メッセージ付き） |
| Gemini その他エラー | `Error` throw（ステータスコード + レスポンスボディ） |
| Anthropic エラー | `Error` throw（APIのエラーメッセージ or ステータスコード） |

---

## ビルド設計

```
tsconfig.build.json:
  module: ESNext
  moduleResolution: Bundler
  outDir: ./dist
  noEmit: false
  declaration: true
  sourceMap: true
```

**設計上の注意**:
- `moduleResolution: Bundler` を使用（NodeNextにするとwebpackが.js解決に失敗）
- `dist/` はGitに含める（Vercel Node.js Functions が.tsを直接インポートできないため）

---

## パッケージ設計

```json
{
  "type": "module",
  "main": "./dist/index.js",
  "exports": { ".": "./dist/index.js" },
  "dependencies": {},
  "devDependencies": { "typescript": "^5.x" }
}
```

---

## 消費プロジェクト連携

| プロジェクト | 取得方法 | 特記事項 |
|-------------|---------|---------|
| shogi-commentary-generator | `github:imudak/maruhuku-ai-client` | `transpilePackages` 設定不要 |
| ai-meeting-notes | `github:imudak/maruhuku-ai-client` | Vite, dist/.js を直接使用 |

---

*逆起こし日: 2026-02-24 / 対象: src/gemini.ts, src/anthropic.ts, package.json, tsconfig*.json*
