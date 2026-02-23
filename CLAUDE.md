# @maruhuku/ai-client — Claude Code 指示書

## プロジェクト概要

Gemini / Anthropic Claude 等のAI APIを統合する **Edge Runtime 対応ゼロ依存 Pure ESM ライブラリ**。
複数のまるふく工房プロジェクトから共通クライアントとして利用される。

- npm package name: `@maruhuku/ai-client`
- バージョン: 0.1.1
- GitHub: https://github.com/imudak/maruhuku-ai-client (Private)
- 百式 page_id: `ae9214a5-133f-4839-ac01-57a965638d03`

## 技術スタック

- **言語**: TypeScript (strict モード)
- **モジュール方式**: Pure ESM (`"type": "module"`)
- **Runtime**: Edge Runtime 対応（fetch API のみ使用）
- **依存関係**: devDependencies に TypeScript のみ、runtime dependencies ゼロ

## 消費者プロジェクト

| プロジェクト | Runtime | 用途 |
|-------------|---------|------|
| shogi-commentary-generator | Edge (Vercel Edge Functions) | 将棋解説生成 |
| ai-meeting-notes | Node.js (Vercel Node.js Functions) | 議事録生成 |

## ビルド

```bash
npm run build   # tsconfig.build.json を使用して dist/ を生成
```

生成物: `dist/index.js`, `dist/*.d.ts`, sourcemap

## 重要制約（steering/constitution.md）

- **fetch API のみ使用**（`node:fs`, `node:path`, `node:crypto` 等禁止）
- **SDK 使用禁止**（`@anthropic-ai/sdk` 等 — direct fetch のみ）
- **Pure ESM**: `import`/`export` のみ、CommonJS 互換なし
- **ゼロ依存**: runtime dependencies 0
- **型安全**: `any` 型禁止、strict モード必須

## ソース構造

```text
src/
├── index.ts       # re-export エントリポイント
├── gemini.ts      # Gemini API クライアント（fetchGeminiContent, GeminiRateLimitError）
└── anthropic.ts   # Anthropic API クライアント（fetchAnthropicContent）
```

## VCS

- **jj (Jujutsu)** を使用
- bookmark: `main`
- push: `jj bookmark set main -r @ && jj git push`

## MUSUBI SDD コマンド

| コマンド | 用途 |
|---------|------|
| `/sdd-requirements` | EARS形式で要件を分析・文書化 |
| `/sdd-design` | アーキテクチャ・技術設計 |
| `/sdd-tasks` | タスク分解・計画作成 |
| `/sdd-implement` | 実装（テスト駆動） |
| `/sdd-validate` | テスト実行・品質検証 |
| `/sdd-steering` | プロジェクトメモリ更新 |

## 百式 DB 連携

```bash
# nextAction 更新
curl -X PUT http://localhost:3100/api/projects/ae9214a5-133f-4839-ac01-57a965638d03 \
  -H "Content-Type: application/json" \
  -d '{"nextAction": "次のアクション内容"}'
```
