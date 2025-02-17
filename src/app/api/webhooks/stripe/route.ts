import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
  typescript: true,
  appInfo: {
    name: 'Chartable',
    version: '0.1.0'
  },
  telemetry: false
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const sig = headersList.get('stripe-signature');
    
    if (!sig) {
      console.error('No Stripe signature found');
      return NextResponse.json({ error: 'No signature found' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      console.error('Stripe webhook verification failed:', err);
      return NextResponse.json({ error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const clientReferenceId = session.client_reference_id;
      
      if (!clientReferenceId) {
        console.error('No client reference ID found in session:', session.id);
        return NextResponse.json({ error: 'Missing client reference ID' }, { status: 400 });
      }

      try {
        await connectDB();
        
        // Get the purchased credits amount from metadata or line items
        const creditAmount = 5000; // Adjust based on your pricing table configuration
        
        // Update user's credit balance
        const updatedUser = await User.findByIdAndUpdate(
          clientReferenceId,
          { $inc: { wordCountBalance: creditAmount } },
          { new: true }
        );

        if (!updatedUser) {
          console.error(`User not found for ID: ${clientReferenceId}`);
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        console.log(`Credits updated for user ${clientReferenceId}. New balance: ${updatedUser.wordCountBalance}`);
      } catch (error) {
        console.error('Error updating user credits:', error);
        return NextResponse.json({ error: 'Failed to update user credits' }, { status: 500 });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Unexpected error in webhook handler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 