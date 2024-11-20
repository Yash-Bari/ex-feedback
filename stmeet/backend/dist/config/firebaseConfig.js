"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.googleProvider = exports.auth = void 0;
// src/config/firebaseConfig.ts
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
const firebaseConfig = {
    apiKey: "AIzaSyCWqZ035iu3z9L3B_B-OyNyRndXj4IF6rw",
    authDomain: "stmeet-c5885.firebaseapp.com",
    projectId: "stmeet-c5885",
    storageBucket: "stmeet-c5885.firebasestorage.app",
    messagingSenderId: "407855823389",
    appId: "1:407855823389:web:c3e132fa71abea52f5a4f4"
};
// Initialize Firebase
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.auth = (0, auth_1.getAuth)(app);
exports.googleProvider = new auth_1.GoogleAuthProvider();
exports.db = (0, firestore_1.getFirestore)(app);
