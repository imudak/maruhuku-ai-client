# @maruhuku/ai-client

Maruhuku プロジェクト共通 AI API クライアントライブラリ。

## 特徴

- **Edge Runtime 対応**: `fetch` API のみ使用（Node.js APIs 不使用）
- **ゼロ依存**: 外部 npm パッケージ不要
- **Pure ESM**: ES モジュール形式

## 提供 API

### Gemini API

```typescript
import { fetchGeminiContent, GeminiRateLimitError } from "@maruhuku/ai-client";

const text = await fetchGeminiContent("こんにちは", {
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-2.0-flash",       // optional, default: "gemini-2.0-flash"
  maxOutputTokens: 2000,            // optional, default: 2000
  system: "あなたは親切なアシスタントです", // optional
});
```

429 エラー時は `GeminiRateLimitError` がスローされます。

### Anthropic Claude API

```typescript
import { fetchAnthropicContent } from "@maruhuku/ai-client";

const text = await fetchAnthropicContent("こんにちは", {
  apiKey: process.env.ANTHROPIC_API_KEY!,
  model: "claude-sonnet-4-20250514", // optional, default: "claude-sonnet-4-20250514"
  maxTokens: 4096,                   // optional, default: 4096
  system: "あなたは親切なアシスタントです", // optional
  dangerouslyAllowBrowser: false,    // optional, ブラウザ直接呼び出し時はtrue
});
```

## インストール（各プロジェクト）

```json
{
  "dependencies": {
    "@maruhuku/ai-client": "github:imudak/maruhuku-ai-client"
  }
}
```

GitHub Private リポジトリのため、Vercel 環境では `GITHUB_TOKEN` 環境変数を設定してください。
