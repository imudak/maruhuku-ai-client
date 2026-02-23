/**
 * Anthropic Claude API クライアント
 * Edge Runtime対応 (fetch APIのみ使用)
 *
 * REQ-AC-003, REQ-AC-004, REQ-AC-005
 */
/**
 * Anthropic Claude APIを呼び出してテキストを生成する
 *
 * REQ-AC-003: Anthropic APIを呼び出してテキストを生成
 * REQ-AC-004: fetch APIのみ使用（Edge Runtime対応）
 */
export async function fetchAnthropicContent(userMessage, config) {
    const { apiKey, model = "claude-sonnet-4-20250514", maxTokens = 4096, system, dangerouslyAllowBrowser = false, } = config;
    const headers = {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
    };
    if (dangerouslyAllowBrowser) {
        headers["anthropic-dangerous-direct-browser-access"] = "true";
    }
    const body = {
        model,
        max_tokens: maxTokens,
        messages: [{ role: "user", content: userMessage }],
    };
    if (system) {
        body.system = system;
    }
    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || `Anthropic API error ${response.status}`);
    }
    const data = await response.json();
    return data.content[0].text;
}
//# sourceMappingURL=anthropic.js.map