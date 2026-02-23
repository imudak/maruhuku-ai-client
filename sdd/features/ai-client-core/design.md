# AI Client Core — 設計

## アーキテクチャ概要

```text
@maruhuku/ai-client
├── src/
│   ├── index.ts       # パブリック API エントリポイント（re-export のみ）
│   ├── gemini.ts      # Gemini API クライアント
│   └── anthropic.ts   # Anthropic Claude API クライアント
└── dist/              # ビルド成果物（Git 管理）
    ├── index.js
    ├── gemini.js
    └── anthropic.js
```

## パブリック API 設計

### Gemini クライアント (`src/gemini.ts`)

```typescript
// 設定インターフェース
interface GeminiConfig {
  apiKey: string;
  model?: string;          // デフォルト: "gemini-2.5-flash"
  maxOutputTokens?: number; // デフォルト: 2000
  system?: string;         // system_instruction（オプション）
}

// エラークラス（REQ-AC-002）
class GeminiRateLimitError extends Error {
  constructor(message: string)
}

// メイン関数（REQ-AC-001）
async function fetchGeminiContent(
  prompt: string,
  config: GeminiConfig
): Promise<string>
```

### Anthropic クライアント (`src/anthropic.ts`)

```typescript
// 設定インターフェース
interface AnthropicConfig {
  apiKey: string;
  model?: string;                    // デフォルト: "claude-sonnet-4-20250514"
  maxTokens?: number;                // デフォルト: 4096
  system?: string;
  dangerouslyAllowBrowser?: boolean; // ブラウザ直呼び出し時 true
}

// メイン関数（REQ-AC-003）
async function fetchAnthropicContent(
  userMessage: string,
  config: AnthropicConfig
): Promise<string>
```

## エラー処理設計

| エラー種別 | クラス | 条件 |
|-----------|--------|------|
| Gemini レート制限 | `GeminiRateLimitError` | HTTP 429 |
| Gemini その他エラー | `Error` | HTTP 4xx/5xx（429以外） |
| Anthropic エラー | `Error` | HTTP 非成功（`error.message` を含む） |

## HTTP リクエスト設計

### Gemini API

```
POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}
Content-Type: application/json

{
  "contents": [{ "parts": [{ "text": "{prompt}" }] }],
  "generationConfig": { "maxOutputTokens": {n} },
  "system_instruction": { "parts": [{ "text": "{system}" }] }  // オプション
}
```

### Anthropic API

```
POST https://api.anthropic.com/v1/messages
Content-Type: application/json
x-api-key: {apiKey}
anthropic-version: 2023-06-01
anthropic-dangerous-direct-browser-access: true  // dangerouslyAllowBrowser時のみ

{
  "model": "{model}",
  "max_tokens": {n},
  "system": "{system}",  // オプション
  "messages": [{ "role": "user", "content": "{userMessage}" }]
}
```

## ビルド設定

- `tsconfig.json`: `module: "ESNext"`, `moduleResolution: "Bundler"`, `noEmit: true`（開発用）
- `tsconfig.build.json`: `noEmit: false`, `outDir: ./dist`（ビルド用）
- `src/index.ts` の import は `.js` 拡張子付き（ビルド後の ESM 解決のため）

## 消費者プロジェクトからの利用

```typescript
import { fetchGeminiContent, GeminiRateLimitError } from "@maruhuku/ai-client";
import { fetchAnthropicContent } from "@maruhuku/ai-client";
```

`package.json` の `exports` フィールドで `./dist/index.js` を指定。
