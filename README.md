# GigFlow Project Setup Guide

This guide will help you set up and run the GigFlow project (both backend and frontend) on your local machine for development, as well as provide deployment tips.

---

## Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **MongoDB** (for local development, must support replica sets for transactions)
- **Git**

---

## 1. Clone the Repository
```
git clone https://github.com/arpitSatpute/GigFlow.git
cd GigFlow
```

---

## 2. Backend Setup

### a. Install Dependencies
```
cd backend
npm install
```

### b. Environment Variables
Create a `.env` file in the `backend` folder. Example:
```
MONGO_URI=mongodb://localhost:27017/gigflow?replicaSet=rs0
JWT_SECRET=your_jwt_secret
PORT=3000
CLIENT_URL=http://localhost:5173
```
- For deployment, use your MongoDB Atlas URI for `MONGO_URI`.

### c. MongoDB Local Setup (with Transactions)
1. **Create the data directory:**
   ```
   mkdir -p ./data/db
   ```
2. **Start MongoDB as a replica set:**
   ```
   mongod --replSet rs0 --dbpath ./data/db
   ```
   (Leave this terminal running)
3. **Initiate the replica set:**
   Open a new terminal and run:
   ```
   mongo --eval "rs.initiate()"
   ```

### d. Start the Backend Server
```
npm run dev
```
The backend will run on the port specified in your `.env` (default: 3000).

---


## 3. Frontend Setup

The frontend is built with [Vite](https://vitejs.dev/) and React, using Tailwind CSS v3 for styling.

### a. Install Dependencies
Navigate to the frontend directory and install all dependencies:
```
cd frontend
npm install
```

**Key dependencies:**
- react-router-dom
- axios
- socket.io-client
- react-hot-toast
- lucide-react
- tailwindcss@3
- postcss
- autoprefixer

### b. Tailwind CSS Configuration
Tailwind is already configured. If you need to re-init, use:
```
npx tailwindcss init -p
```
Make sure your `tailwind.config.js` content array includes:
```
   content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
   ],
```

### c. Start the Frontend
```
npm run dev
```
The frontend will run on [http://localhost:5173](http://localhost:5173) by default.

---

## 4. Deployment Tips
- Use **MongoDB Atlas** for production. For transaction support, use at least an M10 cluster.
- Deploy backend on Render, Railway, or similar. Set environment variables in the platform dashboard.
- Deploy frontend on Vercel, Netlify, or similar.
- Never commit your `.env` files to GitHub.

---

## 5. API Testing
- Use Postman or curl to test backend endpoints.
- Ensure your backend is running and connected to MongoDB before testing.

---

## 6. Troubleshooting
- If you see errors about the data directory, ensure `./data/db` exists.
- For transaction errors, make sure MongoDB is running as a replica set.
- For deployment, check that all environment variables are set correctly.

---

## 7. Useful Commands
- Start MongoDB: `mongod --replSet rs0 --dbpath ./data/db`
- Initiate Replica Set: `mongo --eval "rs.initiate()"`
- Start Backend: `npm run dev` (in backend folder)
- Start Frontend: `npm run dev` (in frontend folder)

---

## 8. Contact
For any issues, please contact the project maintainer or open an issue on GitHub.
