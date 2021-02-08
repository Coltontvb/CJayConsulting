const router = require(`express`).Router();
const paypal = require(`paypal-rest-sdk`);

// configure paypal with the credentials you got when you created your paypal app
paypal.configure({
    'mode': `${process.env.PP_MODE}`, //sandbox or live 
    'client_id': `AXrfGv0jRfcl3HDkx-OQ62hL67dd7jOwi5Y_LCBBWN9U9xvP6UpUt6c4WUsA7aBSV-ibWncszDLs6dMA`, // please provide your client id here 
    'client_secret': `EC8l_v6YsWZDna1VqguCzcsOAlbm_keykvTJsYpeVkhZ60dLJ5owVPrfzJ_XXpbLmX7uprw96-378Byf` // provide your client secret here 
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