import { useState, useEffect } from "react";
import { getDashboard } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "./Context/AuthContext";

export default function Dashboard() {
  const user = useAuth();
  // State holds the fetched stats
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboard();
        if (data.error) {
          setError(data.message || "Failed to load dashboard");
          return;
        }
        setStats(data);
      } catch (err) {
        setError("Error loading dashboard");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []); // ← empty array = run once on mount

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!stats) return <div className="p-8 text-slate-400">No data available</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h2>
      <p className="text-slate-600 mb-4">Welcome back! Here's what's happening today.</p>

      {user && (
        <div className="mb-6">
          <span className="text-sm  font-bold">
            {user.name} <span className="text-slate-400">({user.role})</span>
          </span>
        </div>
      )}

        

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Products" value={stats.totalProducts} color="bg-blue-500"  />
        <StatCard label="Total Sales"    value={stats.totalSales}    color="bg-green-500" />
        <StatCard label="Total Accumulated Profit"   value={`${stats.totalProfit.toLocaleString()} RWF`} color="bg-black"/>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white  shadow p-6">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">⚠️ Low Stock Alerts</h3>
        {stats.lowStockProducts.length === 0 ? (
          <p className="text-slate-400 text-sm">All products are well stocked.</p>
        ) : (
          <ul className="space-y-2">
            {stats.lowStockProducts.map((item) => (
              <li key={item.name} className="flex items-center justify-between bg-red-50 border border-red-100  px-4 py-2">
                <span className="font-medium text-slate-700">{item.name}</span>
                <span className="text-red-500 text-sm font-semibold">{item.quantityInStock} left</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Reusable stat card
function StatCard({ label, value, color, icon }) {
  return (
    <div className={`${color} text-white  p-5 shadow`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-80 mt-1">{label}</div>
    </div>
  );
}
