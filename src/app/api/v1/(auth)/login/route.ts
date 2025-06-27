import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { SessionUser } from "@/types/sessionUser";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    console.log("🧪 SECRET_KEY saat login:", process.env.SECRET_KEY); // ✅ Tempatkan di sini
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Buat session token
    const sessionUser: SessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      nidn: user.nidn,
      address: user.address,
      phone_number: user.phone_number
        ? String(user.phone_number)
        : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    const session = await createSession(sessionUser);
    const cookieStore = await cookies();
    cookieStore.set("session", session, {
      httpOnly: true,
      secure: false,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60,
      // maxAge: 120,
    });

    return NextResponse.json(
      { success: true, data: { token: session, role: user.role } },
      { status: 200 }
    );
  // } catch (error) {
  //   console.error("Login Error:", error);
  //   return NextResponse.json(
  //     { error: "Internal server error"  },
  //     { status: 500 }
  //   );
  // }
  //   } catch (error: any) {
  //   console.error("❌ Login Error:", error);

  //   return NextResponse.json(
  //     {
  //       error: error?.message || "Unknown error",
  //       stack: error?.stack || null,
  //       full: JSON.stringify(error),
  //     },
  //     { status: 500 }
  //   );
  // }
  } catch (error: unknown) {
    // Cek apakah error adalah instance dari class Error
    if (error instanceof Error) {
      console.error("❌ Login Error:", error);

      return NextResponse.json(
        {
          error: error.message,
          stack: error.stack || null,
          name: error.name || null,
        },
        { status: 500 }
      );
    }

    // Jika error bukan Error biasa
    console.error("❌ Login Error (non-Error object):", error);

    return NextResponse.json(
      {
        error: "Unknown error occurred",
        raw: JSON.stringify(error),
      },
      { status: 500 }
    );
  }

}
