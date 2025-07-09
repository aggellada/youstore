import { LoaderCircle, SquarePen, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../../store/useProductStore";

function SearchProduct({
  searchedProduct,
  isDeletingId,
  handleDeleteBtn,
  handleAddToCartBtn,
  isAddingToCardId,
}) {
  const { isDeletingProduct, isAddingToCart } = useProductStore();

  return (
    <>
      {searchedProduct.data.map((product) => (
        <div className="" key={product.id}>
          <img src={product.image} className="w-full size-50 rounded-t-2xl object-cover" alt={product.name} />
          <div className="flex flex-col gap-2 bg-base-200 p-4 rounded-b-2xl">
            <h1 className="font-medium">{product.name}</h1>
            <h1 className="text-2xl font-semibold md:font-bold">P{product.price}</h1>
            <div className="flex justify-end gap-4 mb-6">
              <Link to={`/products/${product.id}`}>
                <SquarePen className="hover:cursor-pointer" />
              </Link>
              <button
                className="hover:cursor-pointer"
                disabled={isDeletingProduct}
                onClick={() => handleDeleteBtn(product.id)}
              >
                {isDeletingId === product.id ? (
                  <LoaderCircle className="animate-spin transition" />
                ) : (
                  <Trash2 />
                )}
              </button>
            </div>
            <div className="flex w-full justify-end">
              <button
                className="btn bg-red-600 text-white"
                onClick={() => handleAddToCartBtn(product.id)}
                disabled={isAddingToCart}
              >
                {isAddingToCart && isAddingToCardId === product.id ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Add to cart"
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default SearchProduct;
