import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "auth_token",
    value: "",
    maxAge: 0,
    path: "/",
  });
  return NextResponse.json({ success: true });
}
