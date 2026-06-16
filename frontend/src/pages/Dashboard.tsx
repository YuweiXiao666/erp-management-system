import { useEffect, useState } from "react";
import { Product, PurchaseOrder, SalesOrder } from "../types/database";
import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

interface DashboardStats {
  totalSales: number;
  totalPurchases: number;
  totalProducts: number;
  lowStockCount: number;
  pendingOrders: number;
  fulfilledOrders: number;
}

export function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalPurchases: 0,
    totalProducts: 0,
    lowStockCount: 0,
    pendingOrders: 0,
    fulfilledOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard`);

      const data = await response.json();

      setStats(data.stats);

      setProducts(data.products || []);
      setPurchaseOrders(data.purchaseOrders || []);
      setSalesOrders(data.salesOrders || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 mt-1">
          Real-time business metrics and insights
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={formatCurrency(stats.totalSales)}
          icon={<DollarSign className="text-emerald-600" size={24} />}
          trend="up"
          trendValue="+12.5%"
          bgColor="bg-emerald-50"
        />
        <StatCard
          title="Total Purchases"
          value={formatCurrency(stats.totalPurchases)}
          icon={<ShoppingCart className="text-blue-600" size={24} />}
          trend="down"
          trendValue="-8.3%"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toString()}
          icon={<Package className="text-violet-600" size={24} />}
          bgColor="bg-violet-50"
        />
        <StatCard
          title="Low Stock Alerts"
          value={stats.lowStockCount.toString()}
          icon={<AlertTriangle className="text-amber-600" size={24} />}
          bgColor="bg-amber-50"
          highlight={stats.lowStockCount > 0}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">
            Sales Order Status
          </h3>
          <div className="flex items-center gap-8">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray={`${(stats.pendingOrders / (stats.pendingOrders + stats.fulfilledOrders || 1)) * 100}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-700">
                  {salesOrders.length}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-slate-600">Pending</span>
                <span className="font-semibold text-slate-800 ml-auto">
                  {stats.pendingOrders}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-slate-600">Shipped</span>
                <span className="font-semibold text-slate-800 ml-auto">
                  {salesOrders.length - stats.pendingOrders}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">
            Purchase Order Status
          </h3>
          <div className="space-y-4">
            <StatusBar
              label="Draft"
              count={purchaseOrders.filter((o) => o.status === "draft").length}
              total={purchaseOrders.length}
              color="bg-slate-400"
            />
            <StatusBar
              label="Sent"
              count={purchaseOrders.filter((o) => o.status === "sent").length}
              total={purchaseOrders.length}
              color="bg-amber-500"
            />
            <StatusBar
              label="Fulfilled"
              count={
                purchaseOrders.filter((o) => o.status === "fulfilled").length
              }
              total={purchaseOrders.length}
              color="bg-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockCount > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-amber-600" size={24} />
            <h3 className="font-semibold text-amber-800">Low Stock Alert</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products
              .filter((p) => p.current_stock < p.safety_stock)
              .map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg p-4 border border-amber-100"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-slate-800">
                        {product.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {product.product_code}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                      Low Stock
                    </span>
                  </div>
                  <div className="mt-3 flex justify-between text-sm">
                    <span className="text-slate-500">
                      Current:{" "}
                      <span className="font-medium text-red-600">
                        {product.current_stock}
                      </span>
                    </span>
                    <span className="text-slate-400">
                      Safety: {product.safety_stock}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">
            Recent Sales Orders
          </h3>
          <div className="space-y-3">
            {salesOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-slate-700">
                    {order.so_number}
                  </p>
                  <p className="text-sm text-slate-500">{order.product_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-800">
                    {formatCurrency(order.total_amount)}
                  </p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      order.status === "shipped"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.status === "shipped" ? "Shipped" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">
            Recent Purchase Orders
          </h3>
          <div className="space-y-3">
            {purchaseOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-slate-700">
                    {order.po_number}
                  </p>
                  <p className="text-sm text-slate-500">{order.product_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-800">
                    {formatCurrency(order.total_amount)}
                  </p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      order.status === "fulfilled"
                        ? "bg-emerald-100 text-emerald-700"
                        : order.status === "sent"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {order.status === "fulfilled"
                      ? "Fulfilled"
                      : order.status === "sent"
                        ? "Sent"
                        : "Draft"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  bgColor,
  highlight,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: "up" | "down";
  trendValue?: string;
  bgColor: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-xl border ${highlight ? "border-amber-300 ring-2 ring-amber-100" : "border-slate-200"} p-6 transition-shadow hover:shadow-lg`}
    >
      <div className="flex items-start justify-between">
        <div className={`${bgColor} p-3 rounded-lg`}>{icon}</div>
        {trend && (
          <div
            className={`flex items-center text-sm ${trend === "up" ? "text-emerald-600" : "text-red-600"}`}
          >
            {trend === "up" ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span className="ml-1">{trendValue}</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-slate-500">{title}</p>
        <p
          className={`text-2xl font-bold ${highlight ? "text-amber-600" : "text-slate-800"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-800">{count}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
