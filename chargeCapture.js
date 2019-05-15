// load the stripe module pass in your secret token
// this will configure the `stripe` object for your
// account that you created earlier
const stripe = require('stripe')(process.env.STRIPE_SECRET);

// this function will charge the user's card,
// note that `req` is the http request, we'll
// see how to connect this all up later.
module.exports = (req) => {
  return stripe.charges.capture(req.body.chargeId);
}
