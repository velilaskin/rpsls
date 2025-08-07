#!/bin/bash

echo "🚀 RPSLS Game Deployment Script"
echo "================================"

# Check if .env files exist
if [ ! -f "server/.env" ]; then
    echo "⚠️  server/.env not found. Please create it with your MongoDB Atlas connection string."
    echo "Example:"
    echo "MONGODB_URI=your-mongodb-atlas-connection-string"
    echo "NODE_ENV=development"
    echo "PORT=5000"
fi

# Check if all dependencies are installed
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing root dependencies..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "Installing server dependencies..."
    cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo "Installing client dependencies..."
    cd client && npm install && cd ..
fi

echo "✅ Dependencies installed!"

# Build the client
echo "🔨 Building client..."
cd client && npm run build && cd ..

echo "✅ Build complete!"
echo ""
echo "🎯 Next Steps:"
echo "1. Set up MongoDB Atlas:"
echo "   - Create a cluster at https://www.mongodb.com/atlas"
echo "   - Get your connection string"
echo "   - Update server/.env with MONGODB_URI"
echo ""
echo "2. Deploy Backend (Render/Railway/Heroku):"
echo "   - Connect your GitHub repository"
echo "   - Set environment variables:"
echo "     MONGODB_URI=your-connection-string"
echo "     NODE_ENV=production"
echo "     PORT=10000"
echo ""
echo "3. Deploy Frontend (Netlify):"
echo "   - Connect your GitHub repository"
echo "   - Set build command: npm run build"
echo "   - Set publish directory: client/build"
echo "   - Set environment variable:"
echo "     REACT_APP_BACKEND_URL=https://your-backend-url"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions!" 