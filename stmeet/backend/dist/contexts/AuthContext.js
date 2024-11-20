"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProvider = AuthProvider;
exports.useAuth = useAuth;
const react_1 = __importStar(require("react"));
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
const config_1 = require("../firebase/config");
const AuthContext = (0, react_1.createContext)(undefined);
function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    function signInWithGoogle() {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = new auth_1.GoogleAuthProvider();
            try {
                const result = yield (0, auth_1.signInWithPopup)(config_1.auth, provider);
                const email = result.user.email;
                if (!(email === null || email === void 0 ? void 0 : email.endsWith('@srttc.ac.in'))) {
                    yield (0, auth_1.signOut)(config_1.auth);
                    throw new Error('Only @srttc.ac.in email addresses are allowed');
                }
                // Store user data in Firestore
                const userRef = (0, firestore_1.doc)(config_1.db, 'users', result.user.uid);
                const userSnap = yield (0, firestore_1.getDoc)(userRef);
                if (!userSnap.exists()) {
                    yield (0, firestore_1.setDoc)(userRef, {
                        email: result.user.email,
                        displayName: result.user.displayName,
                        photoURL: result.user.photoURL,
                        createdAt: new Date().toISOString()
                    });
                }
            }
            catch (error) {
                console.error('Error signing in:', error);
                throw error;
            }
        });
    }
    function signOut() {
        return (0, auth_1.signOut)(config_1.auth);
    }
    (0, react_1.useEffect)(() => {
        const unsubscribe = (0, auth_1.onAuthStateChanged)(config_1.auth, user => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);
    const value = {
        currentUser,
        loading,
        signInWithGoogle,
        signOut
    };
    return (<AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>);
}
function useAuth() {
    const context = (0, react_1.useContext)(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
