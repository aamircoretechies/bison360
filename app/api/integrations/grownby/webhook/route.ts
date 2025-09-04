import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { systemLog } from '@/services/system-log';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import crypto from 'crypto';

// GrownBy webhook signature verification
function verifyGrownBySignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized request' },
        { status: 401 }
      );
    }

    const body = await request.text();
    const signature = request.headers.get('x-grownby-signature');
    const webhookSecret = process.env.GROWNBY_WEBHOOK_SECRET;

    if (!webhookSecret || !signature) {
      return NextResponse.json(
        { message: 'Missing webhook secret or signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    if (!verifyGrownBySignature(body, signature, webhookSecret)) {
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 401 }
      );
    }

    const webhookData = JSON.parse(body);
    const { event_type, data } = webhookData;

    // Process different webhook events
    switch (event_type) {
      case 'order.created':
        await handleOrderCreated(data);
        break;
      case 'order.updated':
        await handleOrderUpdated(data);
        break;
      case 'order.cancelled':
        await handleOrderCancelled(data);
        break;
      case 'payment.completed':
        await handlePaymentCompleted(data);
        break;
      case 'inventory.updated':
        await handleInventoryUpdated(data);
        break;
      default:
        console.log(`Unhandled webhook event: ${event_type}`);
    }

    // Log webhook event
    await systemLog({
      action: 'webhook_received',
      entity: 'grownby',
      entityId: data.id || 'unknown',
      details: `Webhook event: ${event_type}`,
      userId: session.user.id,
      meta: JSON.stringify({ event_type, data })
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('GrownBy webhook error:', error);
    return NextResponse.json(
      { message: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleOrderCreated(orderData: any) {
  // Create new order in database
  await prisma.grownByOrder.create({
    data: {
      externalId: orderData.id,
      orderNumber: orderData.order_number,
      customerName: orderData.customer.name,
      customerEmail: orderData.customer.email,
      status: 'pending',
      total: orderData.total_amount,
      items: orderData.items,
      platform: 'GrownBy',
      rawData: orderData,
      syncedAt: new Date()
    }
  });

  // Check inventory availability
  await checkInventoryAvailability(orderData.items);
}

async function handleOrderUpdated(orderData: any) {
  // Update existing order
  await prisma.grownByOrder.updateMany({
    where: { externalId: orderData.id },
    data: {
      status: orderData.status,
      total: orderData.total_amount,
      items: orderData.items,
      rawData: orderData,
      syncedAt: new Date()
    }
  });
}

async function handleOrderCancelled(orderData: any) {
  // Update order status to cancelled
  await prisma.grownByOrder.updateMany({
    where: { externalId: orderData.id },
    data: {
      status: 'cancelled',
      syncedAt: new Date()
    }
  });

  // Release inventory
  await releaseInventory(orderData.items);
}

async function handlePaymentCompleted(paymentData: any) {
  // Update order payment status
  await prisma.grownByOrder.updateMany({
    where: { externalId: paymentData.order_id },
    data: {
      paymentStatus: 'completed',
      paymentMethod: paymentData.payment_method,
      paymentId: paymentData.payment_id,
      syncedAt: new Date()
    }
  });
}

async function handleInventoryUpdated(inventoryData: any) {
  // Update inventory levels
  for (const item of inventoryData.items) {
    await prisma.inventory.updateMany({
      where: { sku: item.sku },
      data: {
        quantity: item.quantity,
        lastUpdated: new Date()
      }
    });
  }
}

async function checkInventoryAvailability(items: any[]) {
  const unavailableItems = [];
  
  for (const item of items) {
    const inventory = await prisma.inventory.findFirst({
      where: { sku: item.sku }
    });
    
    if (!inventory || inventory.quantity < item.quantity) {
      unavailableItems.push({
        sku: item.sku,
        requested: item.quantity,
        available: inventory?.quantity || 0
      });
    }
  }

  if (unavailableItems.length > 0) {
    // Create inventory alert
    await prisma.inventoryAlert.create({
      data: {
        type: 'insufficient_stock',
        items: unavailableItems,
        status: 'active',
        source: 'grownby_webhook'
      }
    });
  }
}

async function releaseInventory(items: any[]) {
  for (const item of items) {
    await prisma.inventory.updateMany({
      where: { sku: item.sku },
      data: {
        quantity: {
          increment: item.quantity
        }
      }
    });
  }
}
