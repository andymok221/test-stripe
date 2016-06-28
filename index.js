'use strict';

const express = require('express');
const stripe = require('stripe')('sk_test_88qmPAjmtuzm1qD4qx9a0Buw');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.render('index');
});
app.post('/stripe', function (req, res) {
	stripe.charges.create({
		amount: 500, // amount in cents, again
		currency: "jpy",
		source: req.body.stripeToken,
		description: "Example charge"
	}, function(err, charge) {
		if (err && err.type === 'StripeCardError') {
		// The card has been declined
		}
		res.render('refund', {
			charge: charge
		});
	});
});
app.get('/refund/:id', function(req, res) {
	stripe.refunds.create({
		charge: req.params.id
	}, function(err, refund) {
		res.send(refund);
	});
})
 
app.listen(8000);
console.log('Server starts in port:8000');