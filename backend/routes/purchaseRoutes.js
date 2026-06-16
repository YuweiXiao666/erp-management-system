import express from "express";
import {
  getPurchases,
  updatePurchaseStatus,
  createPurchaseOrder,
} from "../controllers/purchaseController.js";

const router = express.Router();

// 取得所有採購單
router.get("/", getPurchases);

// 更新採購單狀態
router.patch("/:id/status", updatePurchaseStatus);

router.post("/", createPurchaseOrder);

export default router;
