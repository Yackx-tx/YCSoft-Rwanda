import { useState, useEffect } from "react";
import { AuthContext } from "./components/Context/AuthContext";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Products from "./components/Products.jsx";
import Sales from "./components/Sales.jsx";
import Report from "./components/Report.jsx";

export default function App() {
  const [user, setUser] = useState(null); 
  const [page, setPage] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  // Check for stored user/token on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setPage(userData.role === "Admin" ? "dashboard" : "sales");
      } catch (err) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // When user logs in, set user and redirect to their default page
  function handleLogin(loggedInUser) {
    setUser(loggedInUser);
    setPage(loggedInUser.role === "Admin" ? "dashboard" : "sales");
  }

  function handleLogout() {
    setUser(null);
    setPage(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // Loading state
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  // No user = show login or register
  if (!user) {
    if (showRegister) {
      return <Register onLogin={handleLogin} onSwitch={() => setShowRegister(false)} />;
    }
    return <Login onLogin={handleLogin} onSwitch={() => setShowRegister(true)} />;
  }

  // Render current page
  function renderPage() {
    // Protect admin-only pages
    if ((page === "dashboard" || page === "products") && user.role !== "Admin") {
      return <div className="p-8 text-red-500 font-semibold">Access Denied — Admins only.</div>;
    }
    if (page === "dashboard") return <Dashboard />;
    if (page === "products")  return <Products />;
    if (page === "sales")     return <Sales />;
    if (page === "report")    return <Report />;
    return <div className="p-8 text-slate-400">Select a page from the navbar.</div>;
  }

  return (
    // Provide user context globally
    <AuthContext.Provider value={user}>
      <div className="min-h-screen bg-slate-100">
        <Navbar user={user} onLogout={handleLogout} page={page} setPage={setPage} />
        <main>{renderPage()}</main>
      </div>
    </AuthContext.Provider>
  );
}
