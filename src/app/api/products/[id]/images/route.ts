import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { productImages } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    // Validate id
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid product ID is required', code: 'INVALID_PRODUCT_ID' },
        { status: 400 }
      );
    }

    const productId = parseInt(id);

    // Fetch all images for the product
    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(asc(productImages.displayOrder));

    return NextResponse.json(images, { status: 200 });
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
    
    // Validate id
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid product ID is required', code: 'INVALID_PRODUCT_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { imageUrl, displayOrder } = body;

    // Validate required fields
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'imageUrl is required', code: 'MISSING_IMAGE_URL' },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedImageUrl = imageUrl.trim();

    // Prepare insert data
    const insertData = {
      productId: parseInt(id),
      imageUrl: sanitizedImageUrl,
      displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : 0,
      createdAt: new Date().toISOString(),
    };

    // Insert the image
    const newImage = await db.insert(productImages)
      .values(insertData)
      .returning();

    return NextResponse.json(newImage[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
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
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('id');

    // Validate id
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid product ID is required', code: 'INVALID_PRODUCT_ID' },
        { status: 400 }
      );
    }

    // Validate imageId
    if (!imageId || isNaN(parseInt(imageId))) {
      return NextResponse.json(
        { error: 'Valid image ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const imageIdInt = parseInt(imageId);
    const productIdInt = parseInt(id);

    // Check if image exists and belongs to the product
    const existingImage = await db.select()
      .from(productImages)
      .where(and(eq(productImages.id, imageIdInt), eq(productImages.productId, productIdInt)))
      .limit(1);

    if (existingImage.length === 0) {
      return NextResponse.json(
        { error: 'Image not found', code: 'IMAGE_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete the image
    const deleted = await db.delete(productImages)
      .where(and(eq(productImages.id, imageIdInt), eq(productImages.productId, productIdInt)))
      .returning();

    return NextResponse.json({
      message: 'Image deleted successfully',
      image: deleted[0],
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}