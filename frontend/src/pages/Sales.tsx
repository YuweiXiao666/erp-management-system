import { useEffect, useState } from "react";
import {
  Product,
  Customer,
  SalesOrder,
  SalesOrderStatus,
} from "../types/database";
import { Plus, X, ShoppingCart, Check, Truck } from "lucide-react";

export function Sales() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customer_id: "",
    product_id: "",
    quantity: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, customersRes, ordersRes] = await Promise.all([
        fetch("http://localhost:5000/api/products"),
        fetch("http://localhost:5000/api/customers"),
        fetch("http://localhost:5000/api/sales"),
      ]);

      const products = await productsRes.json();
      const customers = await customersRes.json();
      const orders = await ordersRes.json();

      setProducts(products);
      setCustomers(customers);
      setOrders(orders);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const product = products.find((p) => p.id === formData.product_id);
      if (!product) throw new Error("Please select a product");

      const quantity = parseInt(formData.quantity);
      const totalAmount = quantity * product.unit_price;

      const soCount = orders.length + 1;
      const soNumber = `SO-${new Date().getFullYear()}-${String(soCount).padStart(3, "0")}`;

      const response = await fetch("http://localhost:5000/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          so_number: soNumber,
          customer_id: formData.customer_id || null,
          product_id: formData.product_id,
          product_name: product.name,
          quantity,
          unit_price: product.unit_price,
          total_amount: totalAmount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.error || "Failed to create sales order");
      }

      setShowModal(false);
      setFormData({ customer_id: "", product_id: "", quantity: "" });
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: SalesOrderStatus) => {
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/sales/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusStyle = (status: SalesOrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "shipped":
        return "bg-emerald-100 text-emerald-700";
    }
  };

  const getStatusLabel = (status: SalesOrderStatus) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "shipped":
        return "Shipped";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Sales Management
          </h1>
          <p className="text-slate-500 mt-1">
            Manage customer orders and shipping
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>New Sales Order</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-lg">
              <ShoppingCart className="text-amber-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Pending Orders</p>
              <p className="text-2xl font-bold text-slate-800">
                {orders.filter((o) => o.status === "pending").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Check className="text-emerald-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Shipped Orders</p>
              <p className="text-2xl font-bold text-slate-800">
                {orders.filter((o) => o.status === "shipped").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Truck className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Sales</p>
              <p className="text-2xl font-bold text-slate-800">
                {formatCurrency(
                  orders.reduce((sum, o) => sum + o.total_amount, 0),
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  SO Number
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Product
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                  Quantity
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                  Total Amount
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono font-medium text-slate-800">
                      {order.so_number}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {order.customers?.name || "Guest"}
                  </td>
                  <td className="px-6 py-4 text-slate-800">
                    {order.product_name}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-700">
                    {order.quantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-800">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(order.status)}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {order.status === "pending" && (
                        <button
                          onClick={() => updateStatus(order.id, "shipped")}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                        >
                          <Truck size={14} />
                          Ship
                        </button>
                      )}
                      {order.status === "shipped" && (
                        <span className="text-slate-400 text-sm">
                          Completed
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    <ShoppingCart
                      className="mx-auto mb-3 text-slate-300"
                      size={40}
                    />
                    <p>No sales orders yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">
                New Sales Order
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-100 rounded transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Customer
                </label>
                <select
                  value={formData.customer_id}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_id: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Product <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.product_id}
                  onChange={(e) =>
                    setFormData({ ...formData, product_id: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.product_code}) - Stock:{" "}
                      {product.current_stock}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {formData.product_id && formData.quantity && (
                <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                  {(() => {
                    const product = products.find(
                      (p) => p.id === formData.product_id,
                    );
                    if (!product) return null;
                    const qty = parseInt(formData.quantity) || 0;
                    const total = qty * product.unit_price;
                    const inStock = product.current_stock >= qty;
                    return (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Unit Price:</span>
                          <span className="text-slate-800">
                            {formatCurrency(product.unit_price)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Stock Status:</span>
                          <span
                            className={
                              inStock ? "text-emerald-600" : "text-red-600"
                            }
                          >
                            {product.current_stock.toLocaleString()}{" "}
                            {inStock ? "(Available)" : "(Insufficient)"}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-200">
                          <span className="text-sm text-slate-500">Total:</span>
                          <span className="text-lg font-semibold text-slate-800">
                            {formatCurrency(total)}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Processing..." : "Create Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
