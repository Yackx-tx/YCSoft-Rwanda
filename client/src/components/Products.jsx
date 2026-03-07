import { useState, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [form, setForm] = useState({ name: "", category: "", buyingPrice: "", sellingPrice: "", quantityInStock: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load products on mount and when page/search/limit changes
  useEffect(() => {
    loadProducts();
  }, [page, search, limit]);

  async function loadProducts() {
    try {
      setLoading(true);
      const response = await getProducts(page, limit, search);
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

  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      if (editId !== null) {
        // UPDATE existing product
        const result = await updateProduct(editId, form);
        if (result.error) {
          setError(result.message);
          return;
        }
      } else {
        // CREATE new product
        const result = await createProduct(form);
        if (result.error) {
          setError(result.message);
          return;
        }
      }
      setPage(1); // Reset to first page
      await loadProducts();
      resetForm();
    } catch (err) {
      setError("Operation failed");
      console.error(err);
    }
  }

  function startEdit(product) {
    setEditId(product._id);
    setForm({
      name: product.name,
      category: product.category,
      buyingPrice: product.buyingPrice,
      sellingPrice: product.sellingPrice,
      quantityInStock: product.quantityInStock
    });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    try {
      const result = await deleteProduct(id);
      if (result.error) {
        setError(result.message);
        return;
      }
      setPage(1); // Reset to first page
      await loadProducts();
    } catch (err) {
      setError("Delete failed");
      console.error(err);
    }
  }

  function resetForm() {
    setForm({ name: "", category: "", buyingPrice: "", sellingPrice: "", quantityInStock: "" });
    setEditId(null);
    setError(null);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Products</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm  px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT: Product Form ── */}
          <div className="bg-white  shadow p-6">
          <h3 className="font-semibold text-slate-700 mb-4">
            {editId ? "✏️ Edit Product" : "➕ Add Product"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              { label: "Name",           name: "name",          type: "text"   },
              { label: "Category",       name: "category",      type: "text"   },
              { label: "Buying Price",   name: "buyingPrice",   type: "number" },
              { label: "Selling Price",  name: "sellingPrice",  type: "number" },
              { label: "Stock Qty",      name: "quantityInStock",           type: "number" },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-xs font-medium text-slate-600">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleFormChange}
                  required
                  className="w-full mt-0.5 border border-slate-200  px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2  transition">
                {editId ? "Update" : "Add Product"}
              </button>
              {editId && (
                <button type="button" onClick={resetForm} className="px-4 py-2 text-sm border  hover:bg-slate-50 transition">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ── RIGHT: Product Table ── */}
        <div className="lg:col-span-2 bg-white  shadow p-6">
          {/* Search bar */}
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset to first page on search
            }}
            className="w-full border border-slate-200  px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-left">
                  <th className="px-3 py-2 font-semibold">Name</th>
                  <th className="px-3 py-2 font-semibold">Category</th>
                  <th className="px-3 py-2 font-semibold">Buy</th>
                  <th className="px-3 py-2 font-semibold">Sell</th>
                  <th className="px-3 py-2 font-semibold">Stock</th>
                  <th className="px-3 py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-2 font-medium">{p.name}</td>
                    <td className="px-3 py-2 text-slate-500">{p.category}</td>
                    <td className="px-3 py-2">{p.buyingPrice}</td>
                    <td className="px-3 py-2">{p.sellingPrice}</td>
                    <td className="px-3 py-2">
                      {/* Low stock badge */}
                      <span className={`px-2 py-0.5  text-xs font-medium ${p.quantityInStock <= 3 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                        {p.quantityInStock}
                      </span>
                    </td>
                    <td className="px-3 py-2 flex gap-2">
                      <button onClick={() => startEdit(p)} className="text-blue-500 hover:underline text-xs">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="text-red-400 hover:underline text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={6} className="text-center text-slate-400 py-6">No products found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
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
      </div>
      )}
    </div>
  );
}
