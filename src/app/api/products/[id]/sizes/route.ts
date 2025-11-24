import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { productSizes, products } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    // Validate id is valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: "Valid product ID is required",
          code: "INVALID_PRODUCT_ID" 
        },
        { status: 400 }
      );
    }

    const productIdInt = parseInt(id);

    // Fetch all sizes for the product
    const sizes = await db
      .select()
      .from(productSizes)
      .where(eq(productSizes.productId, productIdInt));

    return NextResponse.json(sizes, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error as Error).message 
      },
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
    
    // Validate id is valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: "Valid product ID is required",
          code: "INVALID_PRODUCT_ID" 
        },
        { status: 400 }
      );
    }

    const productIdInt = parseInt(id);

    // Verify product exists
    const product = await db.select()
      .from(products)
      .where(eq(products.id, productIdInt))
      .limit(1);

    if (product.length === 0) {
      return NextResponse.json(
        { 
          error: "Product not found",
          code: "PRODUCT_NOT_FOUND" 
        },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { size } = body;

    // Validate required field
    if (!size || typeof size !== 'string' || size.trim() === '') {
      return NextResponse.json(
        { 
          error: "Size is required and must be a non-empty string",
          code: "MISSING_SIZE" 
        },
        { status: 400 }
      );
    }

    // Create new product size
    const newSize = await db.insert(productSizes)
      .values({
        productId: productIdInt,
        size: size.trim(),
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newSize[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error as Error).message 
      },
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
    const { searchParams } = new URL(request.url);
    const sizeId = searchParams.get('id');

    // Validate id is valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: "Valid product ID is required",
          code: "INVALID_PRODUCT_ID" 
        },
        { status: 400 }
      );
    }

    // Validate sizeId is valid integer
    if (!sizeId || isNaN(parseInt(sizeId))) {
      return NextResponse.json(
        { 
          error: "Valid size ID is required",
          code: "INVALID_SIZE_ID" 
        },
        { status: 400 }
      );
    }

    const productIdInt = parseInt(id);
    const sizeIdInt = parseInt(sizeId);

    // Check if size exists and belongs to the specified product
    const existingSize = await db.select()
      .from(productSizes)
      .where(
        and(
          eq(productSizes.id, sizeIdInt),
          eq(productSizes.productId, productIdInt)
        )
      )
      .limit(1);

    if (existingSize.length === 0) {
      return NextResponse.json(
        { 
          error: "Size not found",
          code: "SIZE_NOT_FOUND" 
        },
        { status: 404 }
      );
    }

    // Delete the size
    const deleted = await db.delete(productSizes)
      .where(
        and(
          eq(productSizes.id, sizeIdInt),
          eq(productSizes.productId, productIdInt)
        )
      )
      .returning();

    return NextResponse.json({
      message: "Size deleted successfully",
      deleted: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error as Error).message 
      },
      { status: 500 }
    );
  }
}