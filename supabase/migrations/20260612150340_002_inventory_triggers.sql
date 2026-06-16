-- Function to handle purchase order fulfillment (increase stock)
CREATE OR REPLACE FUNCTION handle_purchase_order_fulfillment()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger when status changes to 'fulfilled'
  IF NEW.status = 'fulfilled' AND (OLD.status IS NULL OR OLD.status != 'fulfilled') THEN
    -- Update product stock
    UPDATE products 
    SET current_stock = current_stock + NEW.quantity 
    WHERE id = NEW.product_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for purchase order fulfillment
CREATE TRIGGER trigger_purchase_order_fulfillment
AFTER UPDATE ON purchase_orders
FOR EACH ROW EXECUTE FUNCTION handle_purchase_order_fulfillment();

-- Function to check stock before sales order creation
CREATE OR REPLACE FUNCTION check_stock_before_sales_create()
RETURNS TRIGGER AS $$
DECLARE
  current_stock INTEGER;
BEGIN
  -- Get current stock
  SELECT current_stock INTO current_stock 
  FROM products WHERE id = NEW.product_id;
  
  -- Check if sufficient stock
  IF current_stock < NEW.quantity THEN
    RAISE EXCEPTION '庫存不足 / Insufficient Stock. Current: %, Requested: %', current_stock, NEW.quantity;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for sales order stock check
CREATE TRIGGER trigger_check_stock_before_sales
BEFORE INSERT ON sales_orders
FOR EACH ROW EXECUTE FUNCTION check_stock_before_sales_create();

-- Function to handle sales order shipment (decrease stock)
CREATE OR REPLACE FUNCTION handle_sales_order_shipment()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger when status changes to 'shipped'
  IF NEW.status = 'shipped' AND (OLD.status IS NULL OR OLD.status != 'shipped') THEN
    -- Update product stock
    UPDATE products 
    SET current_stock = current_stock - NEW.quantity 
    WHERE id = NEW.product_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for sales order shipment
CREATE TRIGGER trigger_sales_order_shipment
AFTER UPDATE ON sales_orders
FOR EACH ROW EXECUTE FUNCTION handle_sales_order_shipment();