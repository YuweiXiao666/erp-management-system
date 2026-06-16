import supabase from "../config/supabase.js";

// 取得所有採購單
export const getPurchases = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("purchase_orders")
      .select("*, suppliers(name)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// 更新採購單狀態
export const updatePurchaseStatus = async (req, res) => {
  try {
    // URL 參數中的訂單 id
    const { id } = req.params;

    // Request Body 中的新狀態
    const { status } = req.body;

    const { data, error } = await supabase
      .from("purchase_orders")
      .update({ status })
      .eq("id", id)
      .select();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// 建立採購單
export const createPurchaseOrder = async (req, res) => {
  try {
    const {
      po_number,
      supplier_id,
      product_id,
      product_name,
      quantity,
      unit_price,
      total_amount,
    } = req.body;

    const { data, error } = await supabase
      .from("purchase_orders")
      .insert({
        po_number,
        supplier_id,
        product_id,
        product_name,
        quantity,
        unit_price,
        total_amount,
        status: "draft",
      })
      .select();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
