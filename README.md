# AI Copilot for E-commerce Operations

A production-ready web app that helps e-commerce businesses analyze product reviews and generate customer support replies using AI.

## Tech Stack
- Next.js (App Router)
- React
- Tailwind CSS
- OpenAI API

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your OpenAI API key:
   - Create a `.env.local` file in the root directory
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=your-api-key-here
     ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

### Deployment

The app is ready to be deployed on Vercel. Follow these steps:

1. Push your code to a GitHub repository
2. Sign up for a Vercel account if you don't have one
3. Import your repository to Vercel
4. Set up the environment variable in Vercel:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add a new variable with key `OPENAI_API_KEY` and your API key as the value
5. Deploy the project

## Features

### Review Analysis
- Analyze product reviews and customer feedback
- Get a summary of key insights
- Identify potential risks and issues
- Receive actionable suggestions for improvement

### Customer Support Reply
- Generate professional customer support replies
- Choose from different tones: Professional, Friendly, or Firm
- Get high-quality responses tailored to customer messages

## Usage

1. Paste your product reviews, customer messages, or order details into the textarea
2. Select the analysis type (Review Analysis or Customer Support Reply)
3. If using Customer Support Reply, select the desired tone
4. Click the "Analyze" button
5. View the results in the output section

## API Reference

### POST /api/analyze

Request body:
```json
{
  "input": "string",
  "type": "review" | "support",
  "tone": "professional" | "friendly" | "firm" (optional, only for support type)
}
```

Response:
```json
{
  "summary": "string",
  "risk": "string",
  "suggestion": "string",
  "reply": "string"
}
```