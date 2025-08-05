import express from "express";
import {
  getProductById,
  updateProduct,
} from "../controllers/product-controller";

const router = express.Router();

router.get("/:id", getProductById);
router.put("/:id", updateProduct);

export default router;
