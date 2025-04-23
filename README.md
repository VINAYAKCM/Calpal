# CalPal - Nutrition Tracker

A modern nutrition tracking application with BMI calculation, personalized calorie recommendations, and an AI-powered nutrition assistant.

## Features

- BMI Calculator with personalized recommendations
- Daily calorie tracking
- Meal logging system
- Progress tracking with badge system
- AI-powered nutrition assistant using Ollama
- Modern, responsive UI

## Tech Stack

- Frontend: React.js with Tailwind CSS
- Backend: Node.js with Express
- AI: Ollama (llama3.2 model)

## Prerequisites

- Node.js (v14 or higher)
- npm
- Ollama with llama3.2 model installed

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd calpal
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
```

4. Start the backend server (from root directory):
```bash
npm run dev
```

5. Start the frontend development server (from client directory):
```bash
cd client
npm start
```

6. Ensure Ollama is running:
```bash
ollama serve
```

The application will be available at http://localhost:3000

## Environment Setup

Make sure Ollama is installed and the llama3.2 model is available:
```bash
ollama pull llama3.2
```

## Usage

1. Enter your height, weight, age, and gender to calculate BMI
2. View personalized calorie recommendations
3. Log your meals and track daily progress
4. Use the AI assistant for personalized nutrition advice

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. 