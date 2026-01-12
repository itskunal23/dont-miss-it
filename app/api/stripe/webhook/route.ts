import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id

        if (!userId) {
          console.error('No user_id in session metadata')
          break
        }

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        // Upsert subscription record
        await supabase.from('subscriptions').upsert({
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        } as never)

        // Update profile to pro
        await supabase
          .from('profiles')
          .update({ plan: 'pro' } as never)
          .eq('id', userId)

        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by customer ID
        const { data: subRecord } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!subRecord) break

        if (subscription.status === 'active') {
          // Update subscription
          await supabase
            .from('subscriptions')
            .update({
              status: subscription.status,
              current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            } as never)
            .eq('user_id', (subRecord as { user_id: string }).user_id)

          await supabase
            .from('profiles')
            .update({ plan: 'pro' } as never)
            .eq('id', (subRecord as { user_id: string }).user_id)
        } else {
          // Downgrade to free
          await supabase
            .from('subscriptions')
            .update({
              status: subscription.status,
              current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            } as never)
            .eq('user_id', (subRecord as { user_id: string }).user_id)

          await supabase
            .from('profiles')
            .update({ plan: 'free' } as never)
            .eq('id', (subRecord as { user_id: string }).user_id)
        }

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
