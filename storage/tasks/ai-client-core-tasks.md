# ai-client-core タスクリスト

**Feature**: ai-client-core
**Version**: 0.1.1
**Status**: All Completed (Brownfield)
**Created**: 2026-02-24 (逆起こし)

---

## 実装タスク（全完了）

### フェーズ 1: ライブラリ基盤構築

- ✅ **TASK-AC-001**: Pure ESM npm パッケージ初期化
  - `package.json` に `"type": "module"` 設定
  - `tsconfig.json`, `tsconfig.build.json` 作成
  - `.gitignore` 設定（`node_modules/` のみ除外、`dist/` は含める）

- ✅ **TASK-AC-002**: TypeScript strict モード設定
  - `strict: true` 有効化
  - `moduleResolution: Bundler` 設定（webpack/Next.js互換）

### フェーズ 2: Gemini API クライアント実装

- ✅ **TASK-AC-003**: `GeminiConfig` インターフェース定義
  - `apiKey`, `model`, `maxOutputTokens`, `system` フィールド

- ✅ **TASK-AC-004**: `GeminiRateLimitError` クラス実装
  - `Error` 継承、`name` プロパティ設定

- ✅ **TASK-AC-005**: `fetchGeminiContent` 関数実装
  - fetch API による POST リクエスト
  - 429 エラー → `GeminiRateLimitError` throw
  - その他エラー → `Error` throw
  - `system_instruction` オプショナルサポート

### フェーズ 3: Anthropic API クライアント実装

- ✅ **TASK-AC-006**: `AnthropicConfig` インターフェース定義
  - `apiKey`, `model`, `maxTokens`, `system`, `dangerouslyAllowBrowser` フィールド

- ✅ **TASK-AC-007**: `fetchAnthropicContent` 関数実装
  - fetch API による POST リクエスト
  - `anthropic-version: 2023-06-01` ヘッダー
  - `dangerouslyAllowBrowser` オプション対応
  - エラーレスポンス解析

### フェーズ 4: エントリポイントとビルド

- ✅ **TASK-AC-008**: `src/index.ts` re-export 設定
  - `export * from "./gemini.js"` および `"./anthropic.js"`

- ✅ **TASK-AC-009**: `npm run build` で `dist/` 生成
  - `dist/index.js`, `dist/*.d.ts`, sourcemap 確認

- ✅ **TASK-AC-010**: `package.json#exports` 設定
  - `"."` → `"./dist/index.js"`

### フェーズ 5: 消費プロジェクト統合確認

- ✅ **TASK-AC-011**: shogi-commentary-generator で動作確認
  - `github:imudak/maruhuku-ai-client` でインストール
  - Edge Functions で Gemini API 呼び出し確認

- ✅ **TASK-AC-012**: ai-meeting-notes で動作確認
  - Node.js Functions で Gemini/Anthropic API 呼び出し確認

---

## 今後の候補タスク（未着手）

- ⬜ **TASK-AC-013**: Unit テスト追加（musubi-gaps 対応）
  - `fetchGeminiContent` のモックテスト
  - `GeminiRateLimitError` のテスト
  - `fetchAnthropicContent` のテスト

- ⬜ **TASK-AC-014**: OpenAI API クライアント追加（要件定義時に検討）

---

*逆起こし日: 2026-02-24 / 実装状況: v0.1.1 全完了*
