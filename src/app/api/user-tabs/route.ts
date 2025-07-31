import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust import to your prisma client
import { getCurrentUser } from "@/lib/auth"; // adjust to your auth config

export async function GET(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session?.userId) return NextResponse.json([], { status: 401 });

  const tabs = await prisma.userTab.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(tabs);
}

export async function POST(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session?.userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { key, label } = await req.json();
  if (!key || !label) {
    return NextResponse.json(
      { error: "Key and label required" },
      { status: 400 }
    );
  }

  // Limit to 5 custom tabs per user
  const count = await prisma.userTab.count({
    where: { userId: session.userId },
  });
  if (count >= 5) {
    return NextResponse.json(
      { error: "Maximum 5 custom tabs allowed" },
      { status: 400 }
    );
  }

  // Prevent duplicate keys
  const exists = await prisma.userTab.findFirst({
    where: { userId: session.userId, key },
  });
  if (exists) {
    return NextResponse.json({ error: "Tab already exists" }, { status: 400 });
  }

  const tab = await prisma.userTab.create({
    data: { userId: session.userId, key, label },
  });
  return NextResponse.json(tab);
}
