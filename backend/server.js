import express from "express";
import { config } from "dotenv";
import { initDB } from "./lib/db.js";

import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { aj } from "./lib/arcjet.js";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import cookieParser from "cookie-parser";
import path from "path";

config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" })); // parse json data out of req.body
app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
); // helmet is a security middleware that helps you protect your application by setting various HTTP headers
app.use(morgan("dev")); // log the requests
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // allow cookies to be sent
  })
);

app.use(async (req, res, next) => {
  try {
    const decision = aj.protect(req, {
      requested: 1, //specifies that each request consumes 1 token
    });

    if ((await decision).isDenied()) {
      if ((await decision).reason.isRateLimit()) {
        res.status(429).json({ error: "Too many requests" });
      } else if ((await decision).reason.isBot()) {
        res.status(403).json({ error: "Bot access denied" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }

    // check for spoofed bots
    if ((await decision).results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
      res.status(403).json({ error: "Spoofed bot detected" });
      return;
    }

    next();
  } catch (error) {
    console.log("Arcjet error", error);
    next(error);
  }
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server running at port: ", PORT);
  });
});
