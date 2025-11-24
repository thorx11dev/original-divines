import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { productVariants, products } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const productIdInt = parseInt(id);

    if (!productIdInt || isNaN(productIdInt)) {
      return NextResponse.json(
        { error: 'Valid product ID is required', code: 'INVALID_PRODUCT_ID' },
        { status: 400 }
      );
    }

    // Fetch all variants for the product
    const variants = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, productIdInt));

    return NextResponse.json(variants, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const productIdInt = parseInt(id);

    if (!productIdInt || isNaN(productIdInt)) {
      return NextResponse.json(
        { error: 'Valid product ID is required', code: 'INVALID_PRODUCT_ID' },
        { status: 400 }
      );
    }

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productIdInt))
      .limit(1);

    if (product.length === 0) {
      return NextResponse.json(
        { error: 'Product not found', code: 'PRODUCT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, price, originalPrice, stock, isAvailable } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (price === undefined || price === null) {
      return NextResponse.json(
        { error: 'Price is required', code: 'MISSING_PRICE' },
        { status: 400 }
      );
    }

    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json(
        { error: 'Price must be a valid positive number', code: 'INVALID_PRICE' },
        { status: 400 }
      );
    }

    const variantData = {
      productId: productIdInt,
      name: name.trim(),
      price,
      originalPrice: originalPrice !== undefined ? originalPrice : null,
      stock: stock !== undefined ? stock : 0,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      createdAt: new Date().toISOString(),
    };

    const newVariant = await db
      .insert(productVariants)
      .values(variantData)
      .returning();

    return NextResponse.json(newVariant[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const productIdInt = parseInt(id);

    if (!productIdInt || isNaN(productIdInt)) {
      return NextResponse.json(
        { error: 'Valid product ID is required', code: 'INVALID_PRODUCT_ID' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const variantId = searchParams.get('id');

    if (!variantId || isNaN(parseInt(variantId))) {
      return NextResponse.json(
        { error: 'Valid variant ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const variantIdInt = parseInt(variantId);

    const existingVariant = await db
      .select()
      .from(productVariants)
      .where(
        and(
          eq(productVariants.id, variantIdInt),
          eq(productVariants.productId, productIdInt)
        )
      )
      .limit(1);

    if (existingVariant.length === 0) {
      return NextResponse.json(
        { error: 'Variant not found', code: 'VARIANT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, price, originalPrice, stock, isAvailable } = body;

    const updates: Record<string, any> = {};

    if (name !== undefined) {
      if (name.trim() === '') {
        return NextResponse.json(
          { error: 'Name cannot be empty', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    if (price !== undefined) {
      if (typeof price !== 'number' || price < 0) {
        return NextResponse.json(
          { error: 'Price must be a valid positive number', code: 'INVALID_PRICE' },
          { status: 400 }
        );
      }
      updates.price = price;
    }

    if (originalPrice !== undefined) {
      updates.originalPrice = originalPrice;
    }

    if (stock !== undefined) {
      if (typeof stock !== 'number' || stock < 0) {
        return NextResponse.json(
          { error: 'Stock must be a valid non-negative number', code: 'INVALID_STOCK' },
          { status: 400 }
        );
      }
      updates.stock = stock;
    }

    if (isAvailable !== undefined) {
      updates.isAvailable = isAvailable;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(existingVariant[0], { status: 200 });
    }

    const updatedVariant = await db
      .update(productVariants)
      .set(updates)
      .where(
        and(
          eq(productVariants.id, variantIdInt),
          eq(productVariants.productId, productIdInt)
        )
      )
      .returning();

    if (updatedVariant.length === 0) {
      return NextResponse.json(
        { error: 'Variant not found', code: 'VARIANT_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedVariant[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const productIdInt = parseInt(id);

    if (!productIdInt || isNaN(productIdInt)) {
      return NextResponse.json(
        { error: 'Valid product ID is required', code: 'INVALID_PRODUCT_ID' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const variantId = searchParams.get('id');

    if (!variantId || isNaN(parseInt(variantId))) {
      return NextResponse.json(
        { error: 'Valid variant ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const variantIdInt = parseInt(variantId);

    const existingVariant = await db
      .select()
      .from(productVariants)
      .where(
        and(
          eq(productVariants.id, variantIdInt),
          eq(productVariants.productId, productIdInt)
        )
      )
      .limit(1);

    if (existingVariant.length === 0) {
      return NextResponse.json(
        { error: 'Variant not found', code: 'VARIANT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(productVariants)
      .where(
        and(
          eq(productVariants.id, variantIdInt),
          eq(productVariants.productId, productIdInt)
        )
      )
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Variant not found', code: 'VARIANT_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Variant deleted successfully',
        deleted: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}