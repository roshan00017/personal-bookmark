import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

async function getUserIdFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    return decoded.userId;
  } catch {
    return null;
  }
}
export async function GET() {
  const userId = await getUserIdFromCookie();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(favorites);
}

export async function POST(req: Request) {
  const userId = await getUserIdFromCookie();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { platform, url, title, description } = await req.json();
  if (!platform || !url) {
    return NextResponse.json(
      { error: "Platform and URL required" },
      { status: 400 }
    );
  }

  const favorite = await prisma.favorite.create({
    data: {
      userId: userId,
      platform,
      url,
      title,
      description,
    },
  });

  return NextResponse.json(favorite);
}
