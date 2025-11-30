#!/bin/bash

# AI Multi-Agent Reliability Gateway - Startup Script

echo "🚀 Starting AI Multi-Agent Reliability Gateway..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install it and try again."
    exit 1
fi

echo "📦 Building and starting services..."
docker-compose up --build -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service health
echo ""
echo "🔍 Checking service health..."

if docker-compose ps | grep -q "ai-gateway-backend.*healthy"; then
    echo "✅ Backend is healthy"
else
    echo "⚠️  Backend is starting..."
fi

if docker-compose ps | grep -q "ai-gateway-frontend.*healthy"; then
    echo "✅ Frontend is healthy"
else
    echo "⚠️  Frontend is starting..."
fi

echo ""
echo "🎉 Services are starting!"
echo ""
echo "📍 Access points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:4000"
echo "   MySQL: localhost:3306"
echo ""
echo "🔑 Default credentials:"
echo "   Email: admin@example.com"
echo "   Password: Admin123"
echo ""
echo "📊 View logs: docker-compose logs -f"
echo "🛑 Stop services: docker-compose down"
echo ""

