import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(v: string) {
        return v.endsWith('@srttc.ac.in');
      },
      message: 'Email must be from srttc.ac.in domain'
    }
  },
  name: { type: String, required: true },
  googleId: { type: String, required: true, unique: true },
  picture: String,
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);