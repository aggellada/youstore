import { CirclePlus, Loader, LoaderCircle, RotateCcw, Search, SquarePen, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import AddProductModal from "../components/AddProductModal";
import { useProductStore } from "../../store/useProductStore";
import { useCartStore } from "../../store/useCartStore";
import SearchProduct from "../components/SearchProduct";
import AllProducts from "../components/AllProducts";

function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [searchInput, setSearchInput] = useState({ name: "" });
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [isAddingToCardId, setIsAddingToCartId] = useState(null);

  const addProductRef = useRef(null);

  const {
    getAllProducts,
    products,
    isGettingProducts,
    deleteProduct,
    searchProduct,
    searchedProduct,
    resetSearchedProduct,
  } = useProductStore();

  const { addToCart } = useCartStore();

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  useEffect(() => {
    if (showModal) {
      addProductRef.current?.showModal();
    } else {
      addProductRef.current?.close();
    }
  }, [showModal]);

  const openAddProductModal = () => {
    setShowModal(true);
  };

  const closeAddProductModal = () => {
    setShowModal(false);
  };

  const submitSearch = (e) => {
    e.preventDefault();

    if (searchInput.name === "") return;
    searchProduct(searchInput);
  };

  const handleRefresh = () => {
    resetSearchedProduct();
    getAllProducts();
  };

  const handleDeleteBtn = (productId) => {
    deleteProduct(productId);
    setIsDeletingId(productId);
  };

  const handleAddToCartBtn = (productId) => {
    addToCart(productId);
    setIsAddingToCartId(productId);
  };

  if (isGettingProducts) {
    return (
      <div className="max-w-5xl min-h-screen mx-auto flex flex-col justify-center items-center">
        <Loader className="size-20 animate-spin transition" />
        <h1>Loading products. Please wait.</h1>
      </div>
    );
  }

  return (
    <div className="pt-20 lg:max-w-7xl md:max-w-2xl min-h-screen mx-auto">
      <AddProductModal ref={addProductRef} closeAddProductModal={closeAddProductModal} />
      <div className="px-4 md:px-0 gap-2 md:gap-0 flex-col md:flex-row flex justify-between md:items-center mb-6">
        <div className="flex justify-between items-center">
          <button className="btn w-40" onClick={openAddProductModal}>
            <CirclePlus />
            Add Product
          </button>
        </div>
        <div className="flex gap-12 items-center">
          <form className="flex gap-4 items-center" onSubmit={submitSearch}>
            <input
              onChange={(e) =>
                setSearchInput((prev) => {
                  return { ...prev, name: e.target.value };
                })
              }
              type="text"
              placeholder="Search a product"
              className="bg-base-200 py-1 px-3 rounded-md"
            />
            <button type="submit" className="btn">
              <Search />
            </button>
          </form>
          <RotateCcw className="size-5 hover:cursor-pointer " onClick={handleRefresh} />
        </div>
      </div>
      <div className="px-4 md:px-0 w-full grid gap-2 grid-cols-2 lg:grid-cols-4 md:grid-cols-3 md:gap-4 pb-8">
        {searchedProduct && (
          <SearchProduct
            searchedProduct={searchedProduct}
            isDeletingId={isDeletingId}
            isAddingToCardId={isAddingToCardId}
            handleDeleteBtn={handleDeleteBtn}
            handleAddToCartBtn={handleAddToCartBtn}
          />
        )}
        {!searchedProduct && products.success && (
          <AllProducts
            isDeletingId={isDeletingId}
            isAddingToCardId={isAddingToCardId}
            handleDeleteBtn={handleDeleteBtn}
            handleAddToCartBtn={handleAddToCartBtn}
          />
        )}
      </div>
    </div>
  );
}

export default HomePage;
