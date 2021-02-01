const router = require(`express`).Router();
const paypal = require(`paypal-rest-sdk`);

// configure paypal with the credentials you got when you created your paypal app
paypal.configure({
    'mode': `${process.env.PP_MODE}`, //sandbox or live 
    'client_id': `${process.env.PP_CID}`, // please provide your client id here 
    'client_secret': `${process.env.PP_SID}` // provide your client secret here 
  });

router.get(`/purchase`, (req, res) => {
        // create payment object 
        var payment = {
                "intent": "authorize",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `${process.env.PP_RURL}`,
            "cancel_url": `${process.env.PP_CURL}`
        },
        "transactions": [{
            "amount": {
                "total": 99.99,
                "currency": "USD"
            },
            "description": "CJay IT Consulting Session"
        }]
        }
        //Make the payment
        createPay(payment).then(
            (transaction) => {
                let id = transaction.id;
                let links = transaction.links;
                let counter = links.length;
                while (counter --){
                    if (links[counter].method == `REDIRECT`) {
                        return res.redirect(links[counter].href);
                    }
                }
            }
        ).catch( (err) => {
            console.log(err);
            res.redirect(`/payment/payment-error`);
        });
});

router.get(`/payment-success`, (req, res) => {
    res.render(`payment/payment-success`);
});

router.get(`/payment-error`, (req, res) => {
    res.render(`payment/payment-error`);
});

// helper functions 
const createPay = ( payment ) => {
    return new Promise( ( resolve , reject ) => {
        paypal.payment.create( payment , (err, payment) => {
         if ( err ) {
             reject(err); 
         }
        else {
            resolve(payment); 
        }
        }); 
    });
}	

module.exports = router;