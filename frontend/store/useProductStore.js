import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../src/lib/axios";

export const useProductStore = create((set, get) => ({
  products: [],
  product: null,
  searchedProduct: null,
  isSearchingProduct: false,
  isGettingProducts: false,
  isGettingProduct: false,
  isCreatingProduct: false,
  isUpdatingProduct: false,
  isDeletingProduct: false,
  updateProductsFlag: false,

  getAllProducts: async () => {
    set({ isGettingProducts: true });
    try {
      const res = await axiosInstance.get("/api/products/");
      set({ products: res.data });
    } catch (error) {
      console.log("Error in getAllProducts store", error);
      toast.error("Failed to get all products");
    } finally {
      set({ isGettingProducts: false });
    }
  },

  getProduct: async (id) => {
    set({ isGettingProduct: true });
    try {
      const res = await axiosInstance.get(`/api/products/${id}`);
      set({ product: res.data });
    } catch (error) {
      console.log("Error in getProduct store", error);
      toast.error("Failed to get product");
    } finally {
      set({ isGettingProduct: false });
    }
  },

  createProduct: async (formData) => {
    set({ isCreatingProduct: true });
    try {
      await axiosInstance.post("/api/products/create", formData);
      await get().getAllProducts();
      toast.success("A new product was added");
      set({ updateProductsFlag: true });
    } catch (error) {
      console.log("Error in createProduct store", error);
      toast.error("Failed to create product");
    } finally {
      set({ isCreatingProduct: false });
    }
  },

  updateProduct: async (id, formData) => {
    set({ isUpdatingProduct: true });
    set({ updateProductsFlag: true });

    try {
      await axiosInstance.put(`/api/products/${id}`, formData);
      toast.success("Product was updated successfully");
    } catch (error) {
      console.log("Error in updateProduct store", error);
      toast.error("Failed to update product");
    } finally {
      set({ isUpdatingProduct: false });
    }
  },

  deleteProduct: async (id) => {
    if (get().isDeletingProduct) return;

    try {
      set({ isDeletingProduct: true });
      await axiosInstance.delete(`/api/products/${id}`);
      await get().getAllProducts();
      if (get().searchedProduct) set({ searchedProduct: null });
      toast.success("Deleted product successfully");
    } catch (error) {
      console.log("Error in deleteProduct store", error);
      toast.error("Failed to delete product");
    } finally {
      set({ isDeletingProduct: false });
    }
  },

  searchProduct: async (formData) => {
    set({ isSearchingProduct: true });

    try {
      const res = await axiosInstance.post("/api/products/search", formData);
      set({ searchedProduct: res.data });
      toast.success("Successfully searched a product");
    } catch (error) {
      console.log("Error in searchProduct store", error);
      toast.error("Failed to search product");
    } finally {
      set({ isSearchingProduct: false });
    }
  },

  resetUpdateProductsFlag: () => set({ updateProductsFlag: false }),
  resetSearchedProduct: () => set({ searchedProduct: null }),
}));
