-- Update suppliers to English
UPDATE suppliers SET 
  name = 'TechElectronics Supply Co.',
  contact_person = 'John Wang',
  email = 'john@techelectronics.com'
WHERE name = '台灣電子材料行';

UPDATE suppliers SET 
  name = 'Premier Hardware Wholesale',
  contact_person = 'Sarah Lee',
  email = 'sarah@premierhardware.com'
WHERE name = '鑫源五金批發';

UPDATE suppliers SET 
  name = 'Global Stationery Distributors',
  contact_person = 'Mike Chen',
  email = 'mike@globalstationery.com'
WHERE name = '環球文具配送';

-- Update customers to English
UPDATE customers SET 
  name = 'DeChang Trading Ltd.',
  address = '123 Commerce Street, Taipei City'
WHERE name = '德昌貿易有限公司';

UPDATE customers SET 
  name = 'Prime Life Department Store',
  address = '456 Retail Avenue, Taoyuan City'
WHERE name = '優品生活百貨';

UPDATE customers SET 
  name = 'E-Retail Solutions Inc.',
  address = '789 Digital Road, Taichung City'
WHERE name = '線上零售商店';

-- Update products to English
UPDATE products SET 
  name = 'USB-C Charging Cable 1m',
  category = 'Electronics'
WHERE product_code = 'EL-001';

UPDATE products SET 
  name = 'Bluetooth Wireless Earbuds',
  category = 'Electronics'
WHERE product_code = 'EL-002';

UPDATE products SET 
  name = 'Power Bank 10000mAh',
  category = 'Electronics'
WHERE product_code = 'EL-003';

UPDATE products SET 
  name = 'Stainless Steel Screw Set 100pc',
  category = 'Hardware'
WHERE product_code = 'SW-001';

UPDATE products SET 
  name = 'Electric Screwdriver Pro',
  category = 'Hardware'
WHERE product_code = 'SW-002';

UPDATE products SET 
  name = 'A4 Notebook 100 Pages',
  category = 'Stationery'
WHERE product_code = 'ST-001';

UPDATE products SET 
  name = 'Gel Pen 0.5mm Black',
  category = 'Stationery'
WHERE product_code = 'ST-002';

UPDATE products SET 
  name = 'Office Stapler Heavy-Duty',
  category = 'Stationery'
WHERE product_code = 'ST-003';

-- Update purchase orders product names to match
UPDATE purchase_orders SET product_name = 'USB-C Charging Cable 1m' WHERE product_name LIKE '%USB-C%';
UPDATE purchase_orders SET product_name = 'Bluetooth Wireless Earbuds' WHERE product_name LIKE '%藍牙%' OR product_name LIKE '%Earbuds%';
UPDATE purchase_orders SET product_name = 'Stainless Steel Screw Set 100pc' WHERE product_name LIKE '%螺絲%' OR product_name LIKE '%Screw%';

-- Update sales orders product names to match
UPDATE sales_orders SET product_name = 'USB-C Charging Cable 1m' WHERE product_name LIKE '%USB-C%' OR product_name LIKE '%充電線%';
UPDATE sales_orders SET product_name = 'Bluetooth Wireless Earbuds' WHERE product_name LIKE '%藍牙%' OR product_name LIKE '%耳機%';
UPDATE sales_orders SET product_name = 'A4 Notebook 100 Pages' WHERE product_name LIKE '%筆記本%' OR product_name LIKE '%Notebook%';