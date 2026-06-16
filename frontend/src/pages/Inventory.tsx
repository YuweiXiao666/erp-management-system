import { useEffect, useState } from "react";
import { Product } from "../types/database";
import { Package, AlertTriangle, Plus, Minus } from "lucide-react";

export function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [adjustValue, setAdjustValue] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const adjustStock = async (productId: string, adjustment: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${productId}/stock`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            adjustment,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update stock");
      }

      await fetchProducts();

      setEditingStock(null);
      setAdjustValue("");
    } catch (err) {
      console.error("Error adjusting stock:", err);
    }
  };

  const categories = [...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStockPercentage = (product: Product) => {
    const ratio = product.current_stock / product.safety_stock;
    return Math.min(100, (ratio / 2) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const lowStockProducts = products.filter(
    (p) => p.current_stock < p.safety_stock,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Inventory Control</h1>
        <p className="text-slate-500 mt-1">
          Real-time stock monitoring and safety levels
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Package className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Products</p>
              <p className="text-2xl font-bold text-slate-800">
                {products.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Package className="text-emerald-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Stock</p>
              <p className="text-2xl font-bold text-slate-800">
                {products
                  .reduce((sum, p) => sum + p.current_stock, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div
          className={`bg-white rounded-xl border ${lowStockProducts.length > 0 ? "border-amber-300 ring-2 ring-amber-100" : "border-slate-200"} p-6`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-lg ${lowStockProducts.length > 0 ? "bg-amber-50" : "bg-slate-50"}`}
            >
              <AlertTriangle
                className={
                  lowStockProducts.length > 0
                    ? "text-amber-600"
                    : "text-slate-400"
                }
                size={24}
              />
            </div>
            <div>
              <p className="text-sm text-slate-500">Low Stock Alerts</p>
              <p
                className={`text-2xl font-bold ${lowStockProducts.length > 0 ? "text-amber-600" : "text-slate-800"}`}
              >
                {lowStockProducts.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by code or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Product Code
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Product Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Category
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                  Current Stock
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                  Safety Level
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Stock Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                  Unit Price
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                  Adjust
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => {
                const isLowStock = product.current_stock < product.safety_stock;
                return (
                  <tr
                    key={product.id}
                    className={`transition-colors ${isLowStock ? "bg-red-50 hover:bg-red-100" : "hover:bg-slate-50"}`}
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded text-slate-700">
                        {product.product_code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800">
                          {product.name}
                        </span>
                        {isLowStock && (
                          <AlertTriangle size={16} className="text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-sm rounded">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`font-semibold ${isLowStock ? "text-red-600 bg-red-100 px-3 py-1 rounded-full" : "text-slate-800"}`}
                      >
                        {product.current_stock.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-600">
                      {product.safety_stock.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              product.current_stock >= product.safety_stock
                                ? "bg-emerald-500"
                                : product.current_stock >=
                                    product.safety_stock * 0.5
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${getStockPercentage(product)}%` }}
                          />
                        </div>
                        <span
                          className={`text-sm ${
                            product.current_stock >= product.safety_stock
                              ? "text-emerald-600"
                              : product.current_stock >=
                                  product.safety_stock * 0.5
                                ? "text-amber-600"
                                : "text-red-600"
                          }`}
                        >
                          {product.current_stock >= product.safety_stock
                            ? "OK"
                            : "Low"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-800">
                      {formatCurrency(product.unit_price)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => adjustStock(product.id, -1)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {editingStock === product.id ? adjustValue : ""}
                        </span>
                        <button
                          onClick={() => adjustStock(product.id, 1)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    <Package
                      className="mx-auto mb-3 text-slate-300"
                      size={40}
                    />
                    <p>No products found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
