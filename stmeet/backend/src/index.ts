// server/index.ts
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import authRoutes from './routes/auth';
import './config/passport';
import { UserManager } from "./managers/UserManger";

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors({
  origin: "http://localhost:5173", // Update this to your React app's URL
  credentials: true
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: process.env.NODE_ENV === 'production' ? '.your-domain.com' : 'localhost'
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Mount auth routes
app.use('/auth', authRoutes); // Changed from '/api/auth' to '/auth'

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stmeet')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update this to your React app's URL
    credentials: true
  }
});

const userManager = new UserManager();

io.on('connection', (socket) => {
  console.log('a user connected');
  userManager.addUser("randomName", socket);
  
  socket.on("disconnect", () => {
    console.log("user disconnected");
    userManager.removeUser(socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});