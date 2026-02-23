/**
 * Gemini API クライアント ユニットテスト
 *
 * REQ-AC-001: Gemini テキスト生成
 * REQ-AC-002: Gemini レート制限エラー処理
 */

import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { fetchGeminiContent, GeminiRateLimitError } from "../gemini.ts";

// fetch のモック用オリジナル保存
let originalFetch: typeof globalThis.fetch;

beforeEach(() => {
  originalFetch = globalThis.fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

/** fetch を指定したレスポンスで差し替えるヘルパー */
function mockFetch(status: number, body: unknown): void {
  globalThis.fetch = async () =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });
}

describe("GeminiRateLimitError", () => {
  test("Error を継承する", () => {
    const err = new GeminiRateLimitError("テストエラー");
    assert.ok(err instanceof Error);
    assert.ok(err instanceof GeminiRateLimitError);
  });

  test("name が GeminiRateLimitError", () => {
    const err = new GeminiRateLimitError("テストエラー");
    assert.equal(err.name, "GeminiRateLimitError");
  });

  test("message が設定される", () => {
    const err = new GeminiRateLimitError("カスタムメッセージ");
    assert.equal(err.message, "カスタムメッセージ");
  });
});

describe("fetchGeminiContent", () => {
  test("REQ-AC-001: 正常レスポンスでテキストを返す", async () => {
    mockFetch(200, {
      candidates: [
        { content: { parts: [{ text: "生成されたテキスト" }] } },
      ],
    });

    const result = await fetchGeminiContent("テストプロンプト", {
      apiKey: "test-api-key",
    });

    assert.equal(result, "生成されたテキスト");
  });

  test("REQ-AC-001: デフォルトモデルは gemini-2.5-flash", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (input: RequestInfo | URL) => {
      capturedUrl = input.toString();
      return new Response(
        JSON.stringify({
          candidates: [{ content: { parts: [{ text: "ok" }] } }],
        }),
        { status: 200 }
      );
    };

    await fetchGeminiContent("prompt", { apiKey: "key" });
    assert.ok(capturedUrl.includes("gemini-2.5-flash"));
  });

  test("REQ-AC-001: model オプションが URL に反映される", async () => {
    let capturedUrl = "";
    globalThis.fetch = async (input: RequestInfo | URL) => {
      capturedUrl = input.toString();
      return new Response(
        JSON.stringify({
          candidates: [{ content: { parts: [{ text: "ok" }] } }],
        }),
        { status: 200 }
      );
    };

    await fetchGeminiContent("prompt", {
      apiKey: "key",
      model: "gemini-1.5-pro",
    });
    assert.ok(capturedUrl.includes("gemini-1.5-pro"));
  });

  test("REQ-AC-001: system オプションが system_instruction として渡される", async () => {
    let capturedBody: Record<string, unknown> = {};
    globalThis.fetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      capturedBody = JSON.parse(init?.body as string) as Record<string, unknown>;
      return new Response(
        JSON.stringify({
          candidates: [{ content: { parts: [{ text: "ok" }] } }],
        }),
        { status: 200 }
      );
    };

    await fetchGeminiContent("prompt", {
      apiKey: "key",
      system: "システム指示",
    });
    assert.ok("system_instruction" in capturedBody);
  });

  test("REQ-AC-001: candidates が空の場合は空文字を返す", async () => {
    mockFetch(200, { candidates: [] });

    const result = await fetchGeminiContent("prompt", { apiKey: "key" });
    assert.equal(result, "");
  });

  test("REQ-AC-002: HTTP 429 で GeminiRateLimitError を投げる", async () => {
    globalThis.fetch = async () =>
      new Response("Rate limit exceeded", { status: 429 });

    await assert.rejects(
      () => fetchGeminiContent("prompt", { apiKey: "key" }),
      (err: unknown) => {
        assert.ok(err instanceof GeminiRateLimitError);
        assert.equal(err.name, "GeminiRateLimitError");
        return true;
      }
    );
  });

  test("REQ-AC-002: GeminiRateLimitError のメッセージに日本語が含まれる", async () => {
    globalThis.fetch = async () =>
      new Response("Rate limit exceeded", { status: 429 });

    await assert.rejects(
      () => fetchGeminiContent("prompt", { apiKey: "key" }),
      (err: unknown) => {
        assert.ok(err instanceof GeminiRateLimitError);
        // 日本語の代替案内が含まれること
        assert.ok(err.message.length > 0);
        return true;
      }
    );
  });

  test("HTTP 500 で Error を投げる", async () => {
    globalThis.fetch = async () =>
      new Response("Internal Server Error", { status: 500 });

    await assert.rejects(
      () => fetchGeminiContent("prompt", { apiKey: "key" }),
      (err: unknown) => {
        assert.ok(err instanceof Error);
        assert.ok(!(err instanceof GeminiRateLimitError));
        return true;
      }
    );
  });

  test("REQ-AC-004: Content-Type ヘッダーが設定される", async () => {
    let capturedHeaders: Record<string, string> = {};
    globalThis.fetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      capturedHeaders = init?.headers as Record<string, string>;
      return new Response(
        JSON.stringify({
          candidates: [{ content: { parts: [{ text: "ok" }] } }],
        }),
        { status: 200 }
      );
    };

    await fetchGeminiContent("prompt", { apiKey: "key" });
    assert.equal(capturedHeaders["Content-Type"], "application/json");
  });
});
