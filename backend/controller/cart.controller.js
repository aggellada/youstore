import { sql } from "../lib/db.js";

export const getUserWithCartItems = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch user
    const userResult = await sql`
      SELECT * FROM users WHERE id = ${userId}
    `;

    if (userResult.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch cart items + product info
    const cartItems = await sql`
      SELECT cart_items.*, products.name AS product_name, products.image, products.price
      FROM cart_items
      JOIN products ON cart_items.product_id=products.id
      WHERE cart_items.user_id=${userId}
      ORDER BY created_at
    `;

    // Combine
    const user = {
      ...userResult[0],
      cart_items: cartItems,
    };

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error in getUserWithCartItems", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRandomItems = async (req, res) => {
  try {
    const randomItems = await sql`
      SELECT * FROM products
      ORDER BY RANDOM() LIMIT 3
    `;

    if (randomItems.length === 0) {
      return res.status(400).json({ message: "Failed to get random items" });
    }

    res.status(200).json({ success: true, data: randomItems });
  } catch (error) {
    console.error("Error in getRandomItems", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addToCart = async (req, res) => {
  const { id: productId } = req.body;
  const userId = req.user?.id;

  try {
    if (!productId) {
      return res.status(400).json({ success: false, message: " Missing product ID" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const existingItem = await sql`
      SELECT * FROM cart_items
      WHERE user_id = ${userId} AND product_id = ${productId}
    `;

    let cartItem;

    if (existingItem.length > 0) {
      // If item exists, increase quantity by 1
      cartItem = await sql`
        UPDATE cart_items
        SET quantity=quantity + 1
        WHERE user_id=${userId} AND product_id=${productId}
        RETURNING *
      `;
    } else {
      // Else, add new item
      cartItem = await sql`
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (${userId}, ${productId}, 1)
        RETURNING *
      `;
    }

    res.status(200).json({ success: true, data: cartItem[0] });
  } catch (error) {
    console.log("Error in addToCart controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteToCart = async (req, res) => {
  const { id } = req.body;
  const userId = req.user.id;

  try {
    if (!id || !userId) {
      return res.status(400).json({ message: "Invalid" });
    }

    const cartItem = await sql`
        DELETE FROM cart_items WHERE user_id=${userId} AND product_id=${id}
        RETURNING *
    `;

    res.status(200).json({ success: true, data: cartItem[0] });
  } catch (error) {
    console.log("Error in deleteToCart controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addQuantity = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    if (!productId || !userId) {
      return res.status(400).json({ message: "Invalid" });
    }

    const cartItem = await sql`
        UPDATE cart_items
        SET quantity=quantity + 1
        WHERE user_id=${userId} AND product_id=${productId}
        RETURNING *
    `;

    res.status(200).json({ success: true, data: cartItem[0] });
  } catch (error) {
    console.log("Error in addQuantity controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const subtractQuantity = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    if (!productId || !userId) {
      return res.status(400).json({ message: "Invalid" });
    }

    // Check current quantity
    const [item] = await sql`
      SELECT quantity FROM cart_items
      WHERE user_id = ${userId} AND product_id = ${productId}
    `;

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (item.quantity <= 1) {
      // Optional: Delete the item if quantity hits 0
      await sql`
        DELETE FROM cart_items
        WHERE user_id = ${userId} AND product_id = ${productId}
      `;
      return res.status(200).json({ success: true, data: null, message: "Item removed from cart" });
    }

    const cartItem = await sql`
      UPDATE cart_items
      SET quantity = quantity - 1
      WHERE user_id = ${userId} AND product_id = ${productId}
      RETURNING *
    `;

    res.status(200).json({ success: true, data: cartItem[0] });
  } catch (error) {
    console.log("Error in subtractQuantity controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
