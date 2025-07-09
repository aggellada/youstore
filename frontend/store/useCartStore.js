import { create } from "zustand";
import { axiosInstance } from "../src/lib/axios.js";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  randomItems: [],
  updateCartFlag: false,
  isGettingUserCart: false,
  isAddingToCart: false,
  isChangingQuantity: false,
  isDeletingCartItem: false,
  isGettingRandomItems: false,
  changingQtyId: null,

  getUserWithCartItems: async () => {
    if (get().isGettingUserCart) return;

    try {
      set({ isGettingUserCart: true });
      const res = await axiosInstance.get("/api/cart");
      set({ cart: res.data });
    } catch (error) {
      console.log("Error in getAllItems store", error);
      toast.error("Failed to get user cart items");
    } finally {
      set({ isGettingUserCart: false });
    }
  },

  addToCart: async (productId) => {
    if (get().isAddingToCart) return;

    const id = { id: productId };

    try {
      set({ isAddingToCart: true });
      await axiosInstance.post("/api/cart/add", id);
      await get().getUserWithCartItems();
      toast.success("Product was added to cart");
    } catch (error) {
      console.log("Error in addToCart store", error);
      toast.error(`${error.response.data.message}`);
    } finally {
      set({ isAddingToCart: false });
    }
  },

  deleteToCart: async (productId) => {
    if (get().isDeletingCartItem) return;

    try {
      set({ isDeletingCartItem: true });
      await axiosInstance.delete("/api/cart/delete", {
        data: { id: productId },
        withCredentials: true,
      });
      await get().getUserWithCartItems();
      toast.success("Product was removed from cart");
    } catch (error) {
      console.log("Error in deleteToCart store", error);
      toast.error("Failed to delete to cart");
    } finally {
      set({ isDeletingCartItem: false });
    }
  },

  addQuantity: async (productId) => {
    if (get().isChangingQuantity) return;

    const product_Id = { productId };
    set({ changingQtyId: productId });

    try {
      set({ isChangingQuantity: true });
      await axiosInstance.put("/api/cart/increase", product_Id);
      await get().getUserWithCartItems();
      toast.success("Product quantity was added to cart");
    } catch (error) {
      console.log("Error in addQuantity store", error);
      toast.error("Failed to add product quantity to cart");
    } finally {
      set({ isChangingQuantity: false });
      set({ changingQtyId: null });
    }
  },

  subtractQuantity: async (productId) => {
    if (get().isChangingQuantity) return;

    const product_Id = { productId };
    set({ changingQtyId: productId });

    try {
      set({ isChangingQuantity: true });
      await axiosInstance.put("/api/cart/decrease", product_Id);
      await get().getUserWithCartItems();
      toast.success("Product quantity was subtracted to cart");
    } catch (error) {
      console.log("Error in subtractQuantity store", error);
      toast.error("Failed to subtract product quantity to cart");
    } finally {
      set({ isChangingQuantity: false });
      set({ changingQtyId: null });
    }
  },

  getRandomItems: async () => {
    set({ isGettingRandomItems: true });
    try {
      const res = await axiosInstance.get("/api/cart/random");
      set({ randomItems: res.data });
    } catch (error) {
      console.log("Error in getRandomItems store", error);
      toast.error("Failed to get random items for cart");
    } finally {
      set({ isGettingRandomItems: false });
    }
  },
}));
