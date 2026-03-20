export type AnalysisType = 'review' | 'support'
export type Tone = 'professional' | 'friendly' | 'firm'

export interface AnalyzeRequest {
  input: string
  type: AnalysisType
  tone?: Tone
}

export interface AnalyzeResponse {
  summary: string
  risk: string
  suggestion: string
  reply: string
}

// DeepSeek API types
export interface DeepSeekChatCompletionRequest {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string | string[];
}

export interface DeepSeekChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    logprobs: any;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  system_fingerprint?: string;
}

// Review Insights types
export interface TopIssue {
  issue: string;
  ratio: string;
}

export interface Suggestions {
  product: string[];
  listing: string[];
  faq: string[];
}

export interface ReviewInsightsResponse {
  top_issues: TopIssue[];
  sentiment: 'positive' | 'negative' | 'neutral';
  suggestions: Suggestions;
}

// Support Copilot types
export interface SupportCopilotResponse {
  intent: 'refund' | 'exchange' | 'complaint' | 'inquiry' | 'other';
  confidence: number;
  action: string;
  reply: string;
}

// Product Insights types
export interface ProductInsight {
  product_name: string;
  top_problems: string[];
  trend: 'increasing' | 'decreasing' | 'stable';
  overall_sentiment: 'positive' | 'negative' | 'neutral';
}