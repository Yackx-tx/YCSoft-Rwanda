import { useState } from "react";

export default function Login({ onLogin, onSwitch }) {
  // State = data that belongs to this component
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); // stop page from reloading
    setLoading(true);
    setError(null);

    try {
     
      const { login } = await import("../../services/api");
      const data = await login(email, password);
      
      if (data.error || !data.token) {
        setError(data.message || "Invalid email or password.");
        return;
      }
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError("Server error. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false); // always stop loading spinner
    }
  }

  return (
    // Full-screen centered layout
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-white  shadow-xl w-full max-w-sm p-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome Back</h1>
        <p className="text-slate-500 text-sm mb-6">Sign in to your account</p>

        {/* Error message — only shown when error state is not null */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm  px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // update state on every keystroke
              placeholder="you@example.com"
              required
              className="w-full border border-slate-300  px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-slate-300  px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2  transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          {/* <a href="">forget password</a> */}
        </form>

        <p className="text-sm text-slate-500 mt-6 text-center">
          Don't have an account?{" "}
          <button onClick={onSwitch} className="text-blue-600 hover:underline font-medium">
            Create one
          </button>
        </p>

      </div>
    </div>
  );
}
