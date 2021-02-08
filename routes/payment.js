const router = require(`express`).Router();
const paypal = require(`paypal-rest-sdk`);

// configure paypal with the credentials you got when you created your paypal app
paypal.configure({
    'mode': `sandbox`, //sandbox or live 
    'client_id': `${process.env.PP_CID}`, // please provide your client id here 
    'client_secret': `${process.env.PP_SID}` // provide your client secret here 
  });

router.post(`/purchase`, (req, res) => {
        // create payment object 
        var create_payment = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `${process.env.PP_RURL}`,
            "cancel_url": `${process.env.PP_CURL}`
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "IT Consulting",
                    "sku": "pd_1_0_0",
                    "price": "99.99",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "99.99"
            },
            "description": "This is the payment description."
        }]
    };
        //Make the payment
        paypal.payment.create(create_payment, (err, payment) => {
            if (err){
                console.log(err)
            } else {
                if(payment.payer.payment_method === `paypal`){
                    req.paymentId = payment.id;
                    var r_url;
                    console.log(payment);
                    for (var i=0; i<payment.links.length; i++){
                        var link = payment.links[i];
                        if (link.method === `REDIRECT`) {
                            r_url = link.href;
                        }          
                    }
                }
                res.redirect(r_url);
            }
        });
});

router.get(`/payment-success`, (req, res) => {
    var paymentId = req.query.paymentId;
    var payerId = {'payer_id': req.query.PayerID};
    paypal.payment.execute(paymentId, payerId, (err, payment) => {
        if (err){
            console.log(err);
        } else {
            if (payment.state == 'approved'){
                res.render(`payment/payment-success`);
            } else {
                res.redirect(`payment/payment-error`);
            }
        }
    })
    res.render(`payment/payment-success`);
});

router.get(`payment/payment-error`, (req, res) => {
    res.render(`payment/payment-error`);
});


module.exports = router;