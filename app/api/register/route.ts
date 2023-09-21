import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const schema = z.object({
  email: z.string().email({ message: "请输入正确格式的邮箱地址" }),
  password: z
    .string()
    .min(5, { message: "密码最小长度为6个字符" })
    .max(16, { message: "密码最大长度为16个字符" }),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const prisma = new PrismaClient();
  await prisma.$connect();

  const validation = schema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, {
      status: 400,
    });

  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (user)
    return NextResponse.json({ error: "User already exists" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const newUser = await prisma.user.create({
    data: {
      email: body.email,
      hashedPassword,
    },
  });

  await prisma.$disconnect();

  return NextResponse.json({ email: body.email });
}
