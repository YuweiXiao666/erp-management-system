import supabase from "../config/supabase.js";

// 取得所有客戶
export const getCustomers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("name");

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};