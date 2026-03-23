import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET = process.env.JWT_SECRET!;

export function signToken(payload: { id: number; username: string }) {
  return jwt.sign(payload, SECRET, { expiresIn: '8h' });
}

export function verifyToken(token: string): { id: number; username: string } | null {
  try {
    return jwt.verify(token, SECRET) as { id: number; username: string };
  } catch (err) {
    console.error("JWT ERROR:", err);
    return null;
  }
}

export function getSession() {
  try {
    const cookieStore = cookies(); 

    const token = cookieStore.get('gbkp_token')?.value;

    console.log("TOKEN:", token); 

    if (!token) return null;

    const user = verifyToken(token);

    console.log("USER SESSION:", user); 

    return user;
  } catch (error) {
    console.error("GET SESSION ERROR:", error);
    return null;
  }
}