import { CirclePlus, LoaderCircle, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useProductStore } from "../../store/useProductStore";

function AddProductModal({ ref, closeAddProductModal }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    file: "",
  });
  const [selectedImg, setSelectedImg] = useState("");

  const { createProduct, isCreatingProduct, updateProductsFlag, resetUpdateProductsFlag } = useProductStore();

  useEffect(() => {
    if (updateProductsFlag) {
      closeAddProductModal();
      resetUpdateProductsFlag();
    }
  }, [updateProductsFlag]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      setFormData((prev) => {
        return { ...prev, file: base64Image };
      });
    };
  };

  const closeModal = () => {
    setFormData({ name: "", price: "", image: "", file: "" });
    closeAddProductModal();
  };

  const submitForm = (e) => {
    e.preventDefault();
    createProduct(formData);
  };

  return (
    <dialog
      onClose={closeModal}
      className="m-auto bg-base-300 max-w-2xl max-h-[550px] rounded-xl h-full w-full backdrop:bg-[rgba(0,0,0,0.7)] "
      ref={ref}
    >
      <div className="container w-full px-8 py-4">
        <div className="flex justify-end">
          <X onClick={closeModal} className="hover:cursor-pointer" />
        </div>
        <h1 className="mb-12 font-bold text-2xl">Add New Product</h1>
        <form className="flex flex-col gap-2" onSubmit={submitForm}>
          <label className="">Product Name</label>
          <input
            type="text"
            className="bg-base-100 py-3 px-4 rounded-3xl w-full mb-4"
            placeholder="Enter a product name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => {
                return { ...prev, name: e.target.value };
              })
            }
          />
          <label className="">Price</label>
          <input
            type="text"
            className="bg-base-100 py-3 px-4 rounded-3xl w-full mb-4"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) =>
              setFormData((prev) => {
                return { ...prev, price: e.target.value };
              })
            }
          />
          <div className="flex gap-4 items-center">
            <label className="">Image URL</label>
            <div className="flex gap-4 items-center">
              <span>or</span>
              <label className="btn">
                Upload an image
                <input type="file" hidden onChange={(e) => handleFileChange(e)} />
              </label>
            </div>
          </div>
          <input
            type="text"
            className="bg-base-100 py-3 px-4 rounded-3xl w-full mb-6"
            placeholder="https://example.com/image.jpg"
            value={formData.image}
            onChange={(e) =>
              setFormData((prev) => {
                return { ...prev, image: e.target.value };
              })
            }
          />

          <div className="w-full flex items-center justify-between ">
            <div className="flex justify-center items-center border-1 border-white size-15">
              {selectedImg ? (
                <img src={selectedImg} alt="Image preview" />
              ) : (
                <h1 className="text-center text-xs">Image Preview</h1>
              )}
            </div>
            <div className="flex gap-4">
              <button onClick={closeModal} type="button">
                Cancel
              </button>
              {isCreatingProduct ? (
                <LoaderCircle className="animate-spin transition" />
              ) : (
                <button className="btn" type="submit">
                  <CirclePlus />
                  Add Product
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default AddProductModal;
