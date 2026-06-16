import supabase from "../config/supabase.js";

// Dashboard 統計資料
export const getDashboardStats = async (req, res) => {
  try {
    const [productsRes, poRes, soRes] = await Promise.all([
      supabase.from("products").select("*"),
      supabase.from("purchase_orders").select("*"),
      supabase.from("sales_orders").select("*"),
    ]);

    const products = productsRes.data || [];
    const purchaseOrders = poRes.data || [];
    const salesOrders = soRes.data || [];

    const totalSales = salesOrders.reduce(
      (sum, order) => sum + Number(order.total_amount),
      0
    );

    const totalPurchases = purchaseOrders.reduce(
      (sum, order) => sum + Number(order.total_amount),
      0
    );

    const lowStockCount = products.filter(
      (p) => p.current_stock < p.safety_stock
    ).length;

    const pendingOrders = salesOrders.filter(
      (o) => o.status === "pending"
    ).length;

    const fulfilledOrders = purchaseOrders.filter(
      (o) => o.status === "fulfilled"
    ).length;

    res.json({
      stats: {
        totalSales,
        totalPurchases,
        totalProducts: products.length,
        lowStockCount,
        pendingOrders,
        fulfilledOrders,
      },

      products,
      purchaseOrders,
      salesOrders,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};