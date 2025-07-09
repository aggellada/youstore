import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { sql } from "../lib/db.js";

config();

export const protectRoute = async (req, res, next) => {
  const token = req.cookies.jwt;

  try {
    if (!token) {
      return res.status(400).json({ message: "No token. Please log in" });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_KEY_SECRET);

    console.log(decoded);

    if (!decoded) {
      return res.status(400).json({ message: "Unauthorized user: Invalid token" });
    }

    // todo: deselect the password here
    const user = await sql`
        SELECT * FROM users where id=${decoded.id}
    `;

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user[0];

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
