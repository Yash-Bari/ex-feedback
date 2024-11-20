"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/routes/auth.ts
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
const CLIENT_URL = 'http://localhost:5173'; // Update this to your React app's URL
router.get('/google', passport_1.default.authenticate('google', {
    scope: ['profile', 'email']
}));
router.get('/google/callback', passport_1.default.authenticate('google', {
    failureRedirect: `${CLIENT_URL}/login`,
    successRedirect: CLIENT_URL,
}));
router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    }
    else {
        res.json({ user: null });
    }
});
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ success: true });
    });
});
exports.default = router;
