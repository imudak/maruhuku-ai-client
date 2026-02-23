/**
 * Gemini API クライアント
 * Edge Runtime対応 (fetch APIのみ使用)
 *
 * REQ-AC-001, REQ-AC-002, REQ-AC-004, REQ-AC-005
 */

export interface GeminiConfig {
  apiKey: string;
  model?: string;          // デフォルト: "gemini-2.0-flash"
  maxOutputTokens?: number;
  system?: string;         // system_instruction として渡す（オプション）
}

export class GeminiRateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiRateLimitError";
  }
}

/**
 * Gemini APIを呼び出してテキストを生成する
 *
 * REQ-AC-001: Gemini APIを呼び出してテキストを生成
 * REQ-AC-002: 429エラー時はGeminiRateLimitErrorを投げる
 * REQ-AC-004: fetch APIのみ使用（Edge Runtime対応）
 */
export async function fetchGeminiContent(
  prompt: string,
  config: GeminiConfig
): Promise<string> {
  const { apiKey, model = "gemini-2.0-flash", maxOutputTokens = 2000, system } = config;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body: Record<string, unknown> = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens },
  };

  if (system) {
    body.system_instruction = { parts: [{ text: system }] };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (response.status === 429) {
    throw new GeminiRateLimitError(
      "本日の無料枠が終了しました。Anthropic APIキーに切り替えてご利用ください 👆"
    );
  }

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  const data = await response.json() as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };
  const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return text;
}
