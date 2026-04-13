const Router = require('express')
const router = new Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const ApiError = require('../error/ApiError')

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

module.exports = router
