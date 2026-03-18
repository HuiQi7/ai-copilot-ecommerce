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