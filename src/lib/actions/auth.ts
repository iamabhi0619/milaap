// lib/actions/auth.ts
"use server"; // marks every export in this file as a Server Action :contentReference[oaicite:1]{index=1}

import { verifyJwt } from "@/lib/verifyJwt";

export async function verifyJwtAction(token: string) {
  // you can add audit logs, DB look-ups, etc. here
  return verifyJwt(token); // must return a JSON-serialisable object
}
