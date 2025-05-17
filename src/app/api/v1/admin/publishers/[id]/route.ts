import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET Handler untuk mengambil penerbit berdasarkan ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { status: "error", message: "Invalid publisher ID" },
        { status: 400 }
      );
    }
    const publisher = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone_number: true,
        address: true,
        major: { select: { major_name: true } },
        createdAt: true,
      },
    });

    if (!publisher) {
      return NextResponse.json(
        { status: "error", message: "Publisher not found" },
        { status: 404 }
      );
    }

    const publisherWithStringPhone = {
      ...publisher,
      phone_number: publisher.phone_number
        ? publisher.phone_number.toString()
        : null,
    };

    return NextResponse.json({
      status: "success",
      data: publisherWithStringPhone,
    });
  } catch (error) {
    console.error("Error fetching publisher:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch publisher" },
      { status: 500 }
    );
  }
}

// // PUT Handler untuk memperbarui penerbit
// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const { id } = params;
//   const { name, email, address, phone_number } = await req.json();

//   try {
//     const updatedPublisher = await prisma.user.update({
//       where: { id: parseInt(id) },
//       data: {
//         name,
//         email,
//         address,
//         phone_number: phone_number ? BigInt(phone_number) : null,
//       },
//     });

//     return NextResponse.json({
//       status: "success",
//       message: "Publisher updated successfully",
//       data: updatedPublisher,
//     });
//   } catch (error) {
//     console.error("Error updating publisher:", error);
//     return NextResponse.json(
//       { status: "error", message: "Failed to update publisher" },
//       { status: 500 }
//     );
//   }
// }

// PUT Handler untuk memperbarui penerbit
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { name, email, address, phone_number } = await req.json();
  const publisherId = parseInt(id);
  if (isNaN(publisherId)) {
    return NextResponse.json(
      { status: "error", message: "Invalid publisher ID" },
      { status: 400 }
    );
  }

  let phoneNumberBigInt: bigint | null = null;
  if (phone_number) {
    if (!isNaN(Number(phone_number))) {
      try {
        phoneNumberBigInt = BigInt(phone_number);
      } catch {
        return NextResponse.json(
          { status: "error", message: "Invalid phone number format " },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { status: "error", message: "Phone number must be numeric" },
        { status: 400 }
      );
    }
  }

  try {
    const updatedPublisher = await prisma.user.update({
      where: { id: publisherId },
      data: {
        name,
        email,
        address,
        phone_number: phoneNumberBigInt,
      },
    });
    return NextResponse.json({
      status: "success",
      message: "Publisher updated successfully",
      data: {
        ...updatedPublisher,
        phone_number: updatedPublisher.phone_number
          ? updatedPublisher.phone_number.toString()
          : null,
      },
    });
  } catch (error) {
    let errorMessage = "Failed to update publisher";
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }
    return NextResponse.json(
      {
        status: "error",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

// DELETE Handler untuk menghapus penerbit (soft delete)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { status: "error", message: "ID is required" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: Number(id) },
      data: { deleted: true },
    });

    return NextResponse.json({
      status: "success",
      message: "User deleted (soft delete) successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
