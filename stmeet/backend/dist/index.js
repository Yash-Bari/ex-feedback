"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/index.ts
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const auth_1 = __importDefault(require("./routes/auth"));
require("./config/passport");
const UserManger_1 = require("./managers/UserManger");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Enable CORS
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // Update this to your React app's URL
    credentials: true
}));
// Session configuration
app.use((0, express_session_1.default)({
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
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Mount auth routes
app.use('/auth', auth_1.default); // Changed from '/api/auth' to '/auth'
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stmeet')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
// Socket.io setup
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173", // Update this to your React app's URL
        credentials: true
    }
});
const userManager = new UserManger_1.UserManager();
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
