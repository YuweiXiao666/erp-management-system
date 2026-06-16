export interface Product {
  id: string;
  product_code: string;
  name: string;
  category: string;
  current_stock: number;
  safety_stock: number;
  unit_price: number;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  created_at: string;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_id: string | null;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'fulfilled';
  created_at: string;
  updated_at: string;
  suppliers?: Supplier;
}

export interface SalesOrder {
  id: string;
  so_number: string;
  customer_id: string | null;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  status: 'pending' | 'shipped';
  created_at: string;
  updated_at: string;
  customers?: Customer;
}

export type PurchaseOrderStatus = 'draft' | 'sent' | 'fulfilled';
export type SalesOrderStatus = 'pending' | 'shipped';
