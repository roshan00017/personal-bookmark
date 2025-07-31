import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;
  if (!token) return null;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
    };
    console.log("user", user.userId);
    return user;
  } catch (e) {
    return null;
  }
}
