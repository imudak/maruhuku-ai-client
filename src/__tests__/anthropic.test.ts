/**
 * Anthropic Claude API クライアント ユニットテスト
 *
 * REQ-AC-003: Anthropic テキスト生成
 * REQ-AC-004: Edge Runtime 対応（fetch APIのみ）
 */

import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { fetchAnthropicContent } from "../anthropic.ts";

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

/** 正常な Anthropic API レスポンスを生成するヘルパー */
function anthropicSuccessBody(text: string) {
  return {
    content: [{ type: "text", text }],
  };
}

describe("fetchAnthropicContent", () => {
  test("REQ-AC-003: 正常レスポンスでテキストを返す", async () => {
    mockFetch(200, anthropicSuccessBody("Claudeからの応答"));

    const result = await fetchAnthropicContent("テストメッセージ", {
      apiKey: "test-api-key",
    });

    assert.equal(result, "Claudeからの応答");
  });

  test("REQ-AC-003: デフォルトモデルが設定される", async () => {
    let capturedBody: Record<string, unknown> = {};
    globalThis.fetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      capturedBody = JSON.parse(init?.body as string) as Record<string, unknown>;
      return new Response(JSON.stringify(anthropicSuccessBody("ok")), {
        status: 200,
      });
    };

    await fetchAnthropicContent("prompt", { apiKey: "key" });
    assert.ok(typeof capturedBody["model"] === "string");
    assert.ok((capturedBody["model"] as string).includes("claude"));
  });

  test("REQ-AC-003: model オプションがリクエストに反映される", async () => {
    let capturedBody: Record<string, unknown> = {};
    globalThis.fetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      capturedBody = JSON.parse(init?.body as string) as Record<string, unknown>;
      return new Response(JSON.stringify(anthropicSuccessBody("ok")), {
        status: 200,
      });
    };

    await fetchAnthropicContent("prompt", {
      apiKey: "key",
      model: "claude-opus-4-6",
    });
    assert.equal(capturedBody["model"], "claude-opus-4-6");
  });

  test("REQ-AC-003: maxTokens オプションがリクエストに反映される", async () => {
    let capturedBody: Record<string, unknown> = {};
    globalThis.fetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      capturedBody = JSON.parse(init?.body as string) as Record<string, unknown>;
      return new Response(JSON.stringify(anthropicSuccessBody("ok")), {
        status: 200,
      });
    };

    await fetchAnthropicContent("prompt", {
      apiKey: "key",
      maxTokens: 1024,
    });
    assert.equal(capturedBody["max_tokens"], 1024);
  });

  test("REQ-AC-003: system オプションがリクエストに含まれる", async () => {
    let capturedBody: Record<string, unknown> = {};
    globalThis.fetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      capturedBody = JSON.parse(init?.body as string) as Record<string, unknown>;
      return new Response(JSON.stringify(anthropicSuccessBody("ok")), {
        status: 200,
      });
    };

    await fetchAnthropicContent("prompt", {
      apiKey: "key",
      system: "システムプロンプト",
    });
    assert.equal(capturedBody["system"], "システムプロンプト");
  });

  test("REQ-AC-003: system なしの場合は body に system キーがない", async () => {
    let capturedBody: Record<string, unknown> = {};
    globalThis.fetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      capturedBody = JSON.parse(init?.body as string) as Record<string, unknown>;
      return new Response(JSON.stringify(anthropicSuccessBody("ok")), {
        status: 200,
      });
    };

    await fetchAnthropicContent("prompt", { apiKey: "key" });
    assert.ok(!("system" in capturedBody));
  });

  test("REQ-AC-003: dangerouslyAllowBrowser ヘッダーが付与される", async () => {
    let capturedHeaders: Record<string, string> = {};
    globalThis.fetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      capturedHeaders = init?.headers as Record<string, string>;
      return new Response(JSON.stringify(anthropicSuccessBody("ok")), {
        status: 200,
      });
    };

    await fetchAnthropicContent("prompt", {
      apiKey: "key",
      dangerouslyAllowBrowser: true,
    });
    assert.equal(
      capturedHeaders["anthropic-dangerous-direct-browser-access"],
      "true"
    );
  });

  test("REQ-AC-003: dangerouslyAllowBrowser false のときはブラウザヘッダーなし", async () => {
    let capturedHeaders: Record<string, string> = {};
    globalThis.fetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      capturedHeaders = init?.headers as Record<string, string>;
      return new Response(JSON.stringify(anthropicSuccessBody("ok")), {
        status: 200,
      });
    };

    await fetchAnthropicContent("prompt", {
      apiKey: "key",
      dangerouslyAllowBrowser: false,
    });
    assert.ok(
      !("anthropic-dangerous-direct-browser-access" in capturedHeaders)
    );
  });

  test("HTTP エラー時に Error を投げる", async () => {
    mockFetch(401, { error: { message: "Unauthorized" } });

    await assert.rejects(
      () => fetchAnthropicContent("prompt", { apiKey: "invalid-key" }),
      (err: unknown) => {
        assert.ok(err instanceof Error);
        return true;
      }
    );
  });

  test("HTTP エラーのメッセージが伝播する", async () => {
    mockFetch(400, { error: { message: "bad request message" } });

    await assert.rejects(
      () => fetchAnthropicContent("prompt", { apiKey: "key" }),
      (err: unknown) => {
        assert.ok(err instanceof Error);
        assert.ok(err.message.includes("bad request message"));
        return true;
      }
    );
  });

  test("REQ-AC-004: x-api-key ヘッダーが設定される", async () => {
    let capturedHeaders: Record<string, string> = {};
    globalThis.fetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      capturedHeaders = init?.headers as Record<string, string>;
      return new Response(JSON.stringify(anthropicSuccessBody("ok")), {
        status: 200,
      });
    };

    await fetchAnthropicContent("prompt", { apiKey: "my-key" });
    assert.equal(capturedHeaders["x-api-key"], "my-key");
  });

  test("REQ-AC-004: anthropic-version ヘッダーが設定される", async () => {
    let capturedHeaders: Record<string, string> = {};
    globalThis.fetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      capturedHeaders = init?.headers as Record<string, string>;
      return new Response(JSON.stringify(anthropicSuccessBody("ok")), {
        status: 200,
      });
    };

    await fetchAnthropicContent("prompt", { apiKey: "key" });
    assert.ok(typeof capturedHeaders["anthropic-version"] === "string");
    assert.ok(capturedHeaders["anthropic-version"].length > 0);
  });

  test("REQ-AC-004: POST メソッドで API を呼び出す", async () => {
    let capturedMethod = "";
    globalThis.fetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      capturedMethod = init?.method ?? "";
      return new Response(JSON.stringify(anthropicSuccessBody("ok")), {
        status: 200,
      });
    };

    await fetchAnthropicContent("prompt", { apiKey: "key" });
    assert.equal(capturedMethod, "POST");
  });
});
