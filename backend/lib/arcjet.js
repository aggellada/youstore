import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import { config } from "dotenv";

config();

// init arcjet

export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    // shield protects your application from common attacks e.g. SQL injection, XSS, CSRF attacks
    shield({ mode: "LIVE" }),
    // block all bots except search engines, see the full list at arcjet.com/bot-list
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "POSTMAN"],
    }),
    // rate limiting
    tokenBucket({
      mode: "LIVE",
      refillRate: 30,
      interval: 5,
      capacity: 20,
    }),
  ],
});
