import { useState, useEffect } from "react";
import { getProducts, createSale } from "../services/api";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({}); // { productId: quantity }
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Load products on mount and when page/limit changes
  useEffect(() => {
    loadProducts();
  }, [page, limit]);

  async function loadProducts() {
    try {
      const response = await getProducts(page, limit, "");
      if (response.error) {
        setError(response.message || "Failed to load products");
        return;
      }
      
      // Handle both old format (array) and new format (object with products)
      if (Array.isArray(response)) {
        setProducts(response);
        setTotalPages(Math.ceil(response.length / limit) || 1);
      } else {
        setProducts(response.products || []);
        setTotalPages(response.totalPages || 1);
      }
    } catch (err) {
      setError("Error loading products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Update quantity for a product in cart
  function updateCart(productId, qty) {
    if (qty <= 0) {
      const newCart = { ...cart };
      delete newCart[productId]; // remove from cart if qty = 0
      setCart(newCart);
    } else {
      setCart({ ...cart, [productId]: qty });
    }
  }

  // Calculate total from cart
  const total = products.reduce((sum, p) => {
    const qty = cart[p._id] || 0;
    return sum + p.sellingPrice * qty;
  }, 0);

  // Number of items in cart
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  async function handleCheckout() {
    if (cartCount === 0) return alert("Cart is empty!");

    const items = Object.entries(cart).map(([productId, quantity]) => ({
      productId,
      quantity: Number(quantity),
    }));

    try {
      const result = await createSale(items);
      if (result.error) {
        setError(result.message);
        return;
      }
      
      setCart({});     // clear cart
      setSuccess(true);
      setPage(1);      // reset to first page
      await loadProducts(); // refresh product list
      setTimeout(() => setSuccess(false), 3000); // hide after 3s
    } catch (err) {
      setError("Sale failed");
      console.error(err);
    }
  }

  if (loading) return <div className="p-8 text-center">Loading products...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Record Sale</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm  px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {/* Success banner */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700  px-4 py-3 mb-4 text-sm font-medium">
          ✅ Sale recorded successfully! Stock has been updated.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── LEFT: Product Selection ── */}
        <div className="lg:col-span-2 bg-white  shadow p-6">
          <h3 className="font-semibold text-slate-700 mb-4">Select Products</h3>
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p._id} className="flex items-center justify-between border border-slate-100  px-4 py-3 hover:bg-slate-50">
                <div>
                  <p className="font-medium text-slate-700">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.category} · {p.sellingPrice} RWF each</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Stock badge */}
                  <span className={`text-xs px-2 py-0.5  ${p.quantityInStock === 0 ? "bg-red-100 text-red-500" : "bg-slate-100 text-slate-500"}`}>
                    {p.quantityInStock === 0 ? "Out of stock" : `${p.quantityInStock} left`}
                  </span>
                  {/* Quantity input */}
                  <input
                    type="number"
                    min="0"
                    max={p.quantityInStock}
                    value={cart[p._id] || ""}
                    onChange={(e) => updateCart(p._id, Number(e.target.value))}
                    disabled={p.quantityInStock === 0}
                    placeholder="0"
                    className="w-16 border border-slate-300  px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-slate-100"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Items per page:</label>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="text-sm text-slate-600">
              Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ← Previous
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Cart Summary ── */}
        <div className="bg-white  shadow p-6 h-fit sticky top-4">
          <h3 className="font-semibold text-slate-700 mb-4">🛒 Cart Summary</h3>
          {cartCount === 0 ? (
            <p className="text-slate-400 text-sm">No items selected.</p>
          ) : (
            <ul className="space-y-2 mb-4">
              {products
                .filter((p) => cart[p._id] > 0)
                .map((p) => (
                  <li key={p._id} className="flex justify-between text-sm">
                    <span>{p.name} × {cart[p._id]}</span>
                    <span className="font-medium">{(p.sellingPrice * cart[p._id]).toLocaleString()}</span>
                  </li>
                ))}
            </ul>
          )}

          {/* Total */}
          <div className="border-t pt-3 flex justify-between font-bold text-slate-800 text-base mb-4">
            <span>Total</span>
            <span>{total.toLocaleString()} RWF</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cartCount === 0}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-semibold py-2.5  transition text-sm"
          >
            Record Sale
          </button>
        </div>
      </div>
    </div>
  );
}
