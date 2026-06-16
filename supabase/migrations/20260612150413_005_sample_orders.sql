-- Insert sample purchase orders
INSERT INTO purchase_orders (po_number, supplier_id, product_id, product_name, quantity, unit_price, total_amount, status) 
SELECT 'PO-2024-001', s.id, p.id, p.name, 100, 50.00, 5000.00, 'draft'
FROM suppliers s, products p 
WHERE s.name = '台灣電子材料行' AND p.product_code = 'EL-001' LIMIT 1;

INSERT INTO purchase_orders (po_number, supplier_id, product_id, product_name, quantity, unit_price, total_amount, status) 
SELECT 'PO-2024-002', s.id, p.id, p.name, 50, 700.00, 35000.00, 'sent'
FROM suppliers s, products p 
WHERE s.name = '台灣電子材料行' AND p.product_code = 'EL-002' LIMIT 1;

INSERT INTO purchase_orders (po_number, supplier_id, product_id, product_name, quantity, unit_price, total_amount, status) 
SELECT 'PO-2024-003', s.id, p.id, p.name, 200, 80.00, 16000.00, 'fulfilled'
FROM suppliers s, products p 
WHERE s.name = '鑫源五金批發' AND p.product_code = 'SW-001' LIMIT 1;

-- Insert sample sales orders
INSERT INTO sales_orders (so_number, customer_id, product_id, product_name, quantity, unit_price, total_amount, status) 
SELECT 'SO-2024-001', c.id, p.id, p.name, 10, 89.00, 890.00, 'pending'
FROM customers c, products p 
WHERE c.name = '德昌貿易有限公司' AND p.product_code = 'EL-001' LIMIT 1;

INSERT INTO sales_orders (so_number, customer_id, product_id, product_name, quantity, unit_price, total_amount, status) 
SELECT 'SO-2024-002', c.id, p.id, p.name, 5, 1290.00, 6450.00, 'shipped'
FROM customers c, products p 
WHERE c.name = '優品生活百貨' AND p.product_code = 'EL-002' LIMIT 1;

INSERT INTO sales_orders (so_number, customer_id, product_id, product_name, quantity, unit_price, total_amount, status) 
SELECT 'SO-2024-003', c.id, p.id, p.name, 50, 35.00, 1750.00, 'pending'
FROM customers c, products p 
WHERE c.name = '線上零售商店' AND p.product_code = 'ST-001' LIMIT 1;