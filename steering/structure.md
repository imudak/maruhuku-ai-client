# Project Structure

## Architecture Pattern

**Pattern**: Pure ESM Library（ゼロ依存）

## Directory Structure

```
src/
├── index.ts       # re-export エントリポイント
├── gemini.ts      # Gemini API クライアント
└── anthropic.ts   # Anthropic API クライアント

dist/               # ビルド成果物（Gitに含める）
├── index.js
├── gemini.js
├── anthropic.js
└── *.d.ts, *.map

steering/           # MUSUBIメタ情報
storage/            # SDD文書（specs/, design/, tasks/）
```

## Key Patterns

- `src/` に TypeScript ソース、`dist/` にビルド成果物
- エントリポイント: `package.json#exports → ./dist/index.js`
- 各プロバイダ（Gemini, Anthropic）は独立したモジュールファイル

## Conventions

- File naming: kebab-case
- Export: named export のみ（default export なし）
- Config: 各関数の第2引数として `XxxConfig` 型で渡す

---

*Updated for @maruhuku/ai-client brownfield onboarding.*
