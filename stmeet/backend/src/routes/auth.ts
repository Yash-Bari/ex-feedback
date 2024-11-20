// server/routes/auth.ts
import express from 'express';
import passport from 'passport';

const router = express.Router();
const CLIENT_URL = 'http://localhost:5173'; // Update this to your React app's URL

router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email']
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${CLIENT_URL}/login`,
    successRedirect: CLIENT_URL,
  })
);

router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
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

export default router;