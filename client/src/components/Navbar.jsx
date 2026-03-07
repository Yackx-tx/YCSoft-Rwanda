import { useState } from "react";
import { useNavigate } from "react-router-dom";

function NavBtn({ label, to, onClick }) {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => {
        navigate(to);
        onClick?.();
      }}
      className={`px-4 py-1.5 text-sm font-medium transition hover:bg-slate-700`}
    >
      {label}
    </button>
  );
}

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  function handleLogout() {
    setShowDropdown(false);
    onLogout();
    navigate("/login");
  }

  return (
    <nav className="bg-black text-white px-6 py-4 flex items-center justify-between shadow-lg">
      {/* Brand */}
      <h1 className="text-lg font-bold tracking-wide">SHOP MANAGER.</h1>

      {/* Navigation Links — only show Dashboard and Products to Admin */}
      <div className="flex items-center gap-2">
        {user.role === "Admin" && (
          <>
            <NavBtn label="Dashboard" to="/dashboard" />
            <NavBtn label="Products" to="/products" />
          </>
        )}
        {/* All users can see Sales and Report */}
        <NavBtn label="Sales" to="/sales" />
        <NavBtn label="Report" to="/report" />
      </div>

      {/* User info + logout */}
      <div className="relative flex items-center gap-3">
        {/* User Icon Button */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-10 h-10 bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <span className="text-base font-bold">{user.name.charAt(0).toUpperCase()}</span>
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 top-12 mt-2 w-48 bg-white shadow-xl py-2 border border-slate-100 text-slate-800 z-50">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.role}</p>
            </div>
            <div className="px-2 py-2">
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
