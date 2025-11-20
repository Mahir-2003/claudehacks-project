#!/bin/bash

# Badgers Register - Quick Start Script
# This script helps you start the backend and provides test commands

echo "🦡 Badgers Register - Quick Start"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    echo "❌ Error: backend/ directory not found"
    echo "   Please run this script from the project root: ./start-demo.sh"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
    echo ""
fi

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env file not found"
    echo "   Creating from .env.example..."
    cp backend/.env.example backend/.env
    echo ""
    echo "⚡ ACTION REQUIRED: Add your Anthropic API key to backend/.env"
    echo "   Edit backend/.env and add: ANTHROPIC_API_KEY=sk-ant-api03-..."
    echo ""
    read -p "Press Enter when you've added your API key..."
fi

echo "🚀 Starting Backend Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd backend
echo "Starting server... (Press Ctrl+C to stop)"
echo ""

# Start the server
npm start &
SERVER_PID=$!

# Wait for server to start
sleep 3

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Backend should be running!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Open Chrome and go to: chrome://extensions/"
echo "2. Enable 'Developer mode' (top right)"
echo "3. Click 'Load unpacked' and select the 'frontend/' folder"
echo "4. Navigate to enroll.wisc.edu (or any *.wisc.edu page)"
echo "5. Click the red 'Badgers Copilot' button"
echo "6. Ask questions like 'What courses do you recommend?'"
echo ""
echo "🧪 Test the API:"
echo "   In another terminal, run:"
echo "   cd backend && node test-api.js"
echo ""
echo "🏥 Health Check:"
echo "   curl http://localhost:3000/health"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Press Ctrl+C to stop the server..."
echo ""

# Wait for the server process
wait $SERVER_PID
