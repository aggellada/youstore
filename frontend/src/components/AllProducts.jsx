import React from "react";
import { useProductStore } from "../../store/useProductStore";
import { Link } from "react-router-dom";
import { LoaderCircle, SquarePen, Trash2 } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useCartStore } from "../../store/useCartStore";

function AllProducts({ isDeletingId, handleDeleteBtn, handleAddToCartBtn, isAddingToCardId }) {
  const { products, isDeletingProduct } = useProductStore();
  const { authUser } = useAuthStore();
  const { isAddingToCart } = useCartStore();

  return (
    <>
      {products.success &&
        products.data.map((product) => (
          <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-base-200" key={product.id}>
            <img src={product.image} className="w-full h-50 rounded-t-2xl object-cover" alt={product.name} />
            <div className="flex flex-col justify-between gap-2 flex-grow p-4">
              <h1 className="md:font-medium">{product.name}</h1>
              <h1 className="md:text-2xl font-bold">P{product.price}</h1>
              <div className="flex justify-end gap-4 mb-6">
                <Link to={`/products/${product.id}`}>
                  <SquarePen className="hover:cursor-pointer" />
                </Link>
                {isDeletingId === product.id ? (
                  <LoaderCircle className="animate-spin transition" />
                ) : (
                  <button
                    className="hover:cursor-pointer"
                    disabled={isDeletingProduct}
                    onClick={() => handleDeleteBtn(product.id)}
                  >
                    <Trash2 />
                  </button>
                )}
              </div>
              <div className="flex w-full justify-end">
                {authUser ? (
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
                ) : (
                  <Link to="/login" className="btn bg-red-600 text-white">
                    Add to cart
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
    </>
  );
}

export default AllProducts;
