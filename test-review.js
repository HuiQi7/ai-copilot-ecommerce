const fetch = require('node-fetch');

async function testReview() {
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
    console.log('Review Analysis Response:', data);
    console.log('Summary:', data.summary);
    console.log('Risk:', data.risk);
    console.log('Suggestion:', data.suggestion);
  } catch (error) {
    console.error('Error:', error);
  }
}

testReview();