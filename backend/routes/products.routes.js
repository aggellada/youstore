import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  searchProduct,
  updateProduct,
} from "../controller/product.controller.js";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/create", createProduct);
router.post("/search", searchProduct);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
