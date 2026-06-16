import supabase from "../config/supabase.js";

export const getProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name");

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// 調整庫存
export const adjustStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { adjustment } = req.body;

    const { data: product, error: findError } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (findError) throw findError;

    const newStock = Math.max(
      0,
      product.current_stock + adjustment
    );

    const { data, error } = await supabase
      .from("products")
      .update({
        current_stock: newStock,
      })
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