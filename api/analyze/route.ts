import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { AnalyzeRequest, AnalyzeResponse } from '@/app/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

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

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      })

      const result = completion.choices[0].message.content || ''
      
      // Parse the result into structured response
      const summaryMatch = result.match(/1\. Summary \(key insights\)([\s\S]*?)2\. Risks/)
      const riskMatch = result.match(/2\. Risks \(customer dissatisfaction, product issues, operational risks\)([\s\S]*?)3\. Suggestions/)
      const suggestionMatch = result.match(/3\. Suggestions \(clear actionable improvements\)([\s\S]*)$/)

      response = {
        summary: summaryMatch ? summaryMatch[1].trim() : '',
        risk: riskMatch ? riskMatch[1].trim() : '',
        suggestion: suggestionMatch ? suggestionMatch[1].trim() : '',
        reply: ''
      }
    } else if (type === 'support') {
      const prompt = `You are a professional e-commerce customer support agent.\n\nWrite a response to the customer message below.\n\nTone: ${tone || 'professional'}\n\nMessage:\n${input}`

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      })

      response = {
        summary: '',
        risk: '',
        suggestion: '',
        reply: completion.choices[0].message.content || ''
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error analyzing content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}