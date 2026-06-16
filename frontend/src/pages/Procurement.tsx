import { useEffect, useState } from "react";
import {
  Product,
  Supplier,
  PurchaseOrder,
  PurchaseOrderStatus,
} from "../types/database";
import { Plus, X, Package, Check } from "lucide-react";

export function Procurement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    supplier_id: "",
    product_id: "",
    quantity: "",
    unit_price: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, suppliersRes, ordersRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/products`),
        fetch(`${import.meta.env.VITE_API_URL}/api/suppliers`),
        fetch(`${import.meta.env.VITE_API_URL}/api/purchases`),
      ]);

      const products = await productsRes.json();
      const suppliers = await suppliersRes.json();
      const orders = await ordersRes.json();

      setProducts(products);
      setSuppliers(suppliers);
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
      const unitPrice = parseFloat(formData.unit_price);
      const totalAmount = quantity * unitPrice;

      const poCount = orders.length + 1;
      const poNumber = `PO-${new Date().getFullYear()}-${String(poCount).padStart(3, "0")}`;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/purchases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          po_number: poNumber,
          supplier_id: formData.supplier_id || null,
          product_id: formData.product_id,
          product_name: product.name,
          quantity,
          unit_price: unitPrice,
          total_amount: totalAmount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create purchase order");
      }

      setShowModal(false);
      setFormData({
        supplier_id: "",
        product_id: "",
        quantity: "",
        unit_price: "",
      });
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: PurchaseOrderStatus) => {
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/purchases/${id}/status`,
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

  const getStatusStyle = (status: PurchaseOrderStatus) => {
    switch (status) {
      case "draft":
        return "bg-slate-100 text-slate-700";
      case "sent":
        return "bg-blue-100 text-blue-700";
      case "fulfilled":
        return "bg-emerald-100 text-emerald-700";
    }
  };

  const getStatusLabel = (status: PurchaseOrderStatus) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "sent":
        return "Sent";
      case "fulfilled":
        return "Fulfilled";
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
            Procurement Management
          </h1>
          <p className="text-slate-500 mt-1">
            Track supplier orders and inventory intake
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>New Purchase Order</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  PO Number
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Supplier
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Product
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                  Quantity
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                  Unit Price
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                  Total
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
                      {order.po_number}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {order.suppliers?.name || "-"}
                  </td>
                  <td className="px-6 py-4 text-slate-800">
                    {order.product_name}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-700">
                    {order.quantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-700">
                    {formatCurrency(order.unit_price)}
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
                      {order.status === "draft" && (
                        <button
                          onClick={() => updateStatus(order.id, "sent")}
                          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Send
                        </button>
                      )}
                      {order.status === "sent" && (
                        <button
                          onClick={() => updateStatus(order.id, "fulfilled")}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                        >
                          <Check size={14} />
                          Fulfill
                        </button>
                      )}
                      {order.status === "fulfilled" && (
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
                    colSpan={8}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    <Package
                      className="mx-auto mb-3 text-slate-300"
                      size={40}
                    />
                    <p>No purchase orders yet</p>
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
                New Purchase Order
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
                  Supplier
                </label>
                <select
                  value={formData.supplier_id}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier_id: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
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
                  onChange={(e) => {
                    const product = products.find(
                      (p) => p.id === e.target.value,
                    );
                    setFormData({
                      ...formData,
                      product_id: e.target.value,
                      unit_price: product
                        ? String(product.unit_price * 0.7)
                        : "",
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.product_code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Unit Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unit_price}
                    onChange={(e) =>
                      setFormData({ ...formData, unit_price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {formData.quantity && formData.unit_price && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <span className="text-sm text-slate-500">Total:</span>
                  <span className="text-lg font-semibold text-slate-800 ml-2">
                    {formatCurrency(
                      parseInt(formData.quantity) *
                        parseFloat(formData.unit_price),
                    )}
                  </span>
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
