import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

export const generateToken = async (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.TOKEN_KEY_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
