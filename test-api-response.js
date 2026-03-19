const fetch = require('node-fetch');

async function testApiResponse() {
  try {
    const response = await fetch('http://localhost:3002/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: '收到的时候包装已经破损了，有点失望。',
        type: 'review'
      })
    });

    const data = await response.json();
    console.log('API Response:', data);
    
    // 直接调用 DeepSeek API 查看原始响应
    const deepSeekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk-aa852d08e9a44d88b43529a12dcf6618`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: `You are an e-commerce expert.\n\nAnalyze the following content and return:\n\n1. Summary (key insights)\n2. Risks (customer dissatisfaction, product issues, operational risks)\n3. Suggestions (clear actionable improvements)\n\nContent:\n收到的时候包装已经破损了，有点失望。` }],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const deepSeekData = await deepSeekResponse.json();
    console.log('DeepSeek API Raw Response:', deepSeekData);
    console.log('DeepSeek API Content:', deepSeekData.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error:', error);
  }
}

testApiResponse();