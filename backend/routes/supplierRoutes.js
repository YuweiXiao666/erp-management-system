import express from "express";
import { getSuppliers } from "../controllers/supplierController.js";

const router = express.Router();

router.get("/", getSuppliers);

export default router;