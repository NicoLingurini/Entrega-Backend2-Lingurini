import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES, COOKIE_NAME } from "../config/env.js";

export const signToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

export const jwtExtractor = (req) => {
  let token = null;
  if (req?.cookies?.[COOKIE_NAME]) token = req.cookies[COOKIE_NAME];
  const authHeader = req.headers["authorization"];
  if (!token && authHeader?.startsWith("Bearer "))
    token = authHeader.substring(7);
  return token;
};
