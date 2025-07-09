import React from "react";

function CheckoutModal({ ref, closeCheckoutModal }) {
  return (
    <dialog
      ref={ref}
      onClose={closeCheckoutModal}
      className="m-auto w-full max-w-2xl h-full max-h-[550px] p-8 rounded-3xl"
    >
      <h1 className="">Checkout Modal</h1>
    </dialog>
  );
}

export default CheckoutModal;
