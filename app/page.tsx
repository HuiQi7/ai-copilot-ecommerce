"use client"
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AnalysisType, Tone, ReviewInsightsResponse, SupportCopilotResponse } from './types'

export default function Home() {
  // Main state
  const [activeDashboardTab, setActiveDashboardTab] = useState('review-analysis')
  
  // Review Analysis state
  const [reviewInput, setReviewInput] = useState('')
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewResult, setReviewResult] = useState<ReviewInsightsResponse | null>(null)
  const [reviewError, setReviewError] = useState('')
  
  // Support Copilot state
  const [supportInput, setSupportInput] = useState('')
  const [supportLoading, setSupportLoading] = useState(false)
  const [supportResult, setSupportResult] = useState<SupportCopilotResponse | null>(null)
  const [supportError, setSupportError] = useState('')
  
  // Insights Dashboard state
  const [insightsLoading, setInsightsLoading] = useState(false)
  const [insightsData, setInsightsData] = useState<any>(null)
  const [insightsError, setInsightsError] = useState('')

  // Sample reviews for demo
  const sampleReviews = [
    "The product is great, but the packaging was damaged when it arrived.",
    "I love this product! It works exactly as described and the quality is excellent.",
    "The size is too small for what I need. I had to return it.",
    "The delivery was delayed by a week. Very disappointed with the service.",
    "This product is amazing! It exceeded my expectations in every way."
  ]

  // Sample support message for demo
  const sampleSupportMessage = "I received my order yesterday, but the item was damaged. I would like to request a refund."

  // Handle Review Analysis
  const handleReviewAnalyze = async () => {
    if (!reviewInput.trim()) return

    setReviewLoading(true)
    setReviewError('')
    try {
      const reviews = reviewInput.split('\n').filter(line => line.trim())
      
      const response = await fetch('/api/review-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reviews })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze reviews')
      }

      const data = await response.json()
      setReviewResult(data)
    } catch (error) {
      console.error('Error analyzing reviews:', error)
      setReviewError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setReviewLoading(false)
    }
  }

  // Handle Support Copilot
  const handleSupportAnalyze = async () => {
    if (!supportInput.trim()) return

    setSupportLoading(true)
    setSupportError('')
    try {
      const response = await fetch('/api/support-copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: supportInput })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze support message')
      }

      const data = await response.json()
      setSupportResult(data)
    } catch (error) {
      console.error('Error analyzing support message:', error)
      setSupportError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setSupportLoading(false)
    }
  }

  // Handle Insights Dashboard
  const handleLoadInsights = async () => {
    setInsightsLoading(true)
    setInsightsError('')
    try {
      // Mock data for demo
      const mockData = {
        products: [
          {
            name: "Wireless Headphones",
            top_problems: ["Battery life", "Connection issues", "Comfort"],
            trend: "decreasing",
            overall_sentiment: "positive"
          },
          {
            name: "Smart Watch",
            top_problems: ["Battery life", "Display issues", "Band quality"],
            trend: "stable",
            overall_sentiment: "neutral"
          },
          {
            name: "Bluetooth Speaker",
            top_problems: ["Sound quality", "Battery life", "Durability"],
            trend: "increasing",
            overall_sentiment: "negative"
          }
        ]
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setInsightsData(mockData)
    } catch (error) {
      console.error('Error loading insights:', error)
      setInsightsError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setInsightsLoading(false)
    }
  }

  // Load sample data
  const loadSampleReviews = () => {
    setReviewInput(sampleReviews.join('\n\n'))
  }

  const loadSampleSupportMessage = () => {
    setSupportInput(sampleSupportMessage)
  }

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Copilot for E-commerce Operations
        </h1>
        <p className="text-gray-600">
          Analyze product reviews, generate customer support replies, and gain insights with AI
        </p>
      </div>

      {/* Dashboard Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            className={`tab ${activeDashboardTab === 'review-analysis' ? 'tab-active' : ''}`}
            onClick={() => setActiveDashboardTab('review-analysis')}
          >
            Review Analysis
          </button>
          <button
            className={`tab ${activeDashboardTab === 'support-copilot' ? 'tab-active' : ''}`}
            onClick={() => setActiveDashboardTab('support-copilot')}
          >
            Support Copilot
          </button>
          <button
            className={`tab ${activeDashboardTab === 'insights-dashboard' ? 'tab-active' : ''}`}
            onClick={() => setActiveDashboardTab('insights-dashboard')}
          >
            Insights Dashboard
          </button>
        </div>
      </div>

      {/* Review Analysis Tab */}
      {activeDashboardTab === 'review-analysis' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Review Analysis</h2>
              <p className="text-sm text-gray-500">Analyze multiple product reviews to get insights and suggestions</p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="reviewInput" className="block text-sm font-medium text-gray-700 mb-2">
                Product Reviews
              </label>
              <textarea
                id="reviewInput"
                className="textarea h-64"
                placeholder="Paste multiple product reviews, one per line..."
                value={reviewInput}
                onChange={(e) => setReviewInput(e.target.value)}
                disabled={reviewLoading}
              />
              <div className="mt-2 flex justify-end">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={loadSampleReviews}
                  disabled={reviewLoading}
                >
                  Load Sample Reviews
                </button>
              </div>
            </div>

            <button
              className={`btn btn-primary w-full ${reviewLoading ? 'btn-disabled' : ''}`}
              onClick={handleReviewAnalyze}
              disabled={reviewLoading}
            >
              {reviewLoading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  Analyzing...
                </div>
              ) : (
                'Analyze Reviews'
              )}
            </button>
            {reviewError && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {reviewError}
              </div>
            )}
          </div>

          {reviewResult && (
            <div className="space-y-6">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Top Issues</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {reviewResult.top_issues.map((issue, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-lg font-semibold mb-2">{issue.issue}</div>
                      <div className="text-2xl font-bold text-blue-600">{issue.ratio}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Sentiment Analysis</h2>
                </div>
                <div className="flex items-center">
                  <span className={`badge ${reviewResult.sentiment === 'positive' ? 'badge-success' : reviewResult.sentiment === 'negative' ? 'badge-error' : 'badge-warning'}`}>
                    {reviewResult.sentiment.charAt(0).toUpperCase() + reviewResult.sentiment.slice(1)}
                  </span>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Actionable Suggestions</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Product Improvements</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {reviewResult.suggestions.product.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Listing Optimization</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {reviewResult.suggestions.listing.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">FAQ Suggestions</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {reviewResult.suggestions.faq.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Support Copilot Tab */}
      {activeDashboardTab === 'support-copilot' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Customer Support Copilot</h2>
              <p className="text-sm text-gray-500">Analyze customer messages and generate responses</p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="supportInput" className="block text-sm font-medium text-gray-700 mb-2">
                Customer Message
              </label>
              <textarea
                id="supportInput"
                className="textarea h-48"
                placeholder="Paste customer message..."
                value={supportInput}
                onChange={(e) => setSupportInput(e.target.value)}
                disabled={supportLoading}
              />
              <div className="mt-2 flex justify-end">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={loadSampleSupportMessage}
                  disabled={supportLoading}
                >
                  Load Sample Message
                </button>
              </div>
            </div>

            <button
              className={`btn btn-primary w-full ${supportLoading ? 'btn-disabled' : ''}`}
              onClick={handleSupportAnalyze}
              disabled={supportLoading}
            >
              {supportLoading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  Analyzing...
                </div>
              ) : (
                'Analyze Message'
              )}
            </button>
            {supportError && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {supportError}
              </div>
            )}
          </div>

          {supportResult && (
            <div className="space-y-6">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Intent Analysis</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Intent</div>
                    <div className="text-lg font-semibold">
                      {supportResult.intent.replace('_', ' ').charAt(0).toUpperCase() + supportResult.intent.replace('_', ' ').slice(1)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Confidence</div>
                    <div className="text-lg font-semibold">
                      {Math.round(supportResult.confidence * 100)}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Suggested Action</h2>
                </div>
                <div className="text-lg font-semibold">
                  {supportResult.action.replace('_', ' ').charAt(0).toUpperCase() + supportResult.action.replace('_', ' ').slice(1)}
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Generated Reply</h2>
                </div>
                <div className="prose">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{supportResult.reply}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Insights Dashboard Tab */}
      {activeDashboardTab === 'insights-dashboard' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Product Issue Dashboard</h2>
              <p className="text-sm text-gray-500">View aggregate review analysis and trends</p>
            </div>
            
            <button
              className={`btn btn-primary w-full ${insightsLoading ? 'btn-disabled' : ''}`}
              onClick={handleLoadInsights}
              disabled={insightsLoading}
            >
              {insightsLoading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  Loading Insights...
                </div>
              ) : (
                'Load Insights'
              )}
            </button>
            {insightsError && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {insightsError}
              </div>
            )}
          </div>

          {insightsData && (
            <div className="space-y-6">
              {insightsData.products.map((product: any, index: number) => (
                <div key={index} className="card">
                  <div className="card-header">
                    <div className="flex justify-between items-center">
                      <h2 className="card-title">{product.name}</h2>
                      <span className={`badge ${product.overall_sentiment === 'positive' ? 'badge-success' : product.overall_sentiment === 'negative' ? 'badge-error' : 'badge-warning'}`}>
                        {product.overall_sentiment.charAt(0).toUpperCase() + product.overall_sentiment.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Top Problems</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {product.top_problems.map((problem: string, i: number) => (
                          <li key={i}>{problem}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Trend</h3>
                      <span className={`badge ${product.trend === 'increasing' ? 'badge-error' : product.trend === 'decreasing' ? 'badge-success' : 'badge-warning'}`}>
                        {product.trend.charAt(0).toUpperCase() + product.trend.slice(1)} Complaints
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}