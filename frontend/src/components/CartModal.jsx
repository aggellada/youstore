import React from "react";

function CartModal({ ref, closeModal }) {
  return (
    <dialog
      ref={ref}
      onClose={closeModal}
      className="m-auto bg-red max-w-3xl w-full h-[70vh] backdrop:bg-[rgba(0,0,0,0.7)] bg-base-200 border-black"
    >
      <div className="w-full h-full p-12">
        <div className="w-full h-full bg-blue-500">
          <h1 className="">Your Cart</h1>
        </div>
      </div>
    </dialog>
  );
}

export default CartModal;
