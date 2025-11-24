import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const order = await db.select()
      .from(orders)
      .where(eq(orders.id, parseInt(id)))
      .limit(1);

    if (order.length === 0) {
      return NextResponse.json({ 
        error: 'Order not found',
        code: "ORDER_NOT_FOUND" 
      }, { status: 404 });
    }

    // Fetch order items for this order
    const items = await db.select()
      .from(orderItems)
      .where(eq(orderItems.orderId, parseInt(id)));

    return NextResponse.json({
      ...order[0],
      items
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const orderId = parseInt(id);

    // Check if order exists
    const existingOrder = await db.select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (existingOrder.length === 0) {
      return NextResponse.json({ 
        error: 'Order not found',
        code: "ORDER_NOT_FOUND" 
      }, { status: 404 });
    }

    const body = await request.json();
    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString()
    };

    // Allow updating specific fields
    if (body.status !== undefined) updates.status = body.status;
    if (body.customerName !== undefined) updates.customerName = body.customerName.trim();
    if (body.customerPhone !== undefined) updates.customerPhone = body.customerPhone.trim();
    if (body.customerAddress !== undefined) updates.customerAddress = body.customerAddress.trim();
    if (body.isConfirmedByTeam !== undefined) updates.isConfirmedByTeam = body.isConfirmedByTeam;
    if (body.isVerified !== undefined) updates.isVerified = body.isVerified;

    const updatedOrder = await db.update(orders)
      .set(updates)
      .where(eq(orders.id, orderId))
      .returning();

    return NextResponse.json(updatedOrder[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const orderId = parseInt(id);

    // Check if order exists
    const existingOrder = await db.select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (existingOrder.length === 0) {
      return NextResponse.json({ 
        error: 'Order not found',
        code: "ORDER_NOT_FOUND" 
      }, { status: 404 });
    }

    // Delete order items first (foreign key constraint)
    await db.delete(orderItems)
      .where(eq(orderItems.orderId, orderId));

    // Delete the order
    const deleted = await db.delete(orders)
      .where(eq(orders.id, orderId))
      .returning();

    return NextResponse.json({
      message: 'Order deleted successfully',
      order: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}
