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
      phone_number: user.phone_number ? user.phone_number.toString() : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    const session = await createSession(sessionUser);
    const cookieStore = await cookies();
    cookieStore.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60,
      // maxAge: 120,
    });

    return NextResponse.json(
      { success: true, data: { token: session, role: user.role } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
