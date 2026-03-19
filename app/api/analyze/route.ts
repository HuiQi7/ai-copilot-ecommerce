import { NextRequest, NextResponse } from 'next/server'
import { AnalyzeRequest, AnalyzeResponse } from '@/app/types'

if (!process.env.DEEPSEEK_API_KEY) {
  console.error('DeepSeek API key is not set')
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json()
    const { input, type, tone } = body

    if (!input || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let response: AnalyzeResponse = {
      summary: '',
      risk: '',
      suggestion: '',
      reply: ''
    }

    if (type === 'review') {
      const prompt = `You are an e-commerce expert.\n\nAnalyze the following content and return:\n\n1. Summary (key insights)\n2. Risks (customer dissatisfaction, product issues, operational risks)\n3. Suggestions (clear actionable improvements)\n\nContent:\n${input}`

      const apiResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1000
        })
      })

      console.log('API Response Status:', apiResponse.status)
      const data = await apiResponse.json()
      console.log('API Response Data:', data)
      const result = data.choices[0]?.message?.content || ''
      console.log('Result:', result)
      
      // Parse the result into structured response
      const summaryMatch = result.match(/###\s*1\. Summary[\s\S]*?\s*([\s\S]*?)###\s*2\. Risks/)
      const riskMatch = result.match(/###\s*2\. Risks[\s\S]*?\s*([\s\S]*?)###\s*3\. Suggestions/)
      const suggestionMatch = result.match(/###\s*3\. Suggestions[\s\S]*?\s*([\s\S]*)$/)

      response = {
        summary: summaryMatch ? summaryMatch[1].trim() : '',
        risk: riskMatch ? riskMatch[1].trim() : '',
        suggestion: suggestionMatch ? suggestionMatch[1].trim() : '',
        reply: ''
      }
    } else if (type === 'support') {
      const prompt = `You are a professional e-commerce customer support agent.\n\nWrite a response to the customer message below.\n\nTone: ${tone || 'professional'}\n\nMessage:\n${input}`

      const apiResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1000
        })
      })

      const data = await apiResponse.json()
      const reply = data.choices[0]?.message?.content || ''

      response = {
        summary: '',
        risk: '',
        suggestion: '',
        reply: reply
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error analyzing content:', error)
    if (error instanceof Error) {
      if (error.message.includes('ETIMEDOUT') || error.message.includes('Connection error')) {
        return NextResponse.json(
          { error: '无法连接到DeepSeek API服务器。请检查网络连接或稍后再试。' },
          { status: 500 }
        )
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: '内部服务器错误' },
      { status: 500 }
    )
  }
}