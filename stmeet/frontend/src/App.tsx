// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './components/auth/GoogleAuthProvider';
import { PrivateRoute } from './components/PrivateRoute';
import { Landing } from './components/Landing';
import { Login } from './components/Login';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Landing />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;