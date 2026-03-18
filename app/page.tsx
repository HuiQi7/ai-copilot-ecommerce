"use client"
import { useState } from 'react'
import { AnalysisType, Tone } from './types'

export default function Home() {
  const [input, setInput] = useState('')
  const [analysisType, setAnalysisType] = useState<AnalysisType>('review')
  const [tone, setTone] = useState<Tone>('professional')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('summary')
  const [result, setResult] = useState({
    summary: '',
    risk: '',
    suggestion: '',
    reply: ''
  })

  const handleAnalyze = async () => {
    if (!input.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input,
          type: analysisType,
          tone: analysisType === 'support' ? tone : undefined
        })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze content')
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error analyzing content:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Copilot for E-commerce Operations
        </h1>
        <p className="text-gray-600">
          Analyze product reviews and generate customer support replies with AI
        </p>
      </div>

      <div className="card mb-8">
        <div className="mb-6">
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
            Input Content
          </label>
          <textarea
            id="input"
            className="textarea h-48"
            placeholder="Paste product reviews, customer messages, or order details..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="analysisType" className="block text-sm font-medium text-gray-700 mb-2">
              Analysis Type
            </label>
            <select
              id="analysisType"
              className="select"
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value as AnalysisType)}
              disabled={loading}
            >
              <option value="review">Review Analysis</option>
              <option value="support">Customer Support Reply</option>
            </select>
          </div>

          {analysisType === 'support' && (
            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
                Tone
              </label>
              <select
                id="tone"
                className="select"
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                disabled={loading}
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="firm">Firm</option>
              </select>
            </div>
          )}
        </div>

        <button
          className={`btn btn-primary w-full ${loading ? 'btn-disabled' : ''}`}
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </div>
          ) : (
            'Analyze'
          )}
        </button>
      </div>

      {Object.values(result).some(value => value) && (
        <div className="card">
          {analysisType === 'review' ? (
            <>
              <div className="border-b border-gray-200 mb-4">
                <div className="flex space-x-4">
                  <button
                    className={`tab ${activeTab === 'summary' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('summary')}
                  >
                    Summary
                  </button>
                  <button
                    className={`tab ${activeTab === 'risk' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('risk')}
                  >
                    Risk
                  </button>
                  <button
                    className={`tab ${activeTab === 'suggestion' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('suggestion')}
                  >
                    Suggestion
                  </button>
                </div>
              </div>

              <div className="prose max-w-none">
                {activeTab === 'summary' && <p>{result.summary}</p>}
                {activeTab === 'risk' && <p>{result.risk}</p>}
                {activeTab === 'suggestion' && <p>{result.suggestion}</p>}
              </div>
            </>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Suggested Reply</h3>
              <div className="prose max-w-none">
                <p>{result.reply}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}