// lib/verifyJwt.ts
import "server-only";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  sub: string;
  email?: string;
  role?: string;
  _id: string;
  [key: string]: unknown;
}

export function verifyJwt(token?: string): JwtPayload {
  if (!token) throw new Error("No token provided");
  return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
}
