-- Fix the stock check function with unambiguous variable naming
CREATE OR REPLACE FUNCTION check_stock_before_sales_create()
RETURNS TRIGGER AS $$
DECLARE
  v_current_stock INTEGER;
BEGIN
  SELECT current_stock INTO v_current_stock 
  FROM products WHERE id = NEW.product_id;
  
  IF v_current_stock < NEW.quantity THEN
    RAISE EXCEPTION '庫存不足 / Insufficient Stock. Current: %, Requested: %', v_current_stock, NEW.quantity;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;