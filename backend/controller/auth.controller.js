import { sql } from "../lib/db.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be 6 characters or more" });
    }

    const userExists = await sql`
        SELECT * FROM users WHERE email=${email}
    `;

    const usernameExists = await sql`
      SELECT * FROM users WHERE username=${username}
    `;

    if (usernameExists !== 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (userExists.length !== 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await sql`
        INSERT INTO users (name, username, email, password)
        VALUES (${name}, ${username}, ${email}, ${hashedPassword})
        RETURNING *
    `;

    if (newUser.length === 0) {
      return res.status(400).json({ message: "Invalid user" });
    }

    generateToken(newUser[0].id, res);

    res.status(200).json({ success: true, data: newUser[0] });
  } catch (error) {
    console.log("Error in createUser controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!password || !email) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const user = await sql`
        SELECT * FROM users WHERE email=${email}
    `;

    if (user.length === 0) {
      return res.status(400).json({ message: "No user was found" });
    }

    const passwordIsCorrect = await bcrypt.compare(password, user[0].password);

    if (!passwordIsCorrect) {
      return res.status(500).json({ message: "Invalid Credentials" });
    }

    generateToken(user[0].id, res);

    res.status(200).json({ success: true, data: user[0] });
  } catch (error) {
    console.log("Error in loginUser controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logoutUser controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const authCheck = async (req, res) => {
  try {
    res.json(200).status({ success: true, data: req.user });
  } catch (error) {
    console.log("Error in logoutUser controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
