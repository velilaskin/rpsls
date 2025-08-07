# Deployment Guide for RPSLS Game

This guide will help you deploy the RPSLS game to Netlify (frontend) and a backend service with MongoDB Atlas.

## 🎯 Overview

- **Frontend**: React app deployed to Netlify
- **Backend**: Node.js/Express server with Socket.IO deployed to Render/Railway/Heroku
- **Database**: MongoDB Atlas (cloud)

## 📋 Prerequisites

1. **MongoDB Atlas Account**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string

2. **Netlify Account**
   - Sign up at [Netlify](https://netlify.com)
   - Connect your GitHub repository

3. **Backend Hosting Account**
   - Choose one: [Render](https://render.com), [Railway](https://railway.app), or [Heroku](https://heroku.com)

## 🗄️ MongoDB Atlas Setup

1. **Create Cluster**
   - Go to MongoDB Atlas dashboard
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create"

2. **Set Up Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Select "Read and write to any database"
   - Click "Add User"

3. **Set Up Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

4. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `rpsls`

## 🚀 Backend Deployment (Render)

1. **Sign up for Render**
   - Go to [Render](https://render.com)
   - Sign up with your GitHub account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `rpsls` repository

3. **Configure Service**
   - **Name**: `rpsls-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Set Environment Variables**
   - Click "Environment" tab
   - Add these variables:
     ```
           MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rpsls
     NODE_ENV=production
     PORT=10000
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the service URL (e.g., `https://rpsls-backend.onrender.com`)

## 🎨 Frontend Deployment (Netlify)

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select the `rpsls` repository

2. **Configure Build Settings**
   - **Base directory**: (leave empty)
   - **Build command**: `npm run build`
   - **Publish directory**: `client/build`

3. **Set Environment Variables**
   - Go to "Site settings" → "Environment variables"
   - Add:
     ```
     REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com
     ```

4. **Deploy**
   - Click "Deploy site"
   - Wait for deployment to complete

## 🔧 Environment Variables

### Backend (Render/Railway/Heroku)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rpsls
NODE_ENV=production
PORT=10000
```

### Frontend (Netlify)
```env
REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com
```

## 🧪 Testing Deployment

1. **Test Backend**
   ```bash
   curl https://your-backend-url.onrender.com/api/players
   ```

2. **Test Frontend**
   - Open your Netlify URL
   - Try to join the game
   - Check if Socket.IO connection works

## 🔄 Continuous Deployment

Both Netlify and Render will automatically deploy when you push to your main branch.

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Make sure the backend URL is correct in Netlify environment variables
   - Check that the backend allows your Netlify domain

2. **Socket.IO Connection Issues**
   - Verify the backend URL is accessible
   - Check that WebSocket connections are allowed

3. **MongoDB Connection Issues**
   - Verify the connection string is correct
   - Check that IP whitelist includes `0.0.0.0/0`

### Debugging

1. **Check Backend Logs**
   - Go to your Render/Railway/Heroku dashboard
   - Check the logs for errors

2. **Check Frontend Console**
   - Open browser developer tools
   - Look for connection errors

## 📞 Support

If you encounter issues:
1. Check the logs in your hosting platform
2. Verify all environment variables are set correctly
3. Test the backend URL directly
4. Check MongoDB Atlas connection 