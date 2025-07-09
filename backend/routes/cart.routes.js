import express from "express";
import {
  addQuantity,
  addToCart,
  deleteToCart,
  getRandomItems,
  getUserWithCartItems,
  subtractQuantity,
} from "../controller/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getUserWithCartItems);
router.get("/random", protectRoute, getRandomItems);
router.post("/add", protectRoute, addToCart);
router.delete("/delete", protectRoute, deleteToCart);
router.put("/increase", protectRoute, addQuantity);
router.put("/decrease", protectRoute, subtractQuantity);

export default router;
