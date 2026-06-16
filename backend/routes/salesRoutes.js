import express from "express";
import {
  getSales,
  updateSalesStatus,
  createSalesOrder,
} from "../controllers/salesController.js";

const router = express.Router();

// 查詢所有銷售單
router.get("/", getSales);

// 更新銷售單狀態
router.patch("/:id/status", updateSalesStatus);

router.post("/", createSalesOrder);

export default router;
