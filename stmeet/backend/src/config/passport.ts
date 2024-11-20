import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User';

passport.use(new GoogleStrategy({
  clientID: "96816121559-0eltkspmofrk50h2aatljeabvhvkjbo2.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "/auth/google/callback",
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0].value;
      
      if (!email?.endsWith('@srttc.ac.in')) {
        return done(new Error('Only @srttc.ac.in emails are allowed'));
      }

      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email: email,
          name: profile.displayName,
          picture: profile.photos?.[0].value
        });
      } else {
        user.lastLogin = new Date();
        await user.save();
      }
      
      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});