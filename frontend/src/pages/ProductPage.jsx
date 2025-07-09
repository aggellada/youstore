import React, { useEffect, useRef, useState } from "react";
import { useProductStore } from "../../store/useProductStore";
import { Loader, Loader2, LoaderCircle, MoveLeft, Save, X } from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

function ProductPage() {
  const { id } = useParams();
  const [selectedImg, setSelectedImg] = useState(null);

  const nameRef = useRef();
  const priceRef = useRef();
  const imageRef = useRef();

  const navigate = useNavigate();

  const {
    product,
    isGettingProduct,
    isUpdatingProduct,
    updateProduct,
    getProduct,
    deleteProduct,
    isDeletingProduct,
  } = useProductStore();

  useEffect(() => {
    if (id) {
      getProduct(id);
    }
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
    };
  };

  const submitEditedForm = (e) => {
    e.preventDefault();

    const formData = {
      name: nameRef.current?.value,
      price: priceRef.current?.value,
      image: selectedImg ? "" : imageRef.current?.value,
      file: selectedImg ? selectedImg : "",
    };

    updateProduct(product.data.id, formData);
  };

  const handleDeleteBtn = async (id) => {
    await deleteProduct(id);
    navigate("/");
  };

  if (isGettingProduct || !product) {
    return (
      <div className="max-w-5xl min-h-screen mx-auto flex flex-col justify-center items-center">
        <Loader className="size-20 animate-spin transition" />
        <h1>Loading product details. Please wait.</h1>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center">
      <div className="w-full max-w-4xl py-10 mx-auto flex items-center">
        <Link to="/" className="w-full flex items-center gap-2 ">
          <MoveLeft />
          <h1 className="">Back to products</h1>
        </Link>
      </div>
      <div className="container mx-auto max-w-4xl w-full h-7/12  flex gap-4">
        <div className="w-full h-full ">
          <img
            src={selectedImg || product.data.image}
            className="object-cover w-full h-full"
            alt={product.data.name}
          />
        </div>
        <div className="w-full h-full bg-base-300 rounded-2xl px-8">
          <h1 className="py-6">Edit Product</h1>
          <form className="flex flex-col gap-2" onSubmit={submitEditedForm}>
            <label>Product Name</label>
            <input
              ref={nameRef}
              type="text"
              defaultValue={product.data.name}
              className="bg-base-100 py-3 px-4 rounded-3xl w-full mb-6"
            />
            <label>Price</label>
            <input
              type="text"
              ref={priceRef}
              className="bg-base-100 py-3 px-4 rounded-3xl w-full mb-6"
              defaultValue={product.data.price}
            />
            <div className="flex gap-4 items-center">
              <label className="">Image URL</label>
              <div className="flex gap-4 items-center">
                <span>or</span>
                <label className="btn">
                  Upload an image
                  <input type="file" onChange={(e) => handleFileChange(e)} hidden />
                </label>
              </div>
            </div>
            <input
              type="text"
              ref={imageRef}
              className="bg-base-100 py-3 px-4 rounded-3xl w-full mb-20"
              defaultValue={product.data.image}
              placeholder="https://example.com/image.jpg"
            />
            <div className="flex w-full justify-center gap-4">
              <button type="button" className="btn bg-red-700 text-white" onClick={() => handleDeleteBtn(id)}>
                <X />
                {isDeletingProduct ? <Loader2 className="animate-spin" /> : "Delete Product"}
              </button>
              {isUpdatingProduct ? (
                <button className="btn" disabled>
                  <LoaderCircle className="animate-spin transition" />
                  Saving
                </button>
              ) : (
                <button className="btn" type="submit">
                  <Save />
                  Save Changes
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
