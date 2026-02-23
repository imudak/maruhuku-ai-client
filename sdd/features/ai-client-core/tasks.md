# AI Client Core — タスク一覧

## ステータス凡例

- [x] 完了
- [ ] 未着手
- [~] 進行中

## タスク一覧

### Phase 1: 基盤実装

- [x] **TASK-001** プロジェクト初期化
  - npm パッケージ設定（`package.json`, `"type": "module"`）
  - TypeScript 設定（`tsconfig.json`, `tsconfig.build.json`）
  - `.gitignore` 設定（`dist/` を含める）

- [x] **TASK-002** Gemini API クライアント実装 (REQ-AC-001, REQ-AC-004)
  - `src/gemini.ts`: `fetchGeminiContent` 関数
  - `GeminiConfig` インターフェース
  - fetch API のみ使用（Edge Runtime 対応）

- [x] **TASK-003** Gemini レート制限エラー実装 (REQ-AC-002)
  - `GeminiRateLimitError` クラス
  - HTTP 429 時の throw 処理
  - ユーザー向けエラーメッセージ

- [x] **TASK-004** Anthropic Claude API クライアント実装 (REQ-AC-003, REQ-AC-004)
  - `src/anthropic.ts`: `fetchAnthropicContent` 関数
  - `AnthropicConfig` インターフェース
  - `dangerouslyAllowBrowser` オプション対応

- [x] **TASK-005** パブリック API エントリポイント (REQ-AC-005)
  - `src/index.ts`: gemini / anthropic の re-export
  - Pure ESM (`import`/`export` のみ)

### Phase 2: ビルド・配布

- [x] **TASK-006** ビルド設定
  - `tsconfig.build.json` 作成（`noEmit: false`, `outDir: ./dist`）
  - `package.json` scripts に `build` コマンド追加
  - `package.json` の `exports` フィールドを `./dist/index.js` に設定

- [x] **TASK-007** dist/ の Git 管理
  - `.gitignore` から `dist/` を除外
  - ビルド成果物をコミット（Vercel Node.js Functions 対応）

- [x] **TASK-008** Private GitHub リポジトリ公開
  - `github:imudak/maruhuku-ai-client` 形式で消費者プロジェクトから参照可能

### Phase 3: 消費者プロジェクト統合

- [x] **TASK-009** shogi-commentary-generator 統合
  - `@maruhuku/ai-client` を依存関係に追加
  - Edge Runtime で動作確認

- [x] **TASK-010** ai-meeting-notes 統合
  - `@maruhuku/ai-client` を依存関係に追加
  - Node.js Runtime で動作確認（v0.1.1 でビルド成功確認済み）

### Phase 4: MUSUBI 整備

- [x] **TASK-011** steering ファイル整備
  - `steering/constitution.md` 作成（設計原則・制約）
  - `steering/project.yml` 作成（要件定義含む）

- [x] **TASK-012** SDD ドキュメント整備
  - `sdd/features/ai-client-core/requirements.md`
  - `sdd/features/ai-client-core/design.md`
  - `sdd/features/ai-client-core/tasks.md`

- [x] **TASK-013** CLAUDE.md 作成
  - プロジェクト概要・制約・ビルド手順
  - MUSUBI SDD コマンド案内
  - 百式 page_id 記載

## 今後の検討事項

- [ ] ユニットテスト追加（fetch をモックしたテスト）
- [ ] streaming レスポンス対応
- [ ] より多くの AI プロバイダー対応（OpenAI 等）
