"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_1 = require("../models/User");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: "96816121559-0eltkspmofrk50h2aatljeabvhvkjbo2.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "/auth/google/callback",
    scope: ['profile', 'email']
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        if (!(email === null || email === void 0 ? void 0 : email.endsWith('@srttc.ac.in'))) {
            return done(new Error('Only @srttc.ac.in emails are allowed'));
        }
        let user = yield User_1.User.findOne({ googleId: profile.id });
        if (!user) {
            user = yield User_1.User.create({
                googleId: profile.id,
                email: email,
                name: profile.displayName,
                picture: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value
            });
        }
        else {
            user.lastLogin = new Date();
            yield user.save();
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
