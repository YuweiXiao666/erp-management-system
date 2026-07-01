-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  safety_stock INTEGER NOT NULL DEFAULT 10,
  unit_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suppliers table
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase Orders table
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number TEXT UNIQUE NOT NULL,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'fulfilled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sales Orders table
CREATE TABLE sales_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  so_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'shipped')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -- Enable RLS
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sales_orders ENABLE ROW LEVEL SECURITY;

-- -- RLS Policies for products
-- CREATE POLICY "select_products" ON products FOR SELECT USING (true);
-- CREATE POLICY "insert_products" ON products FOR INSERT WITH CHECK (true);
-- CREATE POLICY "update_products" ON products FOR UPDATE USING (true) WITH CHECK (true);
-- CREATE POLICY "delete_products" ON products FOR DELETE USING (true);

-- -- RLS Policies for suppliers
-- CREATE POLICY "select_suppliers" ON suppliers FOR SELECT USING (true);
-- CREATE POLICY "insert_suppliers" ON suppliers FOR INSERT WITH CHECK (true);
-- CREATE POLICY "update_suppliers" ON suppliers FOR UPDATE USING (true) WITH CHECK (true);
-- CREATE POLICY "delete_suppliers" ON suppliers FOR DELETE USING (true);

-- -- RLS Policies for customers
-- CREATE POLICY "select_customers" ON customers FOR SELECT USING (true);
-- CREATE POLICY "insert_customers" ON customers FOR INSERT WITH CHECK (true);
-- CREATE POLICY "update_customers" ON customers FOR UPDATE USING (true) WITH CHECK (true);
-- CREATE POLICY "delete_customers" ON customers FOR DELETE USING (true);

-- -- RLS Policies for purchase_orders
-- CREATE POLICY "select_purchase_orders" ON purchase_orders FOR SELECT USING (true);
-- CREATE POLICY "insert_purchase_orders" ON purchase_orders FOR INSERT WITH CHECK (true);
-- CREATE POLICY "update_purchase_orders" ON purchase_orders FOR UPDATE USING (true) WITH CHECK (true);
-- CREATE POLICY "delete_purchase_orders" ON purchase_orders FOR DELETE USING (true);

-- -- RLS Policies for sales_orders
-- CREATE POLICY "select_sales_orders" ON sales_orders FOR SELECT USING (true);
-- CREATE POLICY "insert_sales_orders" ON sales_orders FOR INSERT WITH CHECK (true);
-- CREATE POLICY "update_sales_orders" ON sales_orders FOR UPDATE USING (true) WITH CHECK (true);
-- CREATE POLICY "delete_sales_orders" ON sales_orders FOR DELETE USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_orders_updated_at BEFORE UPDATE ON sales_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample suppliers
INSERT INTO suppliers (name, contact_person, phone, email) VALUES
('台灣電子材料行', '王大明', '02-12345678', 'wang@taiwan-elec.com'),
('鑫源五金批發', '李美玲', '03-98765432', 'lee@xinyuan.com'),
('環球文具配送', '張志豪', '04-55667788', 'chang@global-stationery.com');

-- Insert sample customers
INSERT INTO customers (name, phone, email, address) VALUES
('德昌貿易有限公司', '02-22334455', 'info@dechang.com', '台北市中山區民生東路一段'),
('優品生活百貨', '03-44556677', 'order@yp-life.com', '桃園市中壢區中北路二段'),
('線上零售商店', '04-88990011', 'sales@eretail.com.tw', '台中市西屯區台中港路三段');

-- Insert sample products
INSERT INTO products (product_code, name, category, current_stock, safety_stock, unit_price) VALUES
('EL-001', 'USB-C 充電線 1m', '電子配件', 150, 50, 89.00),
('EL-002', '藍牙無線耳機', '電子配件', 45, 30, 1290.00),
('EL-003', '行動電源 10000mAh', '電子配件', 80, 40, 599.00),
('SW-001', '不鏽鋼螺絲組 100pc', '五金工具', 500, 200, 120.00),
('SW-002', '電動螺絲起子', '五金工具', 25, 15, 890.00),
('ST-001', 'A4 筆記本 100頁', '文具用品', 300, 100, 35.00),
('ST-002', '中性筆 0.5mm 黑色', '文具用品', 1000, 300, 15.00),
('ST-003', '訂書機 辦公型', '文具用品', 60, 20, 180.00);