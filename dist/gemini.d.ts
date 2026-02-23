/**
 * Gemini API クライアント
 * Edge Runtime対応 (fetch APIのみ使用)
 *
 * REQ-AC-001, REQ-AC-002, REQ-AC-004, REQ-AC-005
 */
export interface GeminiConfig {
    apiKey: string;
    model?: string;
    maxOutputTokens?: number;
    system?: string;
}
export declare class GeminiRateLimitError extends Error {
    constructor(message: string);
}
/**
 * Gemini APIを呼び出してテキストを生成する
 *
 * REQ-AC-001: Gemini APIを呼び出してテキストを生成
 * REQ-AC-002: 429エラー時はGeminiRateLimitErrorを投げる
 * REQ-AC-004: fetch APIのみ使用（Edge Runtime対応）
 */
export declare function fetchGeminiContent(prompt: string, config: GeminiConfig): Promise<string>;
//# sourceMappingURL=gemini.d.ts.map