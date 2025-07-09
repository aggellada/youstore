import { sql } from "../lib/db.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await sql`
        SELECT * FROM products
        ORDER BY created_at DESC
    `;

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, image, file } = req.body;

  try {
    if (!name || !price || !(image || file)) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let cloudinaryURL;
    let cloudinaryPublicId = "";
    if (file) {
      const res = await cloudinary.uploader.upload(file);
      cloudinaryPublicId = res.public_id;
      cloudinaryURL = res.secure_url;
    }

    const newProduct = await sql`
        INSERT INTO products (name, price, image, cloudinarypublicid)
        VALUES (${name}, ${price}, ${image || cloudinaryURL}, ${cloudinaryPublicId})
        RETURNING *
    `;

    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    console.log("Error in createProduct controller", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await sql`
        SELECT * FROM products WHERE id=${id}
    `;

    if (product.length === 0) {
      res.status(400).json({ message: "No product found" });
    }

    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.log("Error in getProduct controller", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, image, file } = req.body;

  try {
    const product = await sql`
      SELECT * FROM products WHERE id=${id}
    `;

    let cloudinaryURL;
    if (!image && file) {
      const res = await cloudinary.uploader.upload(file, {
        public_id: product[0].cloudinarypublicid,
        invalidate: true,
      });

      cloudinaryURL = res.secure_url;
    }

    const updatedProduct = await sql`
        UPDATE products
        SET name=${name}, price=${price}, image=${image || cloudinaryURL}
        WHERE id=${id}
        RETURNING *
    `;

    if (updatedProduct.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(201).json({ success: true, data: updatedProduct[0] });
  } catch (error) {
    console.log("Error in updateProduct controller", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await sql`
        SELECT * FROM products WHERE id=${id}
    `;

    await cloudinary.uploader.destroy(product[0].cloudinarypublicid);

    const deletedProduct = await sql`
    DELETE FROM products WHERE id=${id}
    RETURNING *
    `;

    if (deletedProduct.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: deletedProduct[0] });
  } catch (error) {
    console.log("Error in deleteProduct controller", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const searchProduct = async (req, res) => {
  const { name } = req.body;

  try {
    const products = await sql`
      SELECT * FROM products WHERE name ILIKE ${"%" + name + "%"}
    `;

    if (products.length === 0) {
      return res.status(400).json({ success: false, message: "No product found" });
    }

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error in searchProduct controller", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
