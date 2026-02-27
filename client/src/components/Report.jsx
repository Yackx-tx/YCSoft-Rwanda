import { useState, useEffect } from "react";
import { getSales } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "./Context/AuthContext";

export default function Report() {
  const user = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSales() {
      try {
        const data = await getSales();
        if (data.error) {
          setError(data.message || "Failed to load report");
          return;
        }
        setSales(data);
      } catch (err) {
        setError("Error loading report");
      } finally {
        setLoading(false);
      }
    }
    loadSales();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  const grandTotalAmount = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
  const grandTotalProfit = sales.reduce((sum, sale) => sum + (sale.totalProfit || 0), 0);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Sales Report</h2>
      
      <div className="bg-white  shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 text-slate-600 font-semibold">Date</th>
              <th className="p-4 text-slate-600 font-semibold">Items Sold</th>
              {user?.role === "Admin" && (
                <th className="p-4 text-slate-600 font-semibold">Cashier</th>
              )}
              <th className="p-4 text-slate-600 font-semibold">Total Amount</th>
              {user?.role === "Admin" && (
                <th className="p-4 text-slate-600 font-semibold">Profit</th>
              )}
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-slate-500">
                  No sales found.
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale._id} className="border-b hover:bg-slate-50">
                  <td className="p-4 text-slate-700">
                    {new Date(sale.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 text-slate-700">
                    <ul className="list-disc list-inside">
                      {sale.products.map((p, index) => (
                        <li key={index}>
                          {p.product ? p.product.name : "Unknown"} (x{p.quantity}) - {p.product ? p.product.sellingPrice : "?"} RWF
                        </li>
                      ))}
                    </ul>
                  </td>
                  {user?.role === "Admin" && (
                    <td className="p-4 text-slate-700">
                      {sale.cashier ? sale.cashier.name : "Unknown"}
                    </td>
                  )}
                  <td className="p-4 font-bold text-slate-800">
                    {sale.totalAmount.toLocaleString()} RWF
                  </td>
                  {user?.role === "Admin" && (
                    <td className="p-4 font-bold text-green-600">
                      {sale.totalProfit.toLocaleString()} RWF
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
          {sales.length > 0 && (
            <tfoot className="bg-slate-50 border-t border-slate-200">
              <tr>
                <td colSpan={user?.role === "Admin" ? 3 : 2} className="p-4 text-right font-bold text-slate-800 uppercase tracking-wide text-sm">
                  Grand Total
                </td>
                <td className="p-4 font-bold text-slate-900 text-lg">
                  {grandTotalAmount.toLocaleString()} RWF
                </td>
                {user?.role === "Admin" && (
                  <td className="p-4 font-bold text-green-700 text-lg">
                    {grandTotalProfit.toLocaleString()} RWF
                  </td>
                )}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
