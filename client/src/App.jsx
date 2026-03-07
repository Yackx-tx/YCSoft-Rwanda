import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./components/Context/AuthContext";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Products from "./components/Products.jsx";
import Sales from "./components/Sales.jsx";
import Report from "./components/Report.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  // Check for stored user/token on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (err) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // When user logs in
  function handleLogin(loggedInUser) {
    setUser(loggedInUser);
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // Loading state
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  // No user = show login or register
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // User is logged in - show full app with protected routes
  const defaultPath = user.role === "Admin" ? "/dashboard" : "/sales";

  return (
    <AuthContext.Provider value={user}>
      <div className="min-h-screen bg-slate-100">
        <Navbar user={user} onLogout={handleLogout} />
        <main>
          <Routes>
            {/* Admin-only routes */}
            <Route path="/dashboard" element={<ProtectedRoute role="Admin"><Dashboard /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute role="Admin"><Products /></ProtectedRoute>} />
            
            {/* Public routes for authenticated users */}
            <Route path="/sales" element={<Sales />} />
            <Route path="/report" element={<Report />} />
            
            {/* Default redirect */}
            <Route path="*" element={<Navigate to={defaultPath} replace />} />
          </Routes>
        </main>
      </div>
    </AuthContext.Provider>
  );
}
