# AI Client Core — 要件定義

## 概要

`@maruhuku/ai-client` の中核機能に関する要件。
Gemini / Anthropic Claude API を Edge Runtime 上で呼び出す共通クライアントを提供する。

## 要件一覧（EARS形式）

### REQ-AC-001: Gemini API テキスト生成

**When** Gemini API キーが設定されている場合、
**the system shall** `fetchGeminiContent(prompt, config)` を通じて Gemini API を呼び出し、テキストを生成して返す。

- デフォルトモデル: `gemini-2.5-flash`
- `config.system` が指定された場合は `system_instruction` としてリクエストに含める
- 成功時: レスポンスの `candidates[0].content.parts[0].text` を返す

### REQ-AC-002: Gemini レート制限エラー処理

**When** Gemini API が HTTP 429 ステータスを返す場合、
**the system shall** `GeminiRateLimitError` を throw し、ユーザー向けのエラーメッセージを含める。

- エラーメッセージ例: "本日の無料枠が終了しました。Anthropic APIキーに切り替えてご利用ください"
- 429 以外の非成功レスポンスは通常の `Error` を throw する

### REQ-AC-003: Anthropic Claude API テキスト生成

**When** Anthropic API キーが提供される場合、
**the system shall** `fetchAnthropicContent(userMessage, config)` を通じて Anthropic Messages API を呼び出し、テキストを生成して返す。

- デフォルトモデル: `claude-sonnet-4-20250514`
- `config.system` が指定された場合はシステムプロンプトとして含める
- `config.dangerouslyAllowBrowser = true` の場合は `anthropic-dangerous-direct-browser-access` ヘッダーを付与する

### REQ-AC-004: Edge Runtime 対応

**the system shall** 全ての API 呼び出しに **fetch API のみを使用** し、Node.js 固有モジュール（`node:fs`, `node:path`, `node:crypto` 等）を使用しない。

- Vercel Edge Functions / Cloudflare Workers / Next.js Edge Runtime で動作すること
- 重いサードパーティ SDK（`@anthropic-ai/sdk` 等）は使用禁止

### REQ-AC-005: Pure ESM 提供

**the system shall** ES モジュール形式（`"type": "module"`）でパッケージを提供し、CommonJS 互換レイヤーを持たない。

- `import` / `export` のみ使用
- `dist/index.js` をエントリポイントとして公開
- 型定義ファイル（`.d.ts`）を同梱する

## 非機能要件

| 項目 | 要件 |
|------|------|
| 型安全性 | TypeScript strict モード準拠、`any` 型禁止 |
| 依存関係 | runtime dependencies ゼロ |
| バンドルサイズ | 最小化（SDKは使用しない） |
| エラーメッセージ | ユーザー向け日本語メッセージを含めてよい |
