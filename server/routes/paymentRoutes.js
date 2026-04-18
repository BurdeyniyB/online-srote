const Router = require('express')
const router = new Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const fetch = require('node-fetch')
const ApiError = require('../error/ApiError')

// ── Stripe ────────────────────────────────────────────────────────────────────
router.post('/create-intent', async (req, res, next) => {
  const { amount } = req.body

  if (!amount || amount <= 0) {
    return next(ApiError.badRequest('Invalid amount'))
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    })

    return res.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Stripe error:', error.message)
    return next(ApiError.internal('Failed to create payment intent'))
  }
})

// ── PayPal helpers ────────────────────────────────────────────────────────────
const PAYPAL_BASE = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com'

async function getPayPalToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  ).toString('base64')

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await res.json()
  if (!data.access_token) throw new Error('Failed to get PayPal token')
  return data.access_token
}

// ── PayPal: create order ──────────────────────────────────────────────────────
router.post('/paypal-order', async (req, res, next) => {
  const { amount } = req.body   // amount in cents

  if (!amount || amount <= 0) return next(ApiError.badRequest('Invalid amount'))

  try {
    const token = await getPayPalToken()

    const response = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: (amount / 100).toFixed(2),
            },
          },
        ],
      }),
    })

    const order = await response.json()
    if (!order.id) return next(ApiError.internal('PayPal order creation failed'))
    return res.json({ id: order.id })
  } catch (error) {
    console.error('PayPal create order error:', error.message)
    return next(ApiError.internal('Failed to create PayPal order'))
  }
})

// ── PayPal: capture order ─────────────────────────────────────────────────────
router.post('/paypal-capture/:orderID', async (req, res, next) => {
  const { orderID } = req.params

  try {
    const token = await getPayPalToken()

    const response = await fetch(
      `${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json()
    if (data.status !== 'COMPLETED') {
      return next(ApiError.internal('PayPal capture failed'))
    }
    return res.json(data)
  } catch (error) {
    console.error('PayPal capture error:', error.message)
    return next(ApiError.internal('Failed to capture PayPal order'))
  }
})

// ── Stripe: refund ────────────────────────────────────────────────────────────
router.post('/stripe-refund', async (req, res, next) => {
  const { paymentIntentId } = req.body
  if (!paymentIntentId) return next(ApiError.badRequest('paymentIntentId is required'))

  try {
    const refund = await stripe.refunds.create({ payment_intent: paymentIntentId })
    return res.json({ refundId: refund.id, status: refund.status })
  } catch (error) {
    console.error('Stripe refund error:', error.message)
    return next(ApiError.internal('Failed to refund Stripe payment'))
  }
})

// ── PayPal: refund capture ────────────────────────────────────────────────────
router.post('/paypal-refund/:captureId', async (req, res, next) => {
  const { captureId } = req.params

  try {
    const token = await getPayPalToken()

    const response = await fetch(
      `${PAYPAL_BASE}/v2/payments/captures/${captureId}/refund`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }
    )

    const data = await response.json()
    return res.json(data)
  } catch (error) {
    console.error('PayPal refund error:', error.message)
    return next(ApiError.internal('Failed to refund PayPal payment'))
  }
})

module.exports = router
