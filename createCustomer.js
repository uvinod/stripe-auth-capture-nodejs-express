// load the stripe module pass in your secret token
// this will configure the `stripe` object for your
// account that you created earlier
const stripe = require('stripe')(process.env.STRIPE_SECRET);

// this function will charge the user's card,
// note that `req` is the http request, we'll
// see how to connect this all up later.
module.exports = (req) => {
  // the token is generated by Stripe and POST'ed
  // to the `action` URL in our form
  const token = req.body.stripeToken;
  const email = req.body.stripeEmail;

  // now we create a charge which returns a `promise`
  // so we need to make sure we correctly handle
  // success and failure, but that's outside of this
  // function (and we'll see it later)
  return stripe.customers.create({
    source: token,    
    email: email,
  });
}
