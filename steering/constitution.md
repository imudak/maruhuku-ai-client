# @maruhuku/ai-client 設計憲章

## Article I: Library-First

このパッケージは複数の Next.js / Vite プロジェクトから使用される共通ライブラリである。
アプリケーション固有のロジック（将棋解説パーサー、議事録フォーマット等）は含めない。

## Article II: Edge Runtime 対応

- **fetch API のみ使用**（Node.js APIs 禁止）
- `fs`, `path`, `os`, `crypto` 等の Node.js 組み込みモジュールは使用禁止
- `@anthropic-ai/sdk` 等の重いSDKは使用禁止（direct fetch のみ）
- Edge Runtime / Cloudflare Workers / Vercel Edge Functions で動作すること

## Article III: Pure ESM

- `"type": "module"` を維持
- CommonJS 互換を提供しない
- `import` / `export` のみ使用

## Article IV: 最小依存

- devDependencies: TypeScript のみ
- dependencies: 0（ゼロ依存）
- バンドルサイズを最小化する

## Article V: 型安全

- TypeScript strict モードでコンパイルが通ること
- `any` 型は使用しない（型アサーションが必要な場合は unknown 経由）
- 全 public API に型定義を提供する

## Article VI: エラー設計

- API 固有のエラーは専用クラスで表現（例: `GeminiRateLimitError`）
- エラーメッセージはユーザー向けの日本語メッセージを含めてよい
- エラー詳細は Error.message に含める
