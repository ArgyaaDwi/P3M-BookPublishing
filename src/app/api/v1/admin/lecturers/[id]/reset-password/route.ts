// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import bcrypt from "bcryptjs";

// export async function POST(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const lecturerId = Number(params.id);
//   try {
//     const newPassword = "123456";
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     await prisma.user.update({
//       where: { id: lecturerId },
//       data: { password: hashedPassword },
//     });

//     return NextResponse.json({
//       status: "success",
//       message: "Password berhasil direset.",
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { status: "error", message: "Gagal mereset password." },
//       { status: 500 }
//     );
//   }
// }
// pages/api/v1/admin/lecturers/[id]/reset-password.ts (atau pakai App Router)
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const lecturerId = parseInt(id);

  try {
    const hashed = await bcrypt.hash("123456", 10);
    await prisma.user.update({
      where: { id: lecturerId },
      data: {
        password: hashed,
      },
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Gagal mereset password" },
      { status: 500 }
    );
  }
}
