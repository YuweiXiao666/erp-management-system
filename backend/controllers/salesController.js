import supabase from "../config/supabase.js";

export const getSales = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("sales_orders")
      .select("*, customers(name)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};


// 更新銷售單狀態
export const updateSalesStatus = async (req, res) => {
  try {
    // 取得訂單 id
    const { id } = req.params;

    // 取得新狀態
    const { status } = req.body;

    const { data, error } = await supabase
      .from("sales_orders")
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

// 建立銷售單
export const createSalesOrder = async (req, res) => {
  try {
    const {
      so_number,
      customer_id,
      product_id,
      product_name,
      quantity,
      unit_price,
      total_amount,
    } = req.body;

    const { data, error } = await supabase
      .from("sales_orders")
      .insert({
        so_number,
        customer_id,
        product_id,
        product_name,
        quantity,
        unit_price,
        total_amount,
        status: "pending",
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