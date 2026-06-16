# ERP Management System

A full-stack ERP (Enterprise Resource Planning) system for managing inventory, sales, purchases, customers, suppliers, and dashboard analytics. Built with React, Node.js, Express, and Supabase.

---

## Features

### Inventory Management
- Real-time stock tracking
- Low stock alerts
- Stock adjustment system

### Sales Management
- Create and manage sales orders
- Order status updates (pending, shipped)
- Customer association

### Purchase Management
- Create and manage purchase orders
- Supplier tracking
- Order lifecycle (draft, sent, fulfilled)

### Dashboard Analytics
- Total sales and purchases
- Product statistics
- Order status overview
- Low stock monitoring

---

## Tech Stack

Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- Lucide React

Backend
- Node.js
- Express.js
- RESTful API architecture

Database
- Supabase (PostgreSQL)
- SQL migrations for schema management

---

## Project Structure

frontend/ - React frontend application  
backend/ - Express backend API server  
supabase/ - Database migrations and schema  

---

## Installation

### Backend
cd backend
npm install
npm run dev

### Frontend
cd frontend
npm install
npm run dev

---

## Environment Variables

### Backend (.env)

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
PORT=5000

---

## API Endpoints

GET /api/products  
GET /api/sales  
GET /api/purchases  
GET /api/customers  
GET /api/suppliers  
GET /api/dashboard  

---

## Purpose

This project demonstrates:
- Full-stack system design
- RESTful API development
- Database integration with Supabase
- ERP workflow simulation
- Frontend and backend separation

