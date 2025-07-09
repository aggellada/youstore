import React, { useEffect, useRef, useState } from "react";
import { useCartStore } from "../../store/useCartStore";
import { CirclePlus, Loader, Loader2 } from "lucide-react";
import CheckoutModal from "../components/CheckoutModal";

function CartPage() {
  const {
    changingQtyId,
    getUserWithCartItems,
    addQuantity,
    subtractQuantity,
    cart,
    deleteToCart,
    isGettingUserCart,
    isDeletingCartItem,
    getRandomItems,
    randomItems,
    isAddingToCart,
    addToCart,
  } = useCartStore();

  const [deletingCartItemId, setDeletingCartItemId] = useState(null);
  const [isAddingToCartId, setIsAddingToCartId] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const checkoutModalRef = useRef(null);

  useEffect(() => {
    getUserWithCartItems();
    getRandomItems();
  }, []);

  useEffect(() => {
    if (showCheckoutModal) {
      checkoutModalRef.current?.showModal();
    } else {
      checkoutModalRef.current?.close();
    }
  }, [showCheckoutModal]);

  const openCheckoutModal = () => {
    setShowCheckoutModal(true);
  };

  const closeCheckoutModal = () => {
    setShowCheckoutModal(false);
  };

  const handleAddToCartBtn = (productId) => {
    addToCart(productId);
    setIsAddingToCartId(productId);
  };

  const deleteCartItem = (productId) => {
    setDeletingCartItemId(productId);
    deleteToCart(productId);
  };

  if (cart.length === 0 && isGettingUserCart) {
    return (
      <div className="max-w-5xl min-h-screen mx-auto flex flex-col justify-center items-center">
        <Loader className="size-20 animate-spin transition" />
        <h1>Loading cart. Please wait.</h1>
      </div>
    );
  }

  const totalPrice =
    cart.success &&
    cart.data.cart_items
      .reduce((acc, curr) => {
        return acc + curr.price * curr.quantity;
      }, 0)
      .toFixed(2);

  return (
    <>
      <CheckoutModal ref={checkoutModalRef} closeCheckoutModal={closeCheckoutModal} />
      <div className="md:pt-20 md:pb-12 w-full min-h-screen bg-base-100">
        <div className="container w-full h-full mx-auto flex gap-12 justify-center ">
          <div className="w-full md:w-4/5 lg:w-3/5 h-full bg-base-200 flex flex-col justify-between p-4 md:p-8">
            <div className="flex justify-between items-center pb-6 border-b-1 border-base-100">
              <h1 className="font-bold text-3xl">Your Cart</h1>
              <div className="flex md:gap-18 xl:gap-28 2xl:gap-36 pr-2">
                <h1 className="">Quantity</h1>
                <h1 className="hidden md:block">Subtotal</h1>
              </div>
            </div>
            {/* cart item */}
            <div className="text-sm lg:text-lg flex flex-col gap-2 pt-4">
              {cart.success &&
                cart.data.cart_items.map((item) => (
                  <div key={item.product_id} className="flex gap-4 w-full justify-between items-center ">
                    <div className="w-full md:w-2/4">
                      <div className="w-full flex gap-4 items-center">
                        <img src={item.image} alt={item.name} className="size-20 object-cover" />
                        <div className="w-full flex flex-col justify-between">
                          <h1 className="">{item.product_name}</h1>
                          <h1 className="">P{item.price}</h1>
                          <button
                            type="button"
                            className="w-[50px] md:w-[100px] btn"
                            onClick={() => deleteCartItem(item.product_id)}
                            disabled={isDeletingCartItem}
                          >
                            {deletingCartItemId === item.product_id ? "Deleting" : "Remove"}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex-col md:flex-row justify-end items-center ">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="size-5 p-4 md:size-10 btn bg-base-300"
                          onClick={() => subtractQuantity(item.product_id)}
                          disabled={changingQtyId === item.product_id}
                        >
                          -
                        </button>
                        <h1 className="">{item.quantity}</h1>
                        <button
                          type="button"
                          className="size-5 p-4 md:size-10 btn bg-base-300"
                          onClick={() => addQuantity(item.product_id)}
                          disabled={changingQtyId === item.product_id}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <h1 className="hidden md:block pr-3">₱{(item.quantity * item.price).toFixed(2)}</h1>
                  </div>
                ))}
            </div>
            <div className="lg:hidden flex flex-col gap-8 pt-6 border-t-1 border-base-100">
              <h1 className="font-bold text-3xl border-b-1 border-base-100 pb-6">Summary</h1>
              <div className="flex justify-between">
                <h1 className="">Total (excluding delivery): </h1>
                <h1 className="">P {totalPrice} </h1>
              </div>
              <div className="w-full mb-4">
                <button type="button" className="btn w-full bg-base-100" onClick={openCheckoutModal}>
                  Checkout
                </button>
              </div>
            </div>
          </div>
          {/* summary */}
          <div className="hidden lg:block w-2/5 h-fit bg-base-200 p-8 ">
            <h1 className="font-bold text-4xl border-b-2 border-base-100 pb-8">Summary</h1>
            <div className="flex justify-between pt-8 mb-8">
              <h1 className="">Total (excluding delivery):</h1>
              <h1 className="">₱{totalPrice}</h1>
            </div>
            <div className="w-full mb-4 border-b-1 border-base-100">
              <button type="button" className="btn w-full bg-base-100 mb-8" onClick={openCheckoutModal}>
                Checkout
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="">Recommended for you: </h1>
              <div className="flex gap-4">
                {randomItems.success &&
                  randomItems.data.map((randomItem) => (
                    <div className="relative" key={randomItem.id}>
                      <img src={randomItem.image} className="size-20 object-cover" alt={randomItem.name} />
                      <button
                        type="button"
                        className="text-black absolute right-0 bottom-0 hover:cursor-pointer"
                        onClick={() => handleAddToCartBtn(randomItem.id)}
                        disabled={isAddingToCart}
                      >
                        {isAddingToCart && isAddingToCartId === randomItem.id ? (
                          <Loader2 className="animate-spin " />
                        ) : (
                          <CirclePlus className="" />
                        )}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartPage;
