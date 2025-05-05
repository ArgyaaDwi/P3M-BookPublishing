import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { password_lama, password_baru, konfirmasi_password_baru } = body;

  if (password_baru !== konfirmasi_password_baru) {
    return NextResponse.json(
      { error: "Konfirmasi password tidak cocok" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(session.user_id) },
  });
  if (!user)
    return NextResponse.json(
      { error: "User tidak ditemukan" },
      { status: 404 }
    );

  const isMatch = await bcrypt.compare(password_lama, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: "Password lama salah" }, { status: 401 });
  }

  const hashedNewPassword = await bcrypt.hash(password_baru, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedNewPassword },
  });

  return NextResponse.json({ message: "Password berhasil diubah" });
}
