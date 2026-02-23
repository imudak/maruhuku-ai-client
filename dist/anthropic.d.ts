/**
 * Anthropic Claude API クライアント
 * Edge Runtime対応 (fetch APIのみ使用)
 *
 * REQ-AC-003, REQ-AC-004, REQ-AC-005
 */
export interface AnthropicConfig {
    apiKey: string;
    model?: string;
    maxTokens?: number;
    system?: string;
    dangerouslyAllowBrowser?: boolean;
}
/**
 * Anthropic Claude APIを呼び出してテキストを生成する
 *
 * REQ-AC-003: Anthropic APIを呼び出してテキストを生成
 * REQ-AC-004: fetch APIのみ使用（Edge Runtime対応）
 */
export declare function fetchAnthropicContent(userMessage: string, config: AnthropicConfig): Promise<string>;
//# sourceMappingURL=anthropic.d.ts.map