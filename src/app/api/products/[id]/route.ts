import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products, productVariants, productSizes, productImages } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, parseInt(id)))
      .limit(1);

    if (product.length === 0) {
      return NextResponse.json(
        { error: 'Product not found', code: 'PRODUCT_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Fetch related data
    const variants = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, parseInt(id)));

    const sizes = await db
      .select()
      .from(productSizes)
      .where(eq(productSizes.productId, parseInt(id)));

    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, parseInt(id)))
      .orderBy(asc(productImages.displayOrder));

    return NextResponse.json({
      ...product[0],
      variants,
      sizes,
      images,
    });
  } catch (error) {
    console.error('GET error:', error);
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

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Check if product exists
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, parseInt(id)))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json(
        { error: 'Product not found', code: 'PRODUCT_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Validate mediaType if provided
    if (body.mediaType && body.mediaType !== 'image' && body.mediaType !== 'video') {
      return NextResponse.json(
        {
          error: 'Media type must be "image" or "video"',
          code: 'INVALID_MEDIA_TYPE',
        },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.slug !== undefined) updateData.slug = body.slug.trim();
    if (body.description !== undefined) updateData.description = body.description.trim();
    if (body.categoryId !== undefined) updateData.categoryId = parseInt(body.categoryId);
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.originalPrice !== undefined) {
      updateData.originalPrice = body.originalPrice ? parseFloat(body.originalPrice) : null;
    }
    if (body.stock !== undefined) updateData.stock = parseInt(body.stock);
    if (body.mediaType !== undefined) updateData.mediaType = body.mediaType;
    if (body.mediaSrc !== undefined) updateData.mediaSrc = body.mediaSrc.trim();
    if (body.mediaPoster !== undefined) {
      updateData.mediaPoster = body.mediaPoster ? body.mediaPoster.trim() : null;
    }
    if (body.isAvailable !== undefined) updateData.isAvailable = body.isAvailable;

    const updated = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
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

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, parseInt(id)))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json(
        { error: 'Product not found', code: 'PRODUCT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(products)
      .where(eq(products.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Product deleted successfully',
      product: deleted[0],
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
