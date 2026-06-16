import express from "express";
import { getCustomers } from "../controllers/customerController.js";

const router = express.Router();

// 查詢所有客戶
router.get("/", getCustomers);

export default router;