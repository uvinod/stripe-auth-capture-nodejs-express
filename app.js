// modules
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const hbs = require('express-hbs');
const dotenv = require('dotenv');

// note that we load the process.env from `dotenv`
// before we start to load any of our own code.
const envfile = '.env';
dotenv.config({
  silent: true,
  path: `${__dirname}/${envfile}`,
});

// *now* load our custom Stripe charing module
// which we'll use in the router later on
const createCustomer = require('./createCustomer');
const chargeAuth = require('./chargeAuth');
const chargeCapture = require('./chargeCapture');
const retrieveCustomer = require('./retrieveCustomer');

// create the server, and all the routes and configuration
// go against this `app`
const app = express();

// render using handlebars, but use .html as the extention
app.engine('html', hbs.express3({ extname: '.html' }));
app.set('view engine', 'html');
app.set('views', __dirname);
app.disable('x-powered-by');

// expose `process` to the view templates
app.locals.process = process;

// serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// enable the body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// the router

// GET /
app.get('/', (req, res) => {
  res.render('index');
});

// GET /
app.get('/update', (req, res) => {
  retrieveCustomer(req).then(data => {
    console.log(data);
    return false;
  }).catch(error => {
    res.render('error', error);
  });
});

// POST /auth
app.post('/charge-auth', (req, res, next) => {

  //console.log(req.body);
  //return false;

  createCustomer(req).then(data => {
    const customerId = data.id;
    req.body.customerId = customerId;
    chargeAuth(req).then(data => {
      res.render('capture', {customerId: customerId, chargeId: data.id});
    }).catch(error => {
      res.render('error', error);
    });
  }).catch(error => {
    res.render('error', error);
  });

  
});

// POST /capture
app.post('/charge-capture', (req, res, next) => {  
  chargeCapture(req).then(data => {    
    //console.log(data);
    //return false;
    res.render('thanks', {receipt_url: data.receipt_url});
  }).catch(error => {
    res.render('error', error);
  });
});

// start
app.listen(process.env.PORT || 3000, () => {
  console.log('Listening');
});
