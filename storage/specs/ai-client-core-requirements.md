# ai-client-core 要件仕様書

**Feature**: ai-client-core
**Version**: 0.1.1
**Status**: Implemented (Brownfield)
**Created**: 2026-02-24 (逆起こし)

---

## 概要

複数のまるふく工房プロジェクトから利用される共通 AI API クライアントライブラリ。
Gemini および Anthropic Claude の API を統合し、Edge Runtime 対応のゼロ依存 Pure ESM として提供する。

---

## 要件（EARS形式）

### REQ-AC-001: Gemini テキスト生成

> **When** the caller provides a prompt and GeminiConfig,
> **the system shall** call the Google Generative Language API and return the generated text as a string.

**受入条件**:
- `fetchGeminiContent(prompt, config)` が `Promise<string>` を返す
- デフォルトモデルは `gemini-2.5-flash`
- `maxOutputTokens` のデフォルトは 2000
- `system` オプションが指定された場合、`system_instruction` として API に渡す

---

### REQ-AC-002: Gemini レート制限エラー処理

> **When** the Gemini API returns HTTP 429,
> **the system shall** throw a `GeminiRateLimitError` with a user-friendly Japanese message.

**受入条件**:
- `GeminiRateLimitError` は `Error` を継承する
- `error.name === "GeminiRateLimitError"` でキャッチ可能
- エラーメッセージは日本語で代替手段を案内する

---

### REQ-AC-003: Anthropic テキスト生成

> **When** the caller provides a userMessage and AnthropicConfig,
> **the system shall** call the Anthropic Messages API and return the generated text as a string.

**受入条件**:
- `fetchAnthropicContent(userMessage, config)` が `Promise<string>` を返す
- デフォルトモデルは `claude-sonnet-4-20250514`
- `maxTokens` のデフォルトは 4096
- `system` オプションが指定された場合、Messages API の `system` フィールドに渡す
- `dangerouslyAllowBrowser: true` の場合、ブラウザ直接アクセス用ヘッダーを付与する

---

### REQ-AC-004: Edge Runtime 対応

> **Where** the library is used in Vercel Edge Functions or Cloudflare Workers,
> **the system shall** function correctly using only the Fetch API.

**受入条件**:
- `node:fs`, `node:path`, `node:crypto` 等の Node.js 組み込みモジュールを使用しない
- `@anthropic-ai/sdk` 等の外部 SDK に依存しない
- `dependencies` が空（ゼロ依存）である
- すべてのネットワーク通信は `fetch` API を使用する

---

### REQ-AC-005: 型安全な公開 API

> **The system shall** export fully typed interfaces and functions for all public API.

**受入条件**:
- `GeminiConfig`, `AnthropicConfig` インターフェースが export される
- `GeminiRateLimitError` クラスが export される
- TypeScript strict モードでコンパイルエラーが発生しない
- `any` 型を使用しない（`unknown` 経由の型アサーションのみ許可）

---

## 非機能要件

| 項目 | 要件 |
|------|------|
| バンドルサイズ | ゼロ依存により最小化 |
| モジュール形式 | Pure ESM のみ（CommonJS 非対応） |
| ビルド成果物 | `dist/*.js`, `dist/*.d.ts`, sourcemap |
| TypeScript | strict モード必須 |

---

*逆起こし日: 2026-02-24 / 対象: src/gemini.ts, src/anthropic.ts, src/index.ts*
