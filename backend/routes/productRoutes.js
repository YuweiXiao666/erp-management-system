import express from "express";
import { getProducts, adjustStock } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.patch("/:id/stock", adjustStock);

export default router;
