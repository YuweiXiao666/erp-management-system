import supabase from "../config/supabase.js";

// 取得所有供應商
export const getSuppliers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("suppliers")
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