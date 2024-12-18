import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET( req: NextRequest,
  { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({ where: { id: Number(params.id) } });
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const updatedProduct = await prisma.product.update({
      where: { id: Number(params.id) },
      data,
    });
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
