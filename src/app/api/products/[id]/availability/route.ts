import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid product ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const productId = parseInt(id);

    // Fetch current product
    const currentProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (currentProduct.length === 0) {
      return NextResponse.json(
        { 
          error: 'Product not found',
          code: 'PRODUCT_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      productId: currentProduct[0].id,
      isAvailable: currentProduct[0].isAvailable,
      stock: currentProduct[0].stock
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
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

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid product ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const productId = parseInt(id);

    // Fetch current product
    const currentProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (currentProduct.length === 0) {
      return NextResponse.json(
        { 
          error: 'Product not found',
          code: 'PRODUCT_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Toggle isAvailable
    const newIsAvailable = !currentProduct[0].isAvailable;

    // Update product
    const updatedProduct = await db
      .update(products)
      .set({
        isAvailable: newIsAvailable,
        updatedAt: new Date().toISOString()
      })
      .where(eq(products.id, productId))
      .returning();

    return NextResponse.json(updatedProduct[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}