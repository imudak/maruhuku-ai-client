# Product Context

## Description

`@maruhuku/ai-client` — まるふく工房プロジェクト共通 AI API クライアントライブラリ（v0.1.1）

## Purpose

Gemini / Anthropic Claude 等の AI API を統合する **Edge Runtime 対応ゼロ依存 Pure ESM ライブラリ**。
複数のまるふく工房プロジェクトから共通クライアントとして利用される。

## Target Users

| プロジェクト | Runtime | 用途 |
|-------------|---------|------|
| shogi-commentary-generator | Edge (Vercel Edge Functions) | 将棋解説生成 |
| ai-meeting-notes | Node.js (Vercel Node.js Functions) | 議事録生成 |

## Key Constraints

- **fetch API のみ使用**（Node.js APIs 禁止）
- **SDK 使用禁止**（direct fetch のみ）
- **ゼロ依存**（runtime dependencies 0）
- **Pure ESM**（`"type": "module"`）

---

*Updated for @maruhuku/ai-client brownfield onboarding.*
