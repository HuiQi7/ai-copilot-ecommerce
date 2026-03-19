const fetch = require('node-fetch');

async function testApi() {
  try {
    const response = await fetch('http://localhost:3002/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: 'This is a test product review',
        type: 'review'
      })
    });

    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testApi();