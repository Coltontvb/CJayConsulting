const router = require(`express`).Router();
const stripe = require(`stripe`)(process.env.STRIPE_SK);

//Create a customer and store them based on their input
router.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'IT Consulting',
            },
            unit_amount: 99.99 * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.YOUR_DOMAIN}payment/payment-success`,
      cancel_url: `${process.env.YOUR_DOMAIN}payment/payment-error`,
    });
    res.json({ id: session.id });
  });

router.get(`/payment-success`, (req, res) => {
    res.render(`payment/payment-success`);
});

router.get(`/payment-error`, (req, res) => {
    res.render(`payment/payment-error`);
});


module.exports = router;