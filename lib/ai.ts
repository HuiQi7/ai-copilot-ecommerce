import { DeepSeekChatCompletionRequest, DeepSeekChatCompletionResponse } from '../app/types';

class AIClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    this.baseUrl = 'https://api.deepseek.com/v1/chat/completions';
  }

  async chatCompletion(request: DeepSeekChatCompletionRequest): Promise<DeepSeekChatCompletionResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get chat completion');
    }

    return response.json();
  }

  async analyzeReviews(reviews: string[]): Promise<any> {
    const prompt = `You are an e-commerce expert. Analyze the following product reviews and return a structured JSON response with:\n\n1. top_issues: An array of objects with "issue" (string) and "ratio" (string percentage) representing the most common issues mentioned in the reviews.\n2. sentiment: A string indicating the overall sentiment ("positive", "negative", or "neutral").\n3. suggestions: An object with three arrays:\n   - product: Suggestions for product improvements.\n   - listing: Suggestions for optimizing the product listing.\n   - faq: Suggestions for frequently asked questions to add.\n\nReviews:\n${reviews.join('\n\n')}\n\nReturn only the JSON object, no additional text. Make sure the JSON is valid and properly formatted.`;

    const response = await this.chatCompletion({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = response.choices?.[0]?.message?.content || '';
    console.log('AI Response Content:', content);
    
    try {
      // 尝试清理内容，移除可能的额外文本
      const cleanedContent = content.trim().replace(/^[^\{]+/, '').replace(/[^\}]+$/, '');
      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      throw new Error(`Failed to parse AI response as JSON. Response content: ${content.substring(0, 200)}...`);
    }
  }

  async analyzeSupportMessage(message: string): Promise<any> {
    const prompt = `You are a customer support expert. Analyze the following customer message and return a structured JSON response with:\n\n1. intent: A string indicating the customer's intent ("refund", "exchange", "complaint", "inquiry", or "other").\n2. confidence: A number between 0 and 1 representing the confidence in the intent detection.\n3. action: A string suggesting the appropriate action to take.\n4. reply: A professional and helpful reply to the customer.\n\nCustomer message:\n${message}\n\nReturn only the JSON object, no additional text. Make sure the JSON is valid and properly formatted.`;

    const response = await this.chatCompletion({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = response.choices?.[0]?.message?.content || '';
    console.log('AI Response Content:', content);
    
    try {
      // 尝试清理内容，移除可能的额外文本
      const cleanedContent = content.trim().replace(/^[^\{]+/, '').replace(/[^\}]+$/, '');
      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      throw new Error(`Failed to parse AI response as JSON. Response content: ${content.substring(0, 200)}...`);
    }
  }

  async tagReview(review: string): Promise<string[]> {
    const prompt = `You are an e-commerce expert. Tag the following review with the most relevant categories from this list: quality, size, delivery, service. Return only the tags as a comma-separated list, no additional text.\n\nReview:\n${review}`;

    const response = await this.chatCompletion({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 100
    });

    const content = response.choices?.[0]?.message?.content || '';
    return content.split(',').map(tag => tag.trim()).filter(Boolean);
  }

  async getProductInsights(productName: string, reviews: string[]): Promise<any> {
    const prompt = `You are an e-commerce analyst. Analyze the reviews for ${productName} and return a structured JSON response with:\n\n1. top_problems: An array of the most common problems mentioned in the reviews.\n2. trend: A string indicating if complaints are "increasing", "decreasing", or "stable".\n3. overall_sentiment: A string indicating the overall sentiment ("positive", "negative", or "neutral").\n\nReviews:\n${reviews.join('\n\n')}\n\nReturn only the JSON object, no additional text. Make sure the JSON is valid and properly formatted.`;

    const response = await this.chatCompletion({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = response.choices?.[0]?.message?.content || '';
    console.log('AI Response Content:', content);
    
    try {
      // 尝试清理内容，移除可能的额外文本
      const cleanedContent = content.trim().replace(/^[^\{]+/, '').replace(/[^\}]+$/, '');
      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      throw new Error(`Failed to parse AI response as JSON. Response content: ${content.substring(0, 200)}...`);
    }
  }
}

export const aiClient = new AIClient();
